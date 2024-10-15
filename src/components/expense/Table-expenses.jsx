import React from "react";

function TableExpenses({
    products,
    handleClickAdd,
    handleClickReset,
    setPackageType,
    saveAllExpenses,
}) {
    console.log("productos...", products);

    const areAllStocksValid = products.every(
        (gasto) =>
            gasto.stock_paquetes < 1 &&
            gasto.stock_unidades < 1 &&
            gasto.total < 1
    );
    return (
        <div className="burguer_table price-burguer">
            <h1 className="mb-4">Gastos de Ingredientes</h1>
            <div className="table-responsive burguer_table__content-table price-burguer__content-table">
                <table className="table table-striped table-bordered table-dark">
                    <thead className="thead-dark">
                        <tr>
                            <th className="long-name-inv">Productos</th>
                            <th className="short-name-inv">Productos</th>
                            <th className="short-name-inv">Paq</th>
                            <th className="long-name-inv">Paquetes</th>
                            <th className="short-name-inv">Und</th>
                            <th className="long-name-inv">Unidades</th>
                            <th className="short-name-inv">Total</th>
                            <th className="long-name-inv">Total</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((gasto) => (
                            <tr key={gasto.id}>
                                <td>{gasto.nombre}</td>
                                <td>{gasto.stock_paquetes}</td>
                                <td>{gasto.stock_unidades}</td>
                                <td>
                                    {gasto.total !== undefined &&
                                    !isNaN(gasto.total)
                                        ? Number(gasto.total).toFixed(2)
                                        : "N/A"}
                                </td>
                                <td>
                                    <div className="buttons-inv">
                                        <div className="buttons-inv__button">
                                            <button
                                                onClick={() => {
                                                    console.log(
                                                        "ID del producto:",
                                                        gasto.id
                                                    );
                                                    handleClickAdd(gasto.id);
                                                    setPackageType(
                                                        gasto.producto
                                                    );
                                                }}
                                                className="btn btn-success"
                                                disabled={
                                                    gasto.stock_paquetes > 0 ||
                                                    gasto.stock_unidades > 0 ||
                                                    gasto.total > 0
                                                }
                                            >
                                                <img
                                                    src="../add_img.png"
                                                    alt=""
                                                />
                                            </button>
                                        </div>
                                        <div className="buttons-inv__button">
                                            <button
                                                onClick={() => {
                                                    handleClickReset(gasto.id);
                                                }}
                                                className="btn btn-danger"
                                                disabled={
                                                    gasto.stock_paquetes < 1 ||
                                                    gasto.stock_unidades < 1 ||
                                                    gasto.total < 1
                                                }
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
                        ))}
                        <tr>
                            <td colSpan={5}>
                                <button
                                    onClick={saveAllExpenses}
                                    className="btn btn-primary"
                                    disabled={areAllStocksValid}
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

export default TableExpenses;
