import { useRef } from 'react';
import {
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/styles.scss';
import './styles/mediaQueries.scss';
import { useMediaQuery } from '@mui/material';
/////////////////////////////////redux toolkit
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './redux/authSlice';

///////////////////////////////////////////////////////////////
import {
  Login,
  Home,
  Burger,
  Ingredients,
  Expenses,
  Sales,
  HistorySales,
  HistoryPurchase,
  Inventory,
} from './pages';
//////////////////////////////////////////////////////////////
import { Logo, Nav, NavMobile, UpdatePassword } from './components';

function App() {
  const updatePasswordRef = useRef();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.username);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:552px)');
  const SelectedNav = isMobile ? NavMobile : Nav;
  const dispatch = useDispatch();

  const linksData = {
    facturacion: [
      { to: '/facturacion/gastos', label: 'Gastos' },
      { to: '/facturacion/ventas', label: 'Ventas' },
      { to: '/facturacion/historial_gastos', label: 'Historial Gastos' },
      { to: '/facturacion/historial_ventas', label: 'Historial Ventas' },
    ],
    precios: [
      { to: '/precios/hamburguesas', label: 'Hamburguesas' },
      { to: '/precios/ingredientes', label: 'Ingredientes' },
    ],
  };
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };
  
  const openPasswordModal = () => {
    if (updatePasswordRef.current) {
      updatePasswordRef.current.openModal();
    }
  };
  
  return (
    <div className="main-content">
      {token && <Logo />}
      <UpdatePassword ref={updatePasswordRef} />
  
      <Routes>
        <>
          <Route path="/home" element={<Home />} />
          <Route path="/precios" element={<SelectedNav links={linksData.precios} />}>
            <Route index element={<Burger />} />
            <Route path="hamburguesas" element={<Burger />} />
            <Route path="ingredientes" element={<Ingredients />} />
          </Route>
          <Route path="/inventario" element={<Inventory />} />
          <Route path="/facturacion" element={<SelectedNav links={linksData.facturacion} />}>
            <Route index element={<Expenses />} />
            <Route path="gastos" element={<Expenses />} />
            <Route path="ventas" element={<Sales />} />
            <Route path="historial_gastos" element={<HistoryPurchase />} />
            <Route path="historial_ventas" element={<HistorySales />} />
          </Route>
          <Route path="/"element={ <Login />}/>
        </>
      </Routes>
  
      {token && (
        <div>
          <button className="btn btn-closeSesion" onClick={handleLogout}>
            Cerrar sesión
          </button>
          {console.log('Valor de user:', user)}
          {user === 'pacoygeo' && (
            <button className="btn btn-user" onClick={openPasswordModal}>
              <div className="btn-key">
                <img src="key.png" alt="Key Icon" />
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
  
export default App;
