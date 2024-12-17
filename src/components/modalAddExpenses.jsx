import Modal from 'react-modal';
export function ModalAddExpenses({
  modalIsOpen,
  setModalIsOpen,
  setMensaje,
  mensaje,
  handleChange,
  manejarAñadirPaquete,
  cantidadPaquetes,
  setCantidadPaquetes,
  product, 
  getText,
}){
  return(
    <div>
      {/* Modal para añadir paquetes */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Añadir Paquete"
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
          
        <h2>Paquetes de {getText(product)}</h2>
        <div className='modalContent'>
          <div className="modalContent__input">
            <input
              type="number"
              min="1"
              value={cantidadPaquetes}
              style={{
                padding: '8px',
                marginRight: '4px',
              }}
              onChange={(event) =>
                handleChange(event, setCantidadPaquetes)
              }
            />

            <div className="modal-edit__buttons">
              <button
                onClick={manejarAñadirPaquete}
                className="btn btn-primary"
                style={{ padding: '10px', marginRight: '4px' }}
                disabled={cantidadPaquetes === 0}
              >
                          Añadir
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