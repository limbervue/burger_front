// src/App.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import ClipLoader from 'react-spinners/ClipLoader';
import { TableExpenses, ModalAddExpenses } from '../components';
// import "./App.css";

Modal.setAppElement('#root');

export function Expenses() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [id, setId] = useState(null);
  const [code, setCode] = useState(null);
  const [price_porcion, setPricePorcion] = useState('');
  const [price_paquete, setPricePaquete] = useState('');
  const [units, setUnits] = useState('');
  const [product, setProduct] = useState('');
  const [ingredientes, setIngredientes] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [cantidadPaquetes, setCantidadPaquetes] = useState(0);
  const [tablaTemporal, setTablaTemporal] = useState(() => {
    // Recuperar datos del localStorage al inicializar
    const savedData = localStorage.getItem('tablaTemporal');
    return savedData ? JSON.parse(savedData) : [];
  });
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false); // Estado de carga
  const token = localStorage.getItem('token');
  // Petición a la API para obtener los ingredientes
  useEffect(() => {
    getIngredients();

    // Recuperar tabla temporal desde localStorage
    const savedData = localStorage.getItem('tablaTemporal');
    if (savedData) {
      setTablaTemporal(JSON.parse(savedData));
    }
  }, []);
  //////////////////////////////////////////////////////////////////
  const getIngredients = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/ingredients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIngredientes(response.data.ingredients);
      console.log('datos...', response.data);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    } finally {
      setLoading(false);
    }
  };
  ///////////////////////////////////////////////////////////
  useEffect(() => {
    if (tablaTemporal.length > 0) {
      localStorage.setItem('tablaTemporal', JSON.stringify(tablaTemporal));
    }
  }, [tablaTemporal]);
  ////////////////////////////////////////////////////////
  const expenses = async () => {
    setLoading(true);
    try {
      const tablaTemporalNumerica = tablaTemporal.map((item) => ({
        ...item,
        paquetes: parseInt(item.paquetes, 10),
        precioPaquete: parseFloat(item.precioPaquete),
        total: parseFloat(item.total),
      }));

      console.log(
        'Datos a enviar:',
        JSON.stringify(tablaTemporalNumerica, null, 2),
      );
      if (tablaTemporal.length === 0) return;

      const response = await axios.post(
        `${apiUrl}/save-expenses`,
        {
          ingredientes: tablaTemporalNumerica,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setMensaje(response.data.message);
      console.log(response.data);
      console.log(response.data.message);
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    } finally {
      setLoading(false); // Finaliza la carga
      setTablaTemporal([]); // Limpia la tabla temporal
      localStorage.removeItem('tablaTemporal'); // Limpia el localStorage
    }
  };
  //////////////////////////////////////////////////////////////////
  const handleAdd = (
    id,
    price_paquete,
    price_porcion,
    units,
    product,
    code,
  ) => {
    setId(id);
    const paquete = parseFloat(price_paquete);
    const porcion = parseFloat(price_porcion);
    const unidades = parseInt(units, 10);

    setPricePaquete(paquete.toFixed(2));
    setPricePorcion(porcion.toFixed(2));
    setUnits(unidades);
    setProduct(product);
    setCode(code);
    setModalIsOpen(true);
    console.log(code);
  };
  //para mostrar solo nombre sinnumero
  const getText = (name) => {
    const parts = name.split('-'); // Divide el nombre en partes
    return parts.length > 1 ? parts.slice(1).join('-') : ''; // Toma la parte después del guion
  };
  const manejarAñadirPaquete = () => {
    if (!id) return;

    // Verifica si el ingrediente ya está en la tabla temporal
    const existente = tablaTemporal.find((item) => item.id === id);

    if (existente) {
      // Actualiza la cantidad de paquetes existente
      const actualizado = tablaTemporal.map((item) =>
        item.id === id
          ? {
              ...item,
              paquetes: item.paquetes + cantidadPaquetes,
              unidades:
                (item.paquetes + cantidadPaquetes) * item.unidadesPorPaquete,
              total: (item.paquetes + cantidadPaquetes) * item.precioPaquete,
            }
          : item,
      );
      setTablaTemporal(actualizado);
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
      ]);
    }
    setCantidadPaquetes(0);
    setModalIsOpen(false);
  };
  ////////////////////////////////////////validar que sea un numero entero
  const validarNumeroEntero = (valor) => {
    const regex = /^\d*$/; // Solo acepta dígitos
    return regex.test(valor);
  };

  const handleChange = (event, setter) => {
    const valor = event.target.value;

    if (
      validarNumeroEntero(valor) ||
      valor === '' // Permitir que el input quede vacío
    ) {
      setter(valor);
    } else {
      console.error('El valor ingresado no es válido.');
    }
  };
  ////////////////////////////////////////////////elimnar el registro de la tabla temporal
  const handleDelete = (id) => {
    // Lógica para eliminar el ingrediente con el id correspondiente
    const nuevaTablaTemporal = tablaTemporal.filter((item) => item.id !== id);
    setTablaTemporal(nuevaTablaTemporal);
  };

  return (
    <div>
      {/* Indicador de Carga con Spinner */}
      {loading && (
        <div
          className="loading"
          style={{ textAlign: 'center', marginBottom: '10px' }}
        >
          <ClipLoader color="#000" loading={true} size={50} />
        </div>
      )}
      <TableExpenses
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        setMensaje={setMensaje}
        mensaje={mensaje}
        getText={getText}
        handleChange={handleChange}
        handleDelete={handleDelete}
        manejarAñadirPaquete={manejarAñadirPaquete}
        handleAdd={handleAdd}
        expenses={expenses}
        tablaTemporal={tablaTemporal}
        ingredientes={ingredientes}
        cantidadPaquetes={cantidadPaquetes}
        setCantidadPaquetes={setCantidadPaquetes}
        product={product}
      />
      <ModalAddExpenses
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        setMensaje={setMensaje}
        mensaje={mensaje}
        handleChange={handleChange}
        manejarAñadirPaquete={manejarAñadirPaquete}
        cantidadPaquetes={cantidadPaquetes}
        setCantidadPaquetes={setCantidadPaquetes}
        product={product}
        getText={getText}
      />
    </div>
  );
}
