import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import ClipLoader from 'react-spinners/ClipLoader';

export function HistoryPurchase() {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [expenses, setExpenses] = useState([]); // Lista de gastos
  const [id, setId] = useState([]);
  const [code, setCode] = useState([]);
  const [detailsExpenses, setDetailsExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(false); // Estado de carga

  useEffect(() => {
    getExpenses(); // Obtener lista de gastos cuando el componente se monte
  }, []);

  // Función para obtener el historial de gastos
  const getExpenses = async() => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/purchases`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpenses(response.data); // Actualizar la lista de gastos
    } catch (error) {
      console.error(
        'There was a problem with the fetch operation:',
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener los detalles de un gasto específico
  const getDetailsExpenses = async(expense) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiUrl}/details-expense/${expense._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log('detalles desde front:', response.data);

      // Verificar si la respuesta tiene el campo detalles como arreglo
      if (Array.isArray(response.data.details)) {
        setDetailsExpenses(response.data.details); // Asigna el arreglo detalles
      } else {
        console.error(
          'El campo \'detalles\' no es un arreglo:',
          response.data.details,
        );
        setDetailsExpenses([]); // Establecer un arreglo vacío si 'detalles' no es un arreglo
      }

      setSelectedExpense(expense); // Guardar el gasto seleccionado
      setIsModalOpen(true); // Abrir el modal
    } catch (error) {
      console.error(
        'There was a problem with the fetch operation:',
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleclickDetailsExpense = (id, code) => {
    setId(id);
    setCode(code);
    setIsModalOpenDelete(true);
  };
  const deleteExpense = async() => {
    setLoading(true);
    try {
      const response = await axios.delete(`${apiUrl}/purchase/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMensaje(response.data.message);
      setId('');
    } catch (error) {
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        console.error(
          'Error de respuesta del servidor:',
          error.response.data,
        );
        console.error('Código de estado:', error.response.status);
        console.error('Encabezados:', error.response.headers);
      } else if (error.request) {
        // La solicitud fue hecha pero no hubo respuesta
        console.error('No se recibió respuesta:', error.request);
      } else {
        // Algo pasó al configurar la solicitud que provocó un error
        console.error(
          'Error al configurar la solicitud:',
          error.message,
        );
      }
    } finally {
      setLoading(false); // Finaliza la carga en el bloque finally para asegurar que se oculte el cargando, tenga éxito o error.
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
    doc.text('Detalles de Gasto', 14, 22);

    // Detalles de gasto
    doc.setFontSize(12);
    doc.text(`Fecha: ${selectedExpense.date}`, 14, 40);
    doc.text(`Hora: ${selectedExpense.time}`, 14, 50);

    // Crea la tabla
    const tableData = detailsExpenses.map((detalle) => [
      getText(detalle.ingredient_name),
      detalle.package,
      detalle.units,
      Number(detalle.total).toFixed(2),
    ]);

    // Define colores para las filas
    const darkGray = [211, 211, 211]; // Gris oscuro

    doc.autoTable({
      head: [['Ingrediente', 'Paquetes', 'Unidades', 'Total']],
      body: tableData,
      startY: 60,
      styles: {
        cellPadding: 4,
        fontSize: 10,
        textColor: [0, 0, 0], // Texto en negro para las filas
        halign: 'center', // Centro
      },
      headStyles: {
        fillColor: darkGray, // Color oscuro para la cabecera
        textColor: [0, 0, 0], // Texto en blanco para la cabecera
      },
    });

    // Total
    const totalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Total: ${selectedExpense.total.toFixed(2)}`, 14, totalY);

    // Abre el PDF en una nueva ventana
    doc.output('dataurlnewwindow');
  };
  //para obtener el nombre sin numero
  const getText = (name) => {
    const parts = name.split('-'); // Divide el nombre en partes
    return parts.length > 1 ? parts.slice(1).join('-') : ''; // Toma la parte después del guion
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
              <tr key={hg._id}>
                <td>{hg.code}</td>
                <td>{hg.date}</td>
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
                      handleclickDetailsExpense(
                        hg._id,
                        hg.code,
                      )
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
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgb(27, 27, 27)',
              color: 'white',
              border: '2px solid rgb(221, 189, 92)',
            },
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)', // Cambia esto al color que desees
            },
          }}
        >
          <div className="content-modal__detalles-gasto">
            <h2>Detalles de Gasto</h2>
            <span
              
              onClick={closeModal}
            >
                            X
            </span>
            {selectedExpense && (
              <div>
                <br />
                <h5>Fecha: {selectedExpense.date}</h5>
                <h5>Hora: {selectedExpense.time}</h5>
                <br />
                <div
                  style={{
                    maxHeight: '250px',
                    overflowY: 'scroll',
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
                        <tr key={detalle._id}>
                          <td>
                            {getText(
                              detalle.ingredient_name,
                            )}
                          </td>
                          <td>{detalle.package}</td>
                          <td>{detalle.units}</td>
                          <td>
                            {Number(
                              detalle.total,
                            ).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <br />
                <h3>
                    Total: {selectedExpense.total.toFixed(2)}
                </h3>
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
          isOpen={isModalOpenDelete && !loading}
          onRequestClose={() => setIsModalOpenDelete(false)}
          contentLabel="Editar Precio"
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
            },
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)', // Cambia esto al color que desees
            },
          }}
        >
          <h2>Borrar el registro {code}?</h2>
          <div className="modal-edit">
            <div className="modal-edit__buttons">
              <div>
                <button
                  onClick={deleteExpense}
                  className="btn btn-primary modal-edit__buttons__save"
                  style={{
                    padding: '10px',
                    marginRight: '4px',
                  }}
                >
                                    ok
                </button>
                <button
                  onClick={() => setIsModalOpenDelete(false)}
                  className="btn btn-danger"
                  style={{ padding: '10px' }}
                >
                                    Cancelar
                </button>
              </div>
            </div>
          </div>
        </Modal>

        {/* Indicador de Carga con Spinner */}
        {loading && (
          <div className="loading">
            <ClipLoader color="#000" loading={true} size={50} />
          </div>
        )}
        {mensaje && (
          <Modal
            isOpen={mensaje !== ''}
            onRequestClose={() => setMensaje('')}
            contentLabel="Mensaje"
            style={{
              content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
              },
              overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
              },
            }}
          >
            <div className="modal-mensaje">
              <h2>{mensaje}</h2>
              <button
                onClick={() => setMensaje('')}
                className="btn btn-danger"
                style={{ padding: '6px' }}
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
