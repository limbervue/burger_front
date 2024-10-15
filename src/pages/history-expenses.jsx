import React, { useState, useEffect } from "react";
import TableHistoryExpense from "../components/history-expense/Table-history-expense";
import ModalDeleteEh from "../components/history-expense/Modal-delete-eh";
import axios from "axios";

const HistoryExpenses = () => {
    /////////////////////////////////////////////////
    const apiUrl = import.meta.env.VITE_API_URL;

    const [productos, setProductos] = useState([]);
    const [dataPdf, setDataPdf] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [idPdf, setIdPdf] = useState("");
    const [error, setError] = useState(null);

    const [modalIsOpenDeleteHg, setModalIsOpenDeleteHg] = useState(false);
    const openModalDeleteHg = () => setModalIsOpenDeleteHg(true);
    const closeModalDeleteHg = () => setModalIsOpenDeleteHg(false);

    useEffect(() => {
        getHistoryExpenses();
    }, []);

    // Obtener historial de gastos
    const getHistoryExpenses = async () => {
        try {
            const response = await axios.get(`${apiUrl}/history-expenses`);

            // Procesar cada entrada para manejar el PDF en Base64
            const productsPdf = response.data.map((item) => {
                if (item.pdf_base64) {
                    // Crear un blob desde el Base64 y generar una URL
                    const pdfBlob = new Blob(
                        [
                            Uint8Array.from(atob(item.pdf_base64), (c) =>
                                c.charCodeAt(0)
                            ),
                        ],
                        { type: "application/pdf" }
                    );
                    const pdfUrl = URL.createObjectURL(pdfBlob);
                    return { ...item, pdfUrl }; // Agregar pdfUrl al objeto
                }
                return item;
            });

            setProductos(productsPdf); // Actualizar el estado con los datos modificados
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Error fetching data");
        }
    };

    const handleClickDelete = (id, time) => {
        console.log("Hora de gasto es:", time);
        console.log("ID de gasto es:", id);
        setSelectedTime(time);
        setIdPdf(id);
        openModalDeleteHg();
    };
    /////////////////////////////////////////obtener datos del pdf
    const getDataPdf = async (id) => {
        try {
            const response = await fetch(
                `${apiUrl}/pdf-expense/get-data-pdf-expense.php/${id}`
            );

            if (!response.ok) {
                throw new Error(
                    `Error al obtener los datos del PDF: ${response.statusText}`
                );
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(
                    `Error en la respuesta del servidor: ${result.error}`
                );
            }

            setDataPdf(result.data);
        } catch (error) {
            console.error("Error al obtener los datos del PDF:", error);
            throw error; // Propaga el error para manejarlo más arriba si es necesario
        }
    };

    ////////////////////////actualizar inventario con datos obtenidos
    const updateInventoryByPdf = async () => {
        try {
            const response = await fetch(
                `${apiUrl}/inventory/put-inventory_pdf-expenses.php`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataPdf),
                }
            );

            if (response.ok) {
                console.log("Inventario actualizado correctamente");
            } else {
                console.error("Error al actualizar el inventario");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    };
    //////////////////////////////////////////////////eliminar historial pdf
    const deleteHistoryExpense = async () => {
        try {
            const response = await fetch(
                `${apiUrl}/history-expenses/delete-history-expenses.php/${idPdf}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || "Network response was not ok"
                );
            }
            const data = await response.json();
            console.log(data.message);
            setIdPdf("");
            setSelectedTime(null);
            await getHistoryExpenses();
            return data.message;
        } catch (error) {
            console.error("Error deleting PDF:", error);
            setError("Error deleting PDF");
        } finally {
            closeModalDeleteHg();
        }
    };

    return (
        <div className="expenses-container">
            {error && <p className="error-message">{error}</p>}
            <TableHistoryExpense
                productos={productos}
                handleClickDelete={handleClickDelete}
                getDataPdf={getDataPdf}
            />
            <ModalDeleteEh
                modalIsOpen={modalIsOpenDeleteHg}
                closeModal={closeModalDeleteHg}
                selectedTime={selectedTime}
                deleteHistoryExpense={deleteHistoryExpense}
                updateInventoryByPdf={updateInventoryByPdf}
            />
        </div>
    );
};

export default HistoryExpenses;
