import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="home">
            <div className="home__home-container">
                <Link to="/precios" style={{ textDecoration: "none" }}>
                    <div className="card home__home-container__precios home__home-container__card">
                        <img
                            src="./img_precios.png"
                            className="card-img-top"
                            alt="..."
                        />
                        <div
                            className="card-body"
                            style={{ background: "#FFE033" }}
                        >
                            <h2 className="card-title">Productos</h2>
                        </div>
                    </div>
                </Link>

                <Link to="/inventario" style={{ textDecoration: "none" }}>
                    <div class="card home__home-container__inventario home__home-container__card">
                        <img
                            src="./img_inventario.png"
                            class="card-img-top"
                            alt="..."
                        />
                        <div
                            class="card-body"
                            style={{ background: "#FFE033" }}
                        >
                            <h2 class="card-title">Inventario</h2>
                        </div>
                    </div>
                </Link>

                <Link to="/facturacion" style={{ textDecoration: "none" }}>
                    <div class="card home__home-container__facturacion home__home-container__card">
                        <img
                            src="./img_facturacion.png"
                            class="card-img-top"
                            alt="..."
                        />
                        <div
                            class="card-body"
                            style={{ background: "#FFE033" }}
                        >
                            <h2 class="card-title">Transacción</h2>
                        </div>
                    </div>
                </Link>

                <div class="card home__home-container__estadisticas home__home-container__card">
                    <img
                        src="./img_estadisticas.png"
                        class="card-img-top"
                        alt="..."
                    />
                    <div class="card-body" style={{ background: "#FFE033" }}>
                        <h2 class="card-title">Estadísticas</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
