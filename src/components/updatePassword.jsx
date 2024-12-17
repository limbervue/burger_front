import { useState, forwardRef, useImperativeHandle } from 'react';
import { ModalUpdatePassword } from './modalUpdatePassword';
import { updatePassword } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {  logout } from '../redux/authSlice';

export const UpdatePassword = forwardRef((props, ref) => {
  UpdatePassword.displayName = 'UpdatePassword';
  const [newPassword, setNewPassword] = useState('');
  const [actualPassword, setActualPassword] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();
  const [passwordMessage, setPasswordMessage] = useState('');
  const dispatch = useDispatch();
  ////////////////////guardar la contraseña nueva
  const savePassword = async() => {
    try {
      const token = localStorage.getItem('token');
      const data = await updatePassword(
        actualPassword,
        newPassword,
        token,
      );
      setMensaje(data.message);
      dispatch(logout());
      navigate('/');
    } catch (error) {
      setMensaje(error.response?.data?.message || 'Error desconocido');
    } finally {
      setModalIsOpen(false);
      setActualPassword('');
      setNewPassword('');
    }
  };
  /////////////////para actualizar los estados de la contraseña
  const handleChange = (event, setState) => {
    setState(event.target.value);
  };
  ///////////////para pasar la funcion a el componente padre
  useImperativeHandle(ref, () => ({
    openModal: () => setModalIsOpen(true),
  }));

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setNewPassword(newPassword);

    const validation = validatePassword(newPassword);
    setPasswordMessage(validation.message);
  };
  //////////////////////////////////validar nueva contraseña
  function validatePassword(password) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (password.length === 0) {
      return { valid: false, message: '' };
    }

    if (password.length < 8) {
      return { valid: false, message: 'Debe tener minimo 8 caracteres.' };
    }
    if (!hasUpperCase) {
      return {
        valid: false,
        message: 'Debe tener al menos una letra mayúscula.',
      };
    }
    if (!hasLowerCase) {
      return {
        valid: false,
        message: 'Debe tener al menos una letra minúscula.',
      };
    }
    if (!hasNumber) {
      return { valid: false, message: 'Debe tener al menos un número.' };
    }
    return {
      valid: false,
      message: '',
    };
  }
  /////////////////////////////////////////////////////////////////////////////////
  return (
    <div>
      <ModalUpdatePassword
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        savePassword={savePassword}
        actualPassword={actualPassword}
        setActualPassword={setActualPassword}
        newPassword={newPassword}
        handlePasswordChange={handlePasswordChange}
        passwordMessage={passwordMessage}
        handleChange={handleChange}
        mensaje={mensaje}
        setMensaje={setMensaje}
      />
    </div>
  );
});
