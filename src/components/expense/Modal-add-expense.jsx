import React from "react";
import Modal from "react-modal";

function ModalAddExpense({
    modalIsOpen,
    closeModal,
    packageType,
    packageCount,
    setPackageCount,
    saveExpense,
}) {
    ////////////////////////////validaciones input solo numeros
    const handleChange = (e) => {
        const value = e.target.value;
        const regex = /^\d*$/;

        if (regex.test(value)) {
            setPackageCount(value);
        } else {
        }
    };
    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Cantidad de paquetes"
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
            <h2>Paquetes de {packageType}</h2>
            <div className="modal-edit">
                <div className="modal-edit__input">
                    <input
                        type="number"
                        value={packageCount}
                        onChange={handleChange}
                        style={{ padding: "8px", marginRight: "4px" }}
                    />
                </div>
                <div className="modal-edit__buttons">
                    <button
                        onClick={saveExpense}
                        className="btn btn-primary"
                        style={{ padding: "10px", marginRight: "4px" }}
                        disabled={!packageCount.trim() || packageCount < 1}
                    >
                        Guardar
                    </button>
                    <button
                        onClick={closeModal}
                        className="btn btn-danger"
                        style={{ padding: "10px" }}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default ModalAddExpense;
