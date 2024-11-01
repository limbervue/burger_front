// src/App.js
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Modal from 'react-modal'
import ClipLoader from 'react-spinners/ClipLoader'

// import "./App.css";

Modal.setAppElement('#root')

function Expenses() {
    const apiUrl = import.meta.env.VITE_API_URL
    const [id, setId] = useState(null)
    const [code, setCode] = useState(null)
    const [price_porcion, setPricePorcion] = useState('')
    const [price_paquete, setPricePaquete] = useState('')
    const [units, setUnits] = useState('')
    const [product, setProduct] = useState('')
    const [ingredientes, setIngredientes] = useState([])
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [cantidadPaquetes, setCantidadPaquetes] = useState(0)
    const [tablaTemporal, setTablaTemporal] = useState(() => {
        // Recuperar datos del localStorage al inicializar
        const savedData = localStorage.getItem('tablaTemporal')
        return savedData ? JSON.parse(savedData) : []
    })
    const [mensaje, setMensaje] = useState('')
    const [loading, setLoading] = useState(false) // Estado de carga

    // Petición a la API para obtener los ingredientes
    useEffect(() => {
        getIngredients()

        // Recuperar tabla temporal desde localStorage
        const savedData = localStorage.getItem('tablaTemporal')
        if (savedData) {
            setTablaTemporal(JSON.parse(savedData))
        }
    }, [])
    //////////////////////////////////////////////////////////////////
    const getIngredients = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${apiUrl}/ingredients`)
            setIngredientes(response.data)
            console.log('datos...', response.data)
        } catch (error) {
            console.error(
                'There was a problem with the fetch operation:',
                error
            )
        } finally {
            setLoading(false)
        }
    }
    ///////////////////////////////////////////////////////////
    useEffect(() => {
        if (tablaTemporal.length > 0) {
            localStorage.setItem('tablaTemporal', JSON.stringify(tablaTemporal))
        }
    }, [tablaTemporal])
    ////////////////////////////////////////////////////////
    const expenses = async () => {
        setLoading(true)
        try {
            const tablaTemporalNumerica = tablaTemporal.map((item) => ({
                ...item,
                paquetes: parseInt(item.paquetes, 10),
                precioPaquete: parseFloat(item.precioPaquete),
                total: parseFloat(item.total),
            }))

            console.log(
                'Datos a enviar:',
                JSON.stringify(tablaTemporalNumerica, null, 2)
            )
            if (tablaTemporal.length === 0) return

            const response = await axios.post(`${apiUrl}/save-expenses`, {
                ingredientes: tablaTemporalNumerica, ///cambie de tablatemporal
            })
            setMensaje(response.data.message)
            console.log(response.data)
            console.log(response.data.message)
        } catch (error) {
            console.error('Error al enviar los datos:', error)
        } finally {
            setLoading(false) // Finaliza la carga
            setTablaTemporal([]) // Limpia la tabla temporal
            localStorage.removeItem('tablaTemporal') // Limpia el localStorage
        }
    }
    //////////////////////////////////////////////////////////////////
    const handleAddClick = (
        id,
        price_paquete,
        price_porcion,
        units,
        product,
        code
    ) => {
        setId(id)
        const paquete = parseFloat(price_paquete)
        const porcion = parseFloat(price_porcion)
        const unidades = parseInt(units, 10)

        setPricePaquete(paquete.toFixed(2))
        setPricePorcion(porcion.toFixed(2))
        setUnits(unidades)
        setProduct(product)
        setCode(code)
        setModalIsOpen(true)
        console.log(code)
    }
    //para mostrar solo nombre sinnumero
    const getText = (name) => {
        const parts = name.split('-') // Divide el nombre en partes
        return parts.length > 1 ? parts.slice(1).join('-') : '' // Toma la parte después del guion
    }
    const manejarAñadirPaquete = () => {
        if (!id) return

        // Verifica si el ingrediente ya está en la tabla temporal
        const existente = tablaTemporal.find((item) => item.id === id)

        if (existente) {
            // Actualiza la cantidad de paquetes existente
            const actualizado = tablaTemporal.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          paquetes: item.paquetes + cantidadPaquetes,
                          unidades:
                              (item.paquetes + cantidadPaquetes) *
                              item.unidadesPorPaquete,
                          total:
                              (item.paquetes + cantidadPaquetes) *
                              item.precioPaquete,
                      }
                    : item
            )
            setTablaTemporal(actualizado)
        } else {
            // Agrega un nuevo ingrediente a la tabla temporal
            setTablaTemporal([
                ...tablaTemporal,
                {
                    id: id,
                    code: code,
                    nombre: product,
                    paquetes: cantidadPaquetes,
                    unidades: cantidadPaquetes * units,
                    total: cantidadPaquetes * price_paquete,
                    unidadesPorPaquete: units,
                    precioPaquete: price_paquete,
                },
            ])
        }
        setCantidadPaquetes(0)
        setModalIsOpen(false)
    }
    ////////////////////////////////////////validar que sea un numero entero
    const validarNumeroEntero = (valor) => {
        const regex = /^\d*$/ // Solo acepta dígitos
        return regex.test(valor)
    }

    const handleChange = (event, setter, tipo) => {
        const valor = event.target.value

        if (
            validarNumeroEntero(valor) ||
            valor === '' // Permitir que el input quede vacío
        ) {
            setter(valor)
        } else {
            console.error('El valor ingresado no es válido.')
        }
    }
    ////////////////////////////////////////////////elimnar el registro de la tabla temporal
    const handleDeleteClick = (id) => {
        // Lógica para eliminar el ingrediente con el id correspondiente
        const nuevaTablaTemporal = tablaTemporal.filter(
            (item) => item.id !== id
        )
        setTablaTemporal(nuevaTablaTemporal)
    }

    return (
        <div className="burguer_table price-burguer">
            <h1 className="mb-4">Gastos de Ingredientes</h1>
            <div className="table-responsive burguer_table__content-table price-burguer__content-table">
                {/* Indicador de Carga con Spinner */}
                {loading && (
                    <div
                        className="loading"
                        style={{ textAlign: 'center', marginBottom: '10px' }}
                    >
                        <ClipLoader color="#000" loading={true} size={50} />
                    </div>
                )}
                <table className="table table-striped table-bordered table-dark">
                    <thead className="thead-dark">
                        <tr>
                            <th class="long-name-hg">Ingrediente</th>
                            <th class="short-name-hg">Ingrednt</th>
                            <th class="long-name-hg">Paquetes</th>
                            <th class="short-name-hg">Paq</th>
                            <th class="long-name-hg">Unidades</th>
                            <th class="short-name-hg">Und</th>
                            <th class="long-name-hg">Total</th>
                            <th class="short-name-hg">Total</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {ingredientes.map((ingrediente) => {
                            const itemTemporal = tablaTemporal.find(
                                (item) => item.id === ingrediente._id
                            )
                            return (
                                <tr key={ingrediente._id}>
                                    <td>{getText(ingrediente.name)}</td>
                                    <td>
                                        {itemTemporal
                                            ? itemTemporal.paquetes
                                            : 0}
                                    </td>
                                    <td>
                                        {itemTemporal
                                            ? itemTemporal.unidades
                                            : 0}
                                    </td>
                                    <td>
                                        {itemTemporal
                                            ? itemTemporal.total.toFixed(2)
                                            : '0.00'}
                                    </td>
                                    <td>
                                        <div className="buttons-inv">
                                            <div className="buttons-inv__button">
                                                <button
                                                    onClick={() =>
                                                        handleAddClick(
                                                            ingrediente._id,
                                                            ingrediente.package_price,
                                                            ingrediente.portion_price,
                                                            ingrediente.package_content,
                                                            ingrediente.name,
                                                            ingrediente.code
                                                        )
                                                    }
                                                    className="btn btn-success"
                                                    disabled={!!itemTemporal}
                                                >
                                                    <img
                                                        src="../add_img.png"
                                                        alt=""
                                                    />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDeleteClick(
                                                            ingrediente._id
                                                        )
                                                    }
                                                    className="btn btn-danger ml-2"
                                                    disabled={!itemTemporal}
                                                >
                                                    <img
                                                        src="../delete_img.png"
                                                        alt=""
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        <tr>
                            <td colSpan={5}>
                                <button
                                    className="btn btn-primary"
                                    disabled={tablaTemporal.length === 0}
                                    onClick={expenses}
                                >
                                    Registrar
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

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
                <div className="modal-edit">
                    <div className="modal-edit__input">
                        <h3>Paquetes de {getText(product)}</h3>
                        <div>
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
                        </div>
                    </div>

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
    )
}

export default Expenses
