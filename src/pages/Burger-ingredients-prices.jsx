import React, { useState, useEffect, useCallback } from 'react'
import Modal from 'react-modal'
import axios from 'axios'
import ClipLoader from 'react-spinners/ClipLoader'
Modal.setAppElement('#root')

function BurgerIngredientsPrices() {
    /////////////////////////////////////////////////
    const apiUrl = import.meta.env.VITE_API_URL
    console.log('La apiUrl es...: ' + apiUrl)
    //////////////////////////////////////////////////
    const [productos, setProductos] = useState([])
    const [id, setId] = useState(null)
    const [price_porcion, setPricePorcion] = useState('')
    const [price_paquete, setPricePaquete] = useState('')
    const [units, setUnits] = useState('')
    const [product, setProduct] = useState('')
    const [price_porcionDB, setPricePorcionDB] = useState('')
    const [price_paqueteDB, setPricePaqueteDB] = useState('')
    const [unitsDB, setUnitsDB] = useState('')
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [mensaje, setMensaje] = useState('')
    const [loading, setLoading] = useState(false) // Estado de carga
    useEffect(() => {
        getIngredients()
    }, [])

    const getIngredients = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const response = await axios.get(`${apiUrl}/ingredients`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setProductos(response.data.ingredients)
            console.log(response.data.userId)
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
    const handleEditClick = (
        id,
        product,
        price_paquete,
        price_porcion,
        units
    ) => {
        setId(id)
        const paquete = parseFloat(price_paquete)
        const porcion = parseFloat(price_porcion)
        const unidades = parseInt(units, 10)

        setPricePaquete(paquete.toFixed(2))
        setPricePorcion(porcion.toFixed(2))
        setUnits(unidades)
        setProduct(product)

        setPricePaqueteDB(paquete.toFixed(2))
        setPricePorcionDB(porcion.toFixed(2))
        setUnitsDB(unidades)

        setModalIsOpen(true)
    }
    //para obtener el nombre del ingrediente despues del guion
    const getText = (name) => {
        const parts = name.split('-') // Divide el nombre en partes
        return parts.length > 1 ? parts.slice(1).join('-') : '' // Toma la parte después del guion
    }
    //al dar click en guardar se ejecuta esta funcion
    const handleSaveClick = async () => {
        setLoading(true)
        try {
            const response = await axios.put(`${apiUrl}/ingredient/${id}`, {
                precio_paquete: price_paquete,
                precio_porcion: price_porcion,
                unidades: units,
            })
            setProductos(
                productos.map((producto) =>
                    producto.id === id
                        ? {
                              ...producto,
                              precio_paquete: price_paquete,
                              precio_porcion: price_porcion,
                              unidades: units,
                          }
                        : producto
                )
            )
            setModalIsOpen(false)
            setId(null)
            setPricePaquete('')
            setPricePorcion('')
            setUnits('')
            setProduct('')
            setMensaje(response.data.message)
            getIngredients()
        } catch (error) {
            console.error('Error al actualizar los precios:', error)
        } finally {
            setLoading(true)
        }
    }

    //para validar que solo se ingresen numeros y estos numero puedes ser
    const validarNumberFloat = (valor) => {
        const regex = /^\d*\.?\d{0,2}$/
        return regex.test(valor)
    }

    const validarNumeroEntero = (valor) => {
        const regex = /^\d*$/ // Solo acepta dígitos
        return regex.test(valor)
    }

    // Función handleChange que utiliza ambas validaciones
    const handleChange = (event, setter, tipo) => {
        const valor = event.target.value

        if (
            (tipo === 'flotante' && validarNumberFloat(valor)) ||
            (tipo === 'entero' && validarNumeroEntero(valor)) ||
            valor === ''
        ) {
            setter(valor)
        } else {
            console.error('El valor ingresado no es válido.')
        }
    }

    // Función que verifica si ambos inputs tienen valores
    const todosLosInputsLlenos = useCallback(() => {
        return price_paquete !== '' && price_porcion !== '' && units !== ''
    }, [price_paquete, price_porcion, units])

    // Función que compara los valores de los inputs con los valores de la base de datos
    const compararValores = useCallback(() => {
        return (
            price_paquete === price_paqueteDB &&
            price_porcion === price_porcionDB &&
            parseInt(units, 10) === parseInt(unitsDB, 10)
        )
    }, [
        price_paquete,
        price_porcion,
        units,
        price_paqueteDB,
        price_porcionDB,
        unitsDB,
    ])

    //////////////////////////////////////////////////////////////////////////
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
                            <h2>{producto.name}</h2>
                            <p className="precio">
                                <strong>$ Paquete:</strong> $
                                {producto.package_price.toFixed(2)}
                            </p>
                            <p className="precio">
                                <strong>$ Porción:</strong> $
                                {producto.portion_price.toFixed(2)}
                            </p>
                            <p className="precio">
                                <strong>Unidades:</strong>
                                {producto.package_content}
                            </p>
                            <div className="grid-burger">
                                <img src="/ingre.png" alt="" />
                            </div>
                        </div>
                        <div className="grid-button">
                            <button
                                onClick={() =>
                                    handleEditClick(
                                        producto._id,
                                        producto.name,
                                        producto.package_price,
                                        producto.portion_price,
                                        producto.package_content
                                    )
                                }
                                className="btn btn-success"
                            >
                                <img src="/edit_img.png" alt="Editar" />
                            </button>
                        </div>
                    </div>
                ))}

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
                    <div className="modal-edit">
                        <div className="modal-edit__input">
                            <h3>Editar {getText(product)}</h3>
                            <h4>$ Paquete</h4>
                            <input
                                type="text"
                                value={price_paquete}
                                style={{ padding: '8px', marginRight: '4px' }}
                                onChange={(event) =>
                                    handleChange(
                                        event,
                                        setPricePaquete,
                                        'flotante'
                                    )
                                }
                            />
                            <h4>$ Porcion</h4>
                            <input
                                type="text"
                                value={price_porcion}
                                style={{ padding: '8px', marginRight: '4px' }}
                                onChange={(event) =>
                                    handleChange(
                                        event,
                                        setPricePorcion,
                                        'flotante'
                                    )
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
                                onClick={handleSaveClick}
                                class="btn btn-primary"
                                style={{ padding: '10px', marginRight: '4px' }}
                                disabled={
                                    !todosLosInputsLlenos() || compararValores()
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
                            class="btn btn-danger"
                            style={{ padding: '6px' }}
                        >
                            Cerrar
                        </button>
                    </Modal>
                )}
            </div>
        </div>
    )
}

export default BurgerIngredientsPrices
