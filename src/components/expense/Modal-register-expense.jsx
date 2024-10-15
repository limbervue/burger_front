import React from "react";
import Modal from "react-modal";

function ModalRegisterExpense({ modalIsOpen, closeModal, message }) {
    return (
        <>
            {message && (
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Mensaje de Confirmación"
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
                        onClick={closeModal}
                        className="btn btn-danger"
                        style={{ padding: "10px", marginTop: "20px" }}
                    >
                        Cerrar
                    </button>
                </Modal>
            )}
        </>
    );
}

export default ModalRegisterExpense;
