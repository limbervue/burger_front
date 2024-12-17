import Modal from 'react-modal';

export function ModalUpdatePassword({
  modalIsOpen,
  setModalIsOpen,
  savePassword,
  actualPassword,
  setActualPassword,
  newPassword,
  handlePasswordChange,
  passwordMessage,
  handleChange,
  mensaje,
  setMensaje,
}) {
  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
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
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          },
        }}
      >
        <div className="modalContent">
          <div className="modalContent__input">
            <h3>Cambiar contraseña</h3>
            <h4>actual</h4>
            <input
              type="text"
              value={actualPassword}
              onChange={(event) =>
                handleChange(event, setActualPassword)
              }
              style={{ padding: '8px', marginRight: '4px' }}
            />
          </div>
          <h4>Nueva </h4>
          <input
            type="text"
            value={newPassword}
            onChange={handlePasswordChange}
            style={{ padding: '8px', marginRight: '4px' }}
          />
          <div className="validate-password">
            <p>{passwordMessage}</p>
          </div>

          <div className="modal-edit__buttons">
            <div>
              <button
                onClick={savePassword}
                className="btn btn-primary modal-edit__buttons__save"
                style={{
                  padding: '10px',
                  marginRight: '4px',
                }}
                // disabled={!inputLleno() || compararValores()}
              >
                                Guardar
              </button>
              <button
                onClick={() => setModalIsOpen(false)}
                className="btn btn-danger"
                style={{ padding: '10px' }}
              >
                                Cancelar
              </button>
            </div>
          </div>
        </div>
      </Modal>
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
          <div className="precio-mensaje">
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
  );
}
