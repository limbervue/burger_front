import { useState, useEffect, useCallback } from 'react';
import Modal from 'react-modal';
import ClipLoader from 'react-spinners/ClipLoader';
import { ModalEditBurger, CardBurgers } from '../components';
import {
  getBurgersService,
  updateBurgersService,
} from '../services/burgerService';
Modal.setAppElement('#root');
export function Burger() {
  const [productos, setProductos] = useState([]);
  const [id, setId] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [priceDB, setPriceDB] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false); // Estado de carga
  const token = localStorage.getItem('token');
  useEffect(() => {
    fetchBurgers();
  }, []);
  //////////////////////////////////////////obtner las burgers
  const fetchBurgers = async() => {
    setLoading(true);
    try {
      const data = await getBurgersService(token);
      setProductos(data);
      console.log('datos de hamburguesas:', data);
    } catch (error) {
      console.error('Error al obtener las hamburguesas:', error);
    } finally {
      setLoading(false);
    }
  };
  //al hacer click en editar se ejecuta esta funcion
  const handleEditPrice = (id, price_burger, name) => {
    console.log('id recibido: ' + id);
    console.log('precio recibido: ' + price_burger);
    setId(id);
    const precio = parseFloat(price_burger);
    setName(name);
    setPrice(precio.toFixed(2));
    setPriceDB(precio.toFixed(2));

    setModalIsOpen(true);
  };
  //para obtener el numero del nombre de la burger
  const getNumber = (name) => {
    return name.split('-')[0]; // Toma la parte antes del guion
  };
  ///////////////////////////////////////guardar el precio
  const savePrice = async() => {
    console.log('ID:', id);
    console.log('precio:', price);
    setLoading(true);
    try {
      const response = await updateBurgersService(id, price, token);
      // Actualiza el estado local
      setProductos((prevProductos) =>
        prevProductos.map((producto) =>
          producto.id === id
            ? { ...producto, precio: price }
            : producto,
        ),
      );
      setModalIsOpen(false);
      setId(null);
      setPrice('');
      setMensaje(response.message);
      fetchBurgers();
    } catch (error) {
      console.error('Error al actualizar el precio:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para validar que solo se ingresen números o decimales
  const validateNumberFloat = (valor) => {
    const regex = /^\d+(\.\d{0,2})?$/;
    return regex.test(valor);
  };
  // Función handleChange que utiliza la validación
  const handleChange = (event, setter) => {
    const valor = event.target.value;

    if (validateNumberFloat(valor) || valor === '') {
      setter(valor);
    }
  };
  // Función que verifica si el input tiene valor
  const inputLleno = useCallback(() => {
    return price !== '';
  }, [price]);

  // Función que compara el valor del input con el valor de la base de datos
  const compararValores = useCallback(() => {
    return price === priceDB;
  }, [price, priceDB]);

  return (
    <div className="container">
      {loading && (
        <div
          className="loading"
          style={{ textAlign: 'center', marginBottom: '10px' }}
        >
          <ClipLoader color="#000" loading={true} size={50} />
        </div>
      )}
      <CardBurgers
        productos={productos}
        handleEditPrice={handleEditPrice}
      />
      {/* /////////////aqui el modal */}
      <ModalEditBurger
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        name={name}
        price={price}
        setMensaje={setMensaje}
        mensaje={mensaje}
        getNumber={getNumber}
        handleChange={handleChange}
        setPrice={setPrice}
        savePrice={savePrice}
        inputLleno={inputLleno}
        compararValores={compararValores}
      />
    </div>
  );
}
