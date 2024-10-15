import React from "react";
import Modal from "react-modal";

function ModalResetExpense({
    modalIsOpen,
    closeModal,
    packageType,
    resetExpense,
}) {
    return (
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
            <h2>Vaciar el stock de {packageType} ?</h2>
            <button
                onClick={resetExpense}
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
    );
}

export default ModalResetExpense;
