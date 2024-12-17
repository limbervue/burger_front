export const CardBurgers = ({ productos, handleEditPrice }) => {
  return (
    <div className="grid-container">
      {productos.map((producto) => (
        <div className="grid-item" key={producto._id}>
          <div className="grid-data">
            <h2>{producto.type}</h2>
            <p className="ingredientes">
              <strong>Ingredientes:</strong>{' '}
              {producto.ingredients
                .map((ingredient) => ingredient.name)
                .join(', ')}
            </p>
            <p className="precio">
              <strong>Precio:</strong> $
              {producto.price.toFixed(2)}
            </p>
            <div className="grid-burger">
              <img src="/burger.png" alt="" />
            </div>
          </div>
          <div className="grid-button">
            <button
              onClick={() => {
                console.log(producto);
                handleEditPrice(
                  producto.id,
                  producto.price,
                  producto.type,
                );
              }}
              className="btn btn-success"
            >
              <img src="/edit_img.png" alt="Editar" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
