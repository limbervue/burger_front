import Modal from 'react-modal';
export function ModalEditBurger({
  modalIsOpen,
  setModalIsOpen,
  name,
  price,
  setPrice,
  handleChange,
  getNumber,
  setMensaje,
  mensaje,
  savePrice,
  inputLleno,
  compararValores,
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
            backgroundColor: 'rgba(0, 0, 0, 0.8)', // Cambia esto al color que desees
            zIndex: '9',
          },
        }}
      >
        <h2>Editar Burger {getNumber(name)}</h2>
        <div className="modalContent">
          <div className="modalContent__input">
            <input
              type="text"
              value={price}
              onChange={(event) => handleChange(event, setPrice)}
              style={{ padding: '8px', marginRight: '4px' }}
            />
          </div>

          <div className="modal-edit__buttons">
            <div>
              <button
                onClick={savePrice}
                className="btn btn-primary modal-edit__buttons__save"
                style={{
                  padding: '10px',
                  marginRight: '4px',
                }}
                disabled={!inputLleno() || compararValores()}
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
              backgroundColor: 'rgba(0, 0, 0, 0.8)', // Cambia esto al color que desees
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
