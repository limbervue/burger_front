import { Link, Outlet } from "react-router-dom";

const NavInvoice = () => {
    return (
        <div style={{ userSelect: "none" }}>
            <ul className="nav">
                <li className="nav__item">
                    <Link className="nav-link" to="/facturacion/gastos">
                        Gastos
                    </Link>
                </li>
                <li className="nav__item">
                    <Link className="nav-link" to="/facturacion/Ventas">
                        Ventas
                    </Link>
                </li>
                <li className="nav__item">
                    <Link
                        className="nav-link long-name-gast"
                        to="/facturacion/historial_gastos"
                    >
                        Historial Gastos
                    </Link>
                </li>
                <li className="nav__item ">
                    <Link
                        className="nav-link long-name-gast"
                        to="/facturacion/historial_ventas"
                    >
                        Historial Ventas
                    </Link>
                </li>
                <li className="nav__item ">
                    <Link
                        className="nav-link short-name-gast"
                        to="/facturacion/historial_gastos"
                    >
                        Hist-Gst
                    </Link>
                </li>
                <li className="nav__item ">
                    <Link
                        className="nav-link short-name-gast"
                        to="/facturacion/historial_ventas"
                    >
                        Hist-Vnt
                    </Link>
                </li>
            </ul>
            <Outlet />
        </div>
    );
};

export default NavInvoice;
