import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import axios from 'axios'
import ClipLoader from 'react-spinners/ClipLoader'
import {
    getIngredientsInvService,
    resetInventoryService,
} from '../services/inventoryService'

export function Inventory() {
    /////////////////////////////////////////////////
    const apiUrl = import.meta.env.VITE_API_URL
    //////////////////////////////////////////////////
    const [products, setProducts] = useState([])
    const [mensaje, setMensaje] = useState('')
    const [modalIsOpenReset, setModalIsOpenReset] = useState(false)
    const [loading, setLoading] = useState(false) // Estado de carga
    const token = localStorage.getItem('token')

    useEffect(() => {
        getIngredientsInv()
    }, [])

    //obtner ingredientes de inventario
    const getIngredientsInv = async () => {
        setLoading(true)
        try {
            const data = await getIngredientsInvService(token)
            setProducts(data)
            console.log('datos de hamburguesas:', data)
        } catch (error) {
            console.error('Error al obtener las hamburguesas:', error)
        } finally {
            setLoading(false)
        }
    }
    //para obtener el nombre sin numero
    const getText = (name) => {
        const parts = name.split('-') // Divide el nombre en partes
        return parts.length > 1 ? parts.slice(1).join('-') : '' // Toma la parte después del guion
    }
    //VACIAR INVENTARIO
    const resetInventory = async () => {
        try {
            const data = await resetInventoryService(token)

            // Actualizar la lista de productos en el frontend
            const updatedProducts = products.map((product) => ({
                ...product,
                total_unidades: 0,
            }))
            setProducts(updatedProducts)

            // Mostrar mensaje de éxito
            setMensaje(data.message)
            setModalIsOpenReset(false)

            // Refrescar los datos relacionados (ingredientes en este caso)
            getIngredientsInv()
        } catch (error) {
            console.error(error.message)
            setMensaje(error.message)
        }
    }

    /////////////////////////////////////////////////////////////////////RETURN
    return (
        <div className=" burguer_table price-burguer">
            <h1 className="mb-4 ">Inventario de Ingredientes</h1>
            <div className="table-responsive burguer_table__content-table price-burguer__content-table">
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
                            <th class="long-name-inv">Producto</th>
                            <th class="short-name-inv">Producto</th>
                            <th class="long-name-inv">Stock unidades</th>
                            <th class="short-name-inv">Unidades</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{getText(product.name)}</td>
                                <td>{product.total}</td>
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
