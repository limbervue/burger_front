export const CardIngredients = ({ productos, handleEdit }) => {
  return (
    <div className="grid-container">
      {productos.map((producto) => (
        <div className="grid-item" key={producto._id}>
          <div className="grid-data">
            <h2>{producto.name}</h2>
            <p className="precio">
              <strong>$ Paquete:</strong> ${producto.package_price.toFixed(2)}
            </p>
            <p className="precio">
              <strong>$ Porción:</strong> ${producto.portion_price.toFixed(2)}
            </p>
            <p className="precio">
              <strong>Unidades:</strong> {producto.package_content}
            </p>
            <div className="grid-ingredient">
              <img src="/ingre.png" alt="Ingrediente" />
            </div>
          </div>
          <div className="grid-button">
            <button
              onClick={() =>
                handleEdit(
                  producto._id,
                  producto.name,
                  producto.package_price,
                  producto.portion_price,
                  producto.package_content,
                )
              }
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