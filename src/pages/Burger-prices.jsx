import React, { useState, useEffect, useCallback } from 'react'
import Modal from 'react-modal'
import axios from 'axios'
import ClipLoader from 'react-spinners/ClipLoader'

Modal.setAppElement('#root')
function BurgerPrices() {
    const apiUrl = import.meta.env.VITE_API_URL

    console.log('apiUrl es : ' + apiUrl)
    const [productos, setProductos] = useState([])
    const [id, setId] = useState(null)
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [priceDB, setPriceDB] = useState('')
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [mensaje, setMensaje] = useState('')
    const [loading, setLoading] = useState(false) // Estado de carga

    useEffect(() => {
        getBurgers()
    }, [])

    const getBurgers = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${apiUrl}/burgers`)
            setProductos(response.data)
            console.log('datos de hamburguesas..', response.data) // Imprime los datos obtenidos de la API
        } catch (error) {
            console.error(
                'There was a problem with the fetch operation:',
                error
            )
        } finally {
            setLoading(false)
        }
    }

    //al hacer click en editar se ejecuta esta funcion
    const handleEditClick = (id, price_burger, name) => {
        console.log('id recibido: ' + id)
        console.log('precio recibido: ' + price_burger)
        setId(id)
        const precio = parseFloat(price_burger)
        setName(name)
        setPrice(precio.toFixed(2))
        setPriceDB(precio.toFixed(2))

        setModalIsOpen(true)
    }
    //para obtener el numero del nombre de la burger
    const getNumber = (name) => {
        return name.split('-')[0] // Toma la parte antes del guion
    }
    ///////////////////////////////////////guardar el precio
    const handleSaveClick = async () => {
        console.log('ID:', id)
        console.log('precio:', price)
        setLoading(true)
        try {
            const response = await axios.put(`${apiUrl}/burger/${id}`, {
                precio: price,
            })

            setProductos(
                productos.map((producto) =>
                    producto.id === id
                        ? { ...producto, precio: price }
                        : producto
                )
            )

            setModalIsOpen(false)
            setId(null)
            setPrice('')
            setMensaje(response.data.message)
            getBurgers()
        } catch (error) {
            console.error('Error al actualizar el precio:', error)
        } finally {
            setLoading(false)
        }
    }
    ///////////////////////////////////////////////////////////

    // Función para validar que solo se ingresen números o decimales
    const validarNumberFloat = (valor) => {
        const regex = /^\d+(\.\d{0,2})?$/
        return regex.test(valor)
    }

    // Función handleChange que utiliza la validación
    const handleChange = (event, setter) => {
        const valor = event.target.value

        if (validarNumberFloat(valor) || valor === '') {
            setter(valor)
        }
    }

    // Función que verifica si el input tiene valor
    const inputLleno = useCallback(() => {
        return price !== ''
    }, [price])

    // Función que compara el valor del input con el valor de la base de datos
    const compararValores = useCallback(() => {
        return price === priceDB
    }, [price, priceDB])

    return (
        <div className="burguer-grid price-burguer">
            {loading && (
                <div
                    className="loading"
                    style={{ textAlign: 'center', marginBottom: '10px' }}
                >
                    <ClipLoader color="#000" loading={true} size={50} />
                </div>
            )}
            <div className="grid-container">
                {productos.map((producto) => (
                    <div className="grid-item" key={producto._id}>
                        <div className="grid-data">
                            <h2>{producto.type}</h2>
                            <p className="ingredientes">
                                <strong>Ingredientes:</strong>{' '}
                                {producto.ingredients
                                    .map((ingredient) => ingredient.name)
                                    .join(', ')}
                            </p>
                            <p className="precio">
                                <strong>Precio:</strong> $
                                {producto.price.toFixed(2)}
                            </p>
                            <div className="grid-burger">
                                <img src="/burger.png" alt="" />
                            </div>
                        </div>
                        <div className="grid-button">
                            <button
                                onClick={() => {
                                    console.log(producto)
                                    handleEditClick(
                                        producto.id,
                                        producto.price,
                                        producto.type
                                    )
                                }}
                                className="btn btn-success"
                            >
                                <img src="/edit_img.png" alt="Editar" />
                            </button>
                        </div>
                    </div>
                ))}
                {/* /////////////aqui el modal */}
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
                        },
                    }}
                >
                    <h2>Editar Burger {getNumber(name)}</h2>
                    <div class="modal-edit">
                        <div class="modal-edit__input">
                            <input
                                type="text"
                                value={price}
                                onChange={(event) =>
                                    handleChange(event, setPrice)
                                }
                                style={{ padding: '8px', marginRight: '4px' }}
                            />
                        </div>

                        <div class="modal-edit__buttons">
                            <div>
                                <button
                                    onClick={handleSaveClick}
                                    class="btn btn-primary modal-edit__buttons__save"
                                    style={{
                                        padding: '10px',
                                        marginRight: '4px',
                                    }}
                                    disabled={
                                        !inputLleno() || compararValores()
                                    }
                                >
                                    Guardar
                                </button>
                                <button
                                    onClick={() => setModalIsOpen(false)}
                                    class="btn btn-danger"
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
                                class="btn btn-danger"
                                style={{ padding: '6px' }}
                            >
                                Cerrar
                            </button>
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    )
}

export default BurgerPrices
