import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import ClipLoader from 'react-spinners/ClipLoader'
import Modal from 'react-modal'

function Login({ username, setUsername, password, setPassword }) {
    const apiUrl = import.meta.env.VITE_API_URL
    const navigate = useNavigate()
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [mensaje, setMensaje] = useState('')
    const [loading, setLoading] = useState(false) // Estado de carga
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        // Redirige a home si ya existe un token en localStorage
        if (localStorage.getItem('token')) {
            navigate('/home')
        }
    }, [navigate])

    ////////////////////////////////////
    const visiblePassword = () => {
        setShowPassword(!showPassword)
    }
    ////////////////////////////////
    const resetCredentials = () => {
        setUsername('')
        setPassword('')
    }
    ///////////////////////////////////
    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()
        try {
            console.log('credenciales ingresadas', username + ' ' + password)
            const response = await axios.post(`${apiUrl}/login`, {
                username,
                password,
            })

            if (response.data.token) {
                localStorage.setItem('token', response.data.token)
                localStorage.setItem('username', username)
                setMensaje(response.data.msg) // Puedes ajustar esto según tus necesidades
                resetCredentials() // Limpiar las credenciales después de un inicio exitoso
                // navigate('/home')
            } else {
                console.log('Token no recibido. Revisa el servidor.')
            }

            // Redirigir o hacer otra acción después del login
        } catch (error) {
            // Si error.response está definido, significa que hubo una respuesta del servidor con error
            if (error.response) {
                setMensaje(error.response.data.msg)
            } else {
                // En caso de error sin respuesta del servidor (problema de red, por ejemplo)
                alert('Login fallido: No se pudo conectar con el servidor.')
            }
            if (error.response.status === 503) {
                setMensaje(error.response.data.message)
            } else {
                console.error('Error en la solicitud:', error)
            }
        } finally {
            setLoading(false)
        }
    }
    //para que no queden vacios los inputs
    const inputsLlenos = useCallback(() => {
        return username !== '' && password !== ''
    }, [username, password])

    return (
        <div className="content-login">
            {loading && (
                <div
                    className="loading"
                    style={{ textAlign: 'center', marginBottom: '10px' }}
                >
                    <ClipLoader color="#000" loading={true} size={50} />
                </div>
            )}
            <div className="background-image">
                <img src="/logo_taco.png" alt="" />
            </div>
            <div className="login-container">
                <div className="login-form">
                    <h1>Iniciar Sesión</h1>
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <i
                        className={`bi ${
                            showPassword ? 'bi-eye' : 'bi-eye-slash'
                        }`}
                        style={{
                            position: 'absolute',
                            right: '610px',
                            top: '450px',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer',
                        }}
                        onClick={visiblePassword}
                    ></i>
                    <div>
                        <button
                            className="btn btn-login"
                            disabled={!inputsLlenos()}
                            onClick={handleSubmit}
                        >
                            Entrar
                        </button>
                    </div>
                </div>
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
                                onClick={() => {
                                    setMensaje('')
                                    resetCredentials()
                                }}
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

export default Login
