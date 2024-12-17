import Modal from 'react-modal';
export function ModalEditIngredient({ 
  modalIsOpen,
  setModalIsOpen,
  price_paquete,
  price_porcion,
  units,
  setPricePaquete,
  setPricePorcion,
  setUnits,
  mensaje,
  setMensaje,
  product,
  handleChange,
  saveValues,
  inputLlenos,
  compararValores,
  getName }) {
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
            <h3>Editar {getName(product)}</h3>
            <h4>$ Paquete</h4>
            <input
              type="text"
              value={price_paquete}
              style={{ padding: '8px', marginRight: '4px' }}
              onChange={(event) =>
                handleChange(event, setPricePaquete, 'flotante')
              }
            />
            <h4>$ Porcion</h4>
            <input
              type="text"
              value={price_porcion}
              style={{ padding: '8px', marginRight: '4px' }}
              onChange={(event) =>
                handleChange(event, setPricePorcion, 'flotante')
              }
            />
            <h4>Unidades</h4>
            <input
              type="text"
              value={units}
              style={{ padding: '8px', marginRight: '4px' }}
              onChange={(event) =>
                handleChange(event, setUnits, 'entero')
              }
            />
          </div>

          <div className="modal-edit__buttons">
            <button
              onClick={saveValues}
              className="btn btn-primary"
              style={{ padding: '10px', marginRight: '4px' }}
              disabled={
                !inputLlenos() || compararValores()
              }
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
          <h2>{mensaje}</h2>
          <button
            onClick={() => setMensaje('')}
            className="btn btn-danger"
            style={{ padding: '6px' }}
          >
                        Cerrar
          </button>
        </Modal>
      )}
    </div>
  );
}
