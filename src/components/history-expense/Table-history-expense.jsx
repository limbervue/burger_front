import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import jsPDF from "jspdf";
import "jspdf-autotable";

function TableHistoryExpense() {
    const apiUrl = import.meta.env.VITE_API_URL;

    const [expenses, setExpenses] = useState([]); // Lista de gastos
    const [id, setId] = useState([]);
    const [detailsExpenses, setDetailsExpenses] = useState([]);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        getExpenses(); // Obtener lista de gastos cuando el componente se monte
    }, []);

    // Función para obtener el historial de gastos
    const getExpenses = async () => {
        try {
            const response = await axios.get(`${apiUrl}/history-expenses`);
            setExpenses(response.data); // Actualizar la lista de gastos
        } catch (error) {
            console.error(
                "There was a problem with the fetch operation:",
                error
            );
        }
    };

    // Función para obtener los detalles de un gasto específico
    const getDetailsExpenses = async (expense) => {
        try {
            const response = await axios.get(
                `${apiUrl}/details-expense/${expense.id}`
            );
            console.log("Response from API:", response.data);

            // Verificar si la respuesta tiene el campo detalles como arreglo
            if (Array.isArray(response.data.detalles)) {
                setDetailsExpenses(response.data.detalles); // Asigna el arreglo detalles
            } else {
                console.error(
                    "El campo 'detalles' no es un arreglo:",
                    response.data.detalles
                );
                setDetailsExpenses([]); // Establecer un arreglo vacío si 'detalles' no es un arreglo
            }

            setSelectedExpense(expense); // Guardar el gasto seleccionado
            setIsModalOpen(true); // Abrir el modal
        } catch (error) {
            console.error(
                "There was a problem with the fetch operation:",
                error
            );
        }
    };

    const handleclickDetailsExpense = (id) => {
        setId(id);
        setIsModalOpenDelete(true);
    };
    const deleteDetailsExpense = async () => {
        try {
            const response = await axios.delete(`${apiUrl}/expense/${id}`);
            setMensaje(response.data.message);
            setId("");
        } catch (error) {
            if (error.response) {
                // El servidor respondió con un código de estado fuera del rango 2xx
                console.error(
                    "Error de respuesta del servidor:",
                    error.response.data
                );
                console.error("Código de estado:", error.response.status);
                console.error("Encabezados:", error.response.headers);
            } else if (error.request) {
                // La solicitud fue hecha pero no hubo respuesta
                console.error("No se recibió respuesta:", error.request);
            } else {
                // Algo pasó al configurar la solicitud que provocó un error
                console.error(
                    "Error al configurar la solicitud:",
                    error.message
                );
            }
        }
        getExpenses();
        setIsModalOpenDelete(false);
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedExpense(null); // Limpiar el gasto seleccionado al cerrar el modal
        setDetailsExpenses([]); // Limpiar los detalles del gasto
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        // Título del documento
        doc.setFontSize(22);
        doc.text("Detalles de Gasto", 14, 22);

        // Detalles de gasto
        doc.setFontSize(12);
        doc.text(`Fecha: ${selectedExpense.fecha}`, 14, 40);
        doc.text(`Hora: ${selectedExpense.hora}`, 14, 50);

        // Crea la tabla
        const tableData = detailsExpenses.map((detalle) => [
            detalle.ingrediente.nombre,
            detalle.paquetes,
            detalle.unidades,
            Number(detalle.total).toFixed(2),
        ]);

        // Define colores para las filas
        const darkGray = [211, 211, 211]; // Gris oscuro

        doc.autoTable({
            head: [["Ingrediente", "Paquetes", "Unidades", "Total"]],
            body: tableData,
            startY: 60,
            styles: {
                cellPadding: 4,
                fontSize: 10,
                textColor: [0, 0, 0], // Texto en negro para las filas
                halign: "center", // Centro
            },
            headStyles: {
                fillColor: darkGray, // Color oscuro para la cabecera
                textColor: [0, 0, 0], // Texto en blanco para la cabecera
            },
        });

        // Total
        const totalY = doc.lastAutoTable.finalY + 10;
        doc.text(`Total: ${selectedExpense.total}`, 14, totalY);

        // Abre el PDF en una nueva ventana
        doc.output("dataurlnewwindow");
    };

    return (
        <div className="burguer_table price-burguer">
            <h1 className="mb-4">Historial de Gastos</h1>
            <div className="table-responsive burguer_table__content-table price-burguer__content-table">
                <table className="table table-striped table-bordered table-dark">
                    <thead className="thead-dark">
                        <tr>
                            <th>Id</th>
                            <th className="long-name-hg">Fecha</th>
                            <th className="short-name-hg">Fecha</th>
                            <th className="long-name-hg">Total</th>
                            <th className="short-name-hg">Total</th>
                            <th className="long-name-hg">detalle</th>
                            <th className="short-name-hg">ver</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((hg) => (
                            <tr key={hg.id}>
                                <td>{hg.id}</td>
                                <td>{hg.fecha}</td>
                                <td>{Number(hg.total).toFixed(2)}</td>
                                <td>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => getDetailsExpenses(hg)}
                                    >
                                        <img src="/ver-img.png" alt="" />
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() =>
                                            handleclickDetailsExpense(hg.id)
                                        }
                                    >
                                        <img src="/delete_img.png" alt="" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal para mostrar los detalles del gasto */}
            <div className="content-modal">
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    style={{
                        content: {
                            top: "50%",
                            left: "50%",
                            right: "auto",
                            bottom: "auto",
                            marginRight: "-50%",
                            transform: "translate(-50%, -50%)",
                            background: "rgb(27, 27, 27)",
                            color: "white",
                            border: "2px solid rgb(221, 189, 92)",
                        },
                        overlay: {
                            backgroundColor: "rgba(0, 0, 0, 0.8)", // Cambia esto al color que desees
                        },
                    }}
                >
                    <div className="content-modal__detalles-gasto">
                        <h2>Detalles de Gasto</h2>
                        <span
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "20px",
                                cursor: "pointer",
                                fontSize: "25px",
                            }}
                            onClick={closeModal}
                        >
                            X
                        </span>
                        {selectedExpense && (
                            <div>
                                <br />
                                <h5>Fecha: {selectedExpense.fecha}</h5>
                                <h5>Hora: {selectedExpense.hora}</h5>
                                <br />
                                <div
                                    style={{
                                        maxHeight: "250px",
                                        overflowY: "scroll",
                                    }}
                                >
                                    <table className="table table-striped table-bordered table-dark">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th>Ingrediente</th>
                                                <th>Paquetes</th>
                                                <th>Unidades</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {detailsExpenses.map((detalle) => (
                                                <tr key={detalle.id}>
                                                    <td>
                                                        {
                                                            detalle.ingrediente
                                                                .nombre
                                                        }
                                                    </td>
                                                    <td>{detalle.paquetes}</td>
                                                    <td>{detalle.unidades}</td>
                                                    <td>
                                                        {Number(
                                                            detalle.total
                                                        ).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <br />
                                <h3>Total: {selectedExpense.total}</h3>
                            </div>
                        )}
                    </div>

                    {/* <button className="btn btn-danger" onClick={closeModal}>
                        Cerrar
                    </button> */}
                    <button className="btn btn-danger " onClick={generatePDF}>
                        Pdf
                    </button>
                </Modal>

                <Modal
                    isOpen={isModalOpenDelete}
                    onRequestClose={() => setIsModalOpenDelete(false)}
                    contentLabel="Editar Precio"
                    style={{
                        content: {
                            top: "50%",
                            left: "50%",
                            right: "auto",
                            bottom: "auto",
                            marginRight: "-50%",
                            transform: "translate(-50%, -50%)",
                        },
                        overlay: {
                            backgroundColor: "rgba(0, 0, 0, 0.8)", // Cambia esto al color que desees
                        },
                    }}
                >
                    <h2>Borrar el registro {id}?</h2>
                    <div class="modal-edit">
                        <div class="modal-edit__buttons">
                            <div>
                                <button
                                    onClick={deleteDetailsExpense}
                                    class="btn btn-primary modal-edit__buttons__save"
                                    style={{
                                        padding: "10px",
                                        marginRight: "4px",
                                    }}
                                >
                                    ok
                                </button>
                                <button
                                    onClick={() => setIsModalOpenDelete(false)}
                                    class="btn btn-danger"
                                    style={{ padding: "10px" }}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>

                {mensaje && (
                    <Modal
                        isOpen={mensaje !== ""}
                        onRequestClose={() => setMensaje("")}
                        contentLabel="Mensaje"
                        style={{
                            content: {
                                top: "50%",
                                left: "50%",
                                right: "auto",
                                bottom: "auto",
                                marginRight: "-50%",
                                transform: "translate(-50%, -50%)",
                            },
                            overlay: {
                                backgroundColor: "rgba(0, 0, 0, 0.8)",
                            },
                        }}
                    >
                        <div className="precio-mensaje">
                            <h2>{mensaje}</h2>
                            <button
                                onClick={() => setMensaje("")}
                                class="btn btn-danger"
                                style={{ padding: "6px" }}
                            >
                                Cerrar
                            </button>
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    );
}

export default TableHistoryExpense;
