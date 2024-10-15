import { Link, Outlet } from "react-router-dom";

const NavPrices = () => {
    return (
        <div style={{ userSelect: "none" }}>
            <ul className="nav">
                <li className="nav__item">
                    <Link className="nav-link" to="/precios/hamburguesas">
                        Hamburguesas
                    </Link>
                </li>
                <li className="nav__item">
                    <Link className="nav-link" to="/precios/ingredientes">
                        Ingredientes
                    </Link>
                </li>
            </ul>
            <Outlet />
        </div>
    );
};

export default NavPrices;
