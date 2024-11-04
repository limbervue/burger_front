import React, { useState, useEffect } from 'react'
import Home from './pages/Home'
import Inventory from './pages/Inventory'
import BurgerPrices from './pages/Burger-prices'
import BurgerIngredientsPrices from './pages/Burger-ingredients-prices'
import Expenses from './pages/Expenses'
// //////////////////////////////////////////COMPONENTS
import Logo from './components/Logo'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './styles/styles.scss'
import './styles/mediaQueries.scss'
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
    useNavigate,
} from 'react-router-dom'
import NavPrices from './components/Nav-Prices'
import NavInvoice from './components/Nav-invoice'
import Sales from './pages/Sales'
import HistorySales from './pages/history-sales'
import HistoryPurchase from './pages/History-purchase'
import Modal from 'react-modal'
import Login from './pages/Login'

function App() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [actualPassword, setActualPassword] = useState('')
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('username')
    const navigate = useNavigate()
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [mensaje, setMensaje] = useState('')
    // console.log('Token:', token)
    // console.log('Username:', username)

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        // setUsername('')
        navigate('/')
    }

    const ProtectedRoute = ({ children }) => {
        return token ? children : <Navigate to="/" replace />
    }
    const saveUser = async () => {
        try {
        } catch (error) {}
    }
    return (
        <div className="main-content">
            {/* Mostrar el Logo solo si el usuario está autenticado */}
            {token && <Logo />}
            {/* Mostrar el título condicionalmente debajo del logo */}
            {token && (
                <div className="tipoUser">
                    <h3>
                        {user === 'pacoygeo'
                            ? 'Administrador'
                            : user === 'public'
                            ? 'Público'
                            : ''}
                    </h3>
                </div>
            )}
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
                <h2>Cambiar contraseña </h2>
                <div class="modal-edit">
                    <div class="modal-edit__input">
                        <span>Contraseña actual</span>
                        <input
                            type="text"
                            value={actualPassword}
                            onChange={(event) =>
                                handleChange(event, setActualPassword)
                            }
                            style={{ padding: '8px', marginRight: '4px' }}
                        />
                    </div>
                    <div class="modal-edit__input">
                        <span>Nueva contraseña</span>
                        <input
                            type="text"
                            value={newPassword}
                            onChange={(event) =>
                                handleChange(event, setNewPassword)
                            }
                            style={{ padding: '8px', marginRight: '4px' }}
                        />
                    </div>

                    <div class="modal-edit__buttons">
                        <div>
                            <button
                                onClick={saveUser}
                                class="btn btn-primary modal-edit__buttons__save"
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
                                class="btn btn-danger"
                                style={{ padding: '10px' }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
            {!token ? (
                // Si no hay token, redirige al login
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Login
                                username={username}
                                setUsername={setUsername}
                                password={password}
                                setPassword={setPassword}
                            />
                        }
                    />
                    <Route
                        path="/home"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    {/* Ruta de redirección por defecto */}
                    <Route
                        path="*"
                        element={
                            <Navigate to={token ? '/home' : '/'} replace />
                        }
                    />
                </Routes>
            ) : (
                <>
                    <button
                        className="btn btn-closeSesion"
                        onClick={handleLogout}
                    >
                        Cerrar sesión
                    </button>
                    {user === 'pacoygeo' && (
                        <button
                            className="btn btn-user"
                            onClick={() => setModalIsOpen(true)}
                        >
                            user
                        </button>
                    )}

                    <Routes>
                        <Route
                            path="/"
                            element={<Navigate to="/home" replace />}
                        />
                        <Route path="/home" element={<Home />} />
                        <Route
                            path="*"
                            element={<Navigate to="/home" replace />}
                        />
                        {/* PRECIOS HAMBURGUESAS E INGREDIENTES */}
                        <Route path="/precios" element={<NavPrices />}>
                            <Route index element={<BurgerPrices />} />
                            <Route
                                path="/precios/hamburguesas"
                                element={<BurgerPrices />}
                            />
                            <Route
                                path="/precios/ingredientes"
                                element={<BurgerIngredientsPrices />}
                            />
                        </Route>
                        {/* INVENTARIO */}
                        <Route path="/inventario" element={<Inventory />} />
                        {/* FACTURACIÓN DE GASTOS Y VENTAS */}
                        <Route path="/facturacion" element={<NavInvoice />}>
                            <Route index element={<Expenses />} />
                            <Route
                                path="/facturacion/gastos"
                                element={<Expenses />}
                            />
                            <Route
                                path="/facturacion/ventas"
                                element={<Sales />}
                            />
                            {/* HISTORIAL DE GASTOS Y VENTAS */}
                            <Route
                                path="/facturacion/historial_gastos"
                                element={<HistoryPurchase />}
                            />
                            <Route
                                path="/facturacion/historial_ventas"
                                element={<HistorySales />}
                            />
                        </Route>
                    </Routes>
                </>
            )}
        </div>
    )
}

export default App
