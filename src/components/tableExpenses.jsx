export function TableExpenses({ 
  getText,
  handleDelete,
  handleAdd,
  expenses,
  tablaTemporal,
  ingredientes,
}) {
  return (
    <div className="burguer_table price-burguer">
      <h1 className="mb-4">Gastos de Ingredientes</h1>
      <div className="table-responsive burguer_table__content-table price-burguer__content-table">
        
        <table className="table table-striped table-bordered table-dark">
          <thead className="thead-dark">
            <tr>
              <th className="long-name-hg">Ingrediente</th>
              <th className="short-name-hg">Ingrednt</th>
              <th className="long-name-hg">Paquetes</th>
              <th className="short-name-hg">Paq</th>
              <th className="long-name-hg">Unidades</th>
              <th className="short-name-hg">Und</th>
              <th className="long-name-hg">Total</th>
              <th className="short-name-hg">Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {ingredientes.map((ingrediente) => {
              const itemTemporal = tablaTemporal.find(
                (item) => item.id === ingrediente._id,
              );
              return (
                <tr key={ingrediente._id}>
                  <td>{getText(ingrediente.name)}</td>
                  <td>
                    {itemTemporal
                      ? itemTemporal.paquetes
                      : 0}
                  </td>
                  <td>
                    {itemTemporal
                      ? itemTemporal.unidades
                      : 0}
                  </td>
                  <td>
                    {itemTemporal
                      ? itemTemporal.total.toFixed(2)
                      : '0.00'}
                  </td>
                  <td>
                    <div className="buttons-inv">
                      <div className="buttons-inv__button">
                        <button
                          onClick={() =>
                            handleAdd(
                              ingrediente._id,
                              ingrediente.package_price,
                              ingrediente.portion_price,
                              ingrediente.package_content,
                              ingrediente.name,
                              ingrediente.code,
                            )
                          }
                          className="btn btn-success"
                          disabled={!!itemTemporal}
                        >
                          <img
                            src="../add_img.png"
                            alt=""
                          />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              ingrediente._id,
                            )
                          }
                          className="btn btn-danger ml-2"
                          disabled={!itemTemporal}
                        >
                          <img
                            src="../delete_img.png"
                            alt=""
                          />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
            <tr>
              <td colSpan={5}>
                <button
                  className="btn btn-primary"
                  disabled={tablaTemporal.length === 0}
                  onClick={expenses}
                >
                                    Registrar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      
    </div>
  );
}
