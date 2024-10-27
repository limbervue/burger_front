import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import axios from 'axios'

function Inventory() {
    /////////////////////////////////////////////////
    const apiUrl = import.meta.env.VITE_API_URL
    //////////////////////////////////////////////////
    const [products, setProducts] = useState([])
    const [mensaje, setMensaje] = useState('')
    const [modalIsOpenReset, setModalIsOpenReset] = useState(false)

    useEffect(() => {
        getIngredientsInv()
    }, [])

    //obtner ingredientes de inventario
    const getIngredientsInv = async () => {
        try {
            const response = await axios.get(`${apiUrl}/inventory`)
            setProducts(response.data)
        } catch (error) {
            console.error('There was a problem with the axios request:', error)
        }
    }

    //VACIAR INVENTARIO
    const resetInventory = async () => {
        try {
            const response = await axios.put(
                `${apiUrl}/reset-inventory/`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
            const data = response.data
            console.log(data)
            // Actualizar la lista de productos en el frontend
            const updatedGatos = products.map((gasto) => ({
                ...gasto,
                total_unidades: 0,
            }))

            setProducts(updatedGatos)
            setMensaje(data.message)
            setModalIsOpenReset(false)
            getIngredientsInv()
        } catch (error) {
            console.error('Error al restablecer los valores:', error)
            setMensaje('Hubo un error al restablecer los valores.')
        }
    }

    /////////////////////////////////////////////////////////////////////RETURN
    return (
        <div className=" burguer_table price-burguer">
            <h1 className="mb-4 ">Inventario de Ingredientes</h1>
            <div className="table-responsive burguer_table__content-table price-burguer__content-table">
                <table className="table table-striped table-bordered table-dark">
                    <thead className="thead-dark">
                        <tr>
                            <th class="long-name-inv">Producto</th>
                            <th class="short-name-inv">Producto</th>
                            <th class="long-name-inv">Stock unidades</th>
                            <th class="short-name-inv">Unidades</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td>{product.ingredientName}</td>
                                <td>{product.total_units}</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={3}>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => setModalIsOpenReset(true)}
                                >
                                    Vaciar Inventario
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Modal
                    isOpen={modalIsOpenReset}
                    onRequestClose={() => setModalIsOpenReset(false)}
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
                    <div className="modal-edit">
                        <h2>{'vaciar inventario?'}</h2>
                        <div className="modal-edit__buttons">
                            <button
                                onClick={() => resetInventory()}
                                class="btn btn-primary"
                                style={{ padding: '10px', marginRight: '4px' }}
                            >
                                Aceptar
                            </button>
                            <button
                                onClick={() => setModalIsOpenReset(false)}
                                class="btn btn-danger"
                                style={{ padding: '10px', marginRight: '4px' }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default Inventory
