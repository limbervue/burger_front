import React, { useState, useEffect, useCallback } from 'react';
import Modal from 'react-modal';
import ClipLoader from 'react-spinners/ClipLoader';
import {
  getIngredientService,
  updateIngredientService,
} from '../services/ingredientService';
import { ModalEditIngredient, CardIngredients } from '../components';
Modal.setAppElement('#root');

export function Ingredients() {
  const [productos, setProductos] = useState([]);
  const [id, setId] = useState(null);
  const [product, setProduct] = useState('');
  const [price_paquete, setPricePaquete] = useState('');
  const [price_porcion, setPricePorcion] = useState('');
  const [units, setUnits] = useState('');
  const [price_paqueteDB, setPricePaqueteDB] = useState('');
  const [price_porcionDB, setPricePorcionDB] = useState('');
  const [unitsDB, setUnitsDB] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    fetchIngredients();
  }, []);
  
  const fetchIngredients = async() => {
    setLoading(true);
    try {
      const data = await getIngredientService(token);
      setProductos(data.ingredients);
    } catch (error) {
      console.error('Error al obtener los ingredientes:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (
    id,
    product,
    price_paquete,
    price_porcion,
    units,
  ) => {
    setId(id);
    const paquete = parseFloat(price_paquete);
    const porcion = parseFloat(price_porcion);
    const unidades = parseInt(units, 10);
  
    setProduct(product);
    setPricePaquete(paquete.toFixed(2));
    setPricePorcion(porcion.toFixed(2));
    setUnits(unidades);
  
    setPricePaqueteDB(paquete.toFixed(2));
    setPricePorcionDB(porcion.toFixed(2));
    setUnitsDB(unidades);
  
    setModalIsOpen(true);
  };
  
  const saveValues = async() => {
    setLoading(true);
    try {
      const data = {
        precio_paquete: price_paquete,
        precio_porcion: price_porcion,
        unidades: units,
      };
      const response = await updateIngredientService(id, data, token);
      setProductos((prevProductos) =>
        prevProductos.map((producto) =>
          producto._id === id ? { ...producto, ...data } : producto,
        ),
      );
      setModalIsOpen(false);
      setMensaje(response.message);
      fetchIngredients();
    } catch (error) {
      console.error('Error al actualizar los precios:', error);
    } finally {
      setLoading(false);
    }
  };
  const getName = (name) => {
    return name.split('-')[1]; // Toma la parte después del guion
  };
  
  const validateNumberFloat = (valor) => {
    const regex = /^\d+(\.\d{0,2})?$/;
    return regex.test(valor);
  };
  
  const validateNumberInt = (valor) => {
    const regex = /^\d*$/;
    return regex.test(valor);
  };
  
  const handleChange = (event, setter, tipo) => {
    const valor = event.target.value;
    if (
      (tipo === 'flotante' && validateNumberFloat(valor)) ||
        (tipo === 'entero' && validateNumberInt(valor)) ||
        valor === ''
    ) {
      setter(valor);
    }
  };
  
  const inputLleno = useCallback(() => {
    return price_paquete !== '' && price_porcion !== '' && units !== '';
  }, [price_paquete, price_porcion, units]);
  
  const compararValores = useCallback(() => {
    return (
      price_paquete === price_paqueteDB &&
        price_porcion === price_porcionDB &&
        parseInt(units, 10) === parseInt(unitsDB, 10)
    );
  }, [price_paquete, price_porcion, units, price_paqueteDB, price_porcionDB, unitsDB]);
  
  return (
    <div className="container">
      {loading && (
        <div className="loading" style={{ textAlign: 'center', marginBottom: '10px' }}>
          <ClipLoader color="#000" loading={true} size={50} />
        </div>
      )}
      <CardIngredients 
        productos={productos} 
        handleEdit={handleEdit} />
      <ModalEditIngredient
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        product={product}
        price_paquete={price_paquete}
        price_porcion={price_porcion}
        units={units}
        setMensaje={setMensaje}
        mensaje={mensaje}
        handleChange={handleChange}
        setPricePaquete={setPricePaquete}
        setPricePorcion={setPricePorcion}
        setUnits={setUnits}
        saveValues={saveValues}
        inputLlenos={inputLleno}
        compararValores={compararValores}
        getName={getName}
      />
    </div>
  );
}