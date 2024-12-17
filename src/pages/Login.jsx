import { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { loginSuccess, logout } from '../redux/authSlice';
export function Login() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false); // Estado de carga
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ username: '', password: '' });
  ////////////////////////////////////
  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
  };
  const handleCloseModal = () => {
    setMensaje('');
    formData.username = '';
    formData.password = '';
  };
  const visiblePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async(e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/login`, {
        username: formData.username,
        password: formData.password,
      });
  
      if (response.data.token) {
        // Si el login es exitoso, despacha loginSuccess
        const { token, username } = response.data;
        console.log('Token recibido:', token);
        console.log('User recibido:', username);
        dispatch(loginSuccess({ token, username }));
        navigate('/home');
      } else {
        console.log('Token no recibido. Revisa el servidor.');
      }
  
    } catch (error) {
      // Si error.response está definido, significa que hubo una respuesta del servidor con error
      if (error.response) {
        setMensaje(error.response.data.msg);
  
        // Si es un error 400 (usuario no encontrado o contraseña incorrecta)
        if (error.response.status === 400) {
          // Resetear el username en Redux y localStorage en caso de error
          dispatch(logout());
        }
  
      } else {
        // En caso de error sin respuesta del servidor (problema de red, por ejemplo)
        alert('Login fallido: No se pudo conectar con el servidor.');
      }
  
      if (error.response && error.response.status === 503) {
        setMensaje(error.response.data.message);
      } else {
        console.error('Error en la solicitud:', error);
      }
    } finally {
      setLoading(false);
    }
  };
  
  //para que no queden vacios los inputs
  const inputsLlenos = useCallback(() => {
    return formData.username !== '' && formData.password !== '';
  }, [formData.username, formData.password]);

  return (
    <div className="content-login">
      {loading && (
        <div className="content-login__loading">
          <ClipLoader color="#000" loading={true} size={50} />
        </div>
      )}
      <div className="content-login__background-image">
        <img src="/logo_taco.png" alt="" />
      </div>

      <div className="content-login__form">
        <div className="content-login__form__title">
          <h3>INICIAR SESION</h3>
        </div>
       
        <div className="content-login__form__input">
          <input type="text" placeholder="Usuario" value={formData.username} name='username' onChange={handleChange} />
        </div>
        
        <div className="content-login__form__input">
          <input type={showPassword ? 'text' : 'password'} placeholder="Contraseña" value={formData.password} name='password' onChange={handleChange} />

          <i className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`} onClick={visiblePassword}></i>
       
        </div>
        <div className="content-login__form__button">
          <button className="btn btn-login" disabled={!inputsLlenos()} onClick={handleSubmit}>Entrar</button>
        </div>
        
      </div>
      {mensaje && (
        <Modal isOpen={mensaje !== ''} onRequestClose={handleCloseModal} contentLabel="Mensaje" style={{ content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)' }, overlay: { backgroundColor: 'rgba(0, 0, 0, 0.8)' } }}>
          <div className="modal-mensaje">
            <h2>{mensaje}</h2>
            <button className="btn btn-danger" onClick={handleCloseModal}>Cerrar</button>
          </div>
        </Modal>
      )}

    </div>
  );
}
