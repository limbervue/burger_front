import React, { useState } from "react";
import Modal from "react-modal";

function ModalDeleteEh({
    modalIsOpen,
    closeModal,
    selectedTime,
    idPdf,
    updateInventoryByPdf,
    deleteHistoryExpense,
}) {
    const [message, setMessage] = useState("");
    const [showMessageModal, setShowMessageModal] = useState(false);

    const handleDelete = async () => {
        try {
            await updateInventoryByPdf();
            const message = await deleteHistoryExpense();
            setMessage(message);
            setShowMessageModal(true);
        } catch (error) {
            setMessage("Error eliminando el PDF");
            setShowMessageModal(true);
        }
    };

    return (
        <>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
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
                <h2>borrar {selectedTime} ?</h2>
                <button
                    onClick={handleDelete}
                    className="btn btn-primary"
                    style={{ padding: "10px", marginRight: "4px" }}
                >
                    Aceptar
                </button>
                <button
                    onClick={closeModal}
                    className="btn btn-danger"
                    style={{ padding: "10px" }}
                >
                    Cancelar
                </button>
            </Modal>

            <Modal
                isOpen={showMessageModal}
                onRequestClose={() => setShowMessageModal(false)}
                contentLabel="Response Message"
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
                <h2>{message}</h2>
                <button
                    onClick={() => setShowMessageModal(false)}
                    className="btn btn-danger"
                    style={{ padding: "10px" }}
                >
                    Ok
                </button>
            </Modal>
        </>
    );
}

export default ModalDeleteEh;
