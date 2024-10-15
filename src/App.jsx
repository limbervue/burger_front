import Home from "./pages/Home";
import Inventory from "./pages/Inventory";
import BurgerPrices from "./pages/Burger-prices";
import BurgerIngredientsPrices from "./pages/Burger-ingredients-prices";
import Expenses from "./pages/Expenses";
// //////////////////////////////////////////COMPONENTS
import Logo from "./components/Logo";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/styles.scss";
import "./styles/mediaQueries.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavPrices from "./components/Nav-Prices";
import NavInvoice from "./components/Nav-invoice";
import Sales from "./pages/Sales";
import HistoryExpenses from "./pages/history-expenses";
import HistorySales from "./pages/history-sales";

function App() {
    return (
        <Router>
            <div className="main-content">
                <Logo />
                <Routes>
                    <Route path="/" element={<Home />} />
                    {/* PRECIOS HAMBURGUESAS E INGREDIENTES */}
                    <Route path="/precios" element={<NavPrices />}>
                        <Route index element={<BurgerPrices />} />
                        <Route
                            path="/precios/hamburguesas"
                            element={<BurgerPrices />}
                        />
                        <Route
                            path="/precios/ingredientes"
                            element={<BurgerIngredientsPrices />}
                        />
                    </Route>

                    {/* INVENTARIO */}
                    <Route path="/inventario" element={<Inventory />} />

                    {/* FACTURACIÓN DE GASTOS Y VENTAS */}
                    <Route path="/facturacion" element={<NavInvoice />}>
                        <Route index element={<Expenses />} />
                        <Route
                            path="/facturacion/gastos"
                            element={<Expenses />}
                        />
                        <Route path="/facturacion/ventas" element={<Sales />} />
                        {/* HISTORIAL DE GASTOS Y VENTAS */}
                        <Route
                            path="/facturacion/historial_gastos"
                            element={<HistoryExpenses />}
                        />
                        <Route
                            path="/facturacion/historial_ventas"
                            element={<HistorySales />}
                        />
                    </Route>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
