import axios from "axios";
import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useFavourites } from "../context/FavouritesContext";
import { useCart } from "../context/CartContext";
import "./HomePage.css";


export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isGridMode, setisGridMode] = useState("");
    const [categoria, setcategoria] = useState("");
    const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;
    const { isFavourite, toggleFavourite } = useFavourites();
    const { addToCart } = useCart();


    useEffect(() => {
        setLoading(true);
        axios.get(`${backendBaseUrl}/api/products?limit=30`)
            .then((resp) => {
                // Se la risposta è un oggetto con chiave result (array), usa quella
                let arr = [];
                if (Array.isArray(resp.data)) {
                    arr = resp.data;
                } else if (Array.isArray(resp.data.result)) {
                    arr = resp.data.result;
                } else if (Array.isArray(resp.data.products)) {
                    arr = resp.data.products;
                }
                setProducts(arr);
                setLoading(false);
            })
            .catch((err) => {
                setError("Errore nel caricamento dei prodotti");
                setLoading(false);
            });
    }, []);


    return (
        <>
            <div style={{ color: 'red', fontWeight: 'bold', fontSize: 22, margin: 10 }}>
                {/* DEBUG: prodotti caricati: {Array.isArray(products) ? products.length : 'non array'} */}
            </div>
            <section className="ot-home-container ot-bg-teal">
                <div className="ot-hero-section"></div>

                {/* <div className="d-flex justify-content-around">


                    <div>
                        <button onClick={() => setcategoria("")}>Prodotti Piu Venduti</button>
                        <button onClick={() => setcategoria(1)}>Supplements</button>
                        <button onClick={() => setcategoria(2)}>Apparel</button>
                        <button onClick={() => setcategoria(3)}>Accessories</button>
                        <button onClick={() => setcategoria(4)}>Food & Snacks</button>
                    </div>
                    <div>
                        <button onClick={() => setisGridMode(1)}>Lista</button>
                        <button onClick={() => setisGridMode("")}>Griglia</button>
                    </div>
                </div> */}

                <div className="ot-home-filters">
                    <div className="ot-filter-group">
                        <label>Categorie:</label>
                        <div className="ot-category-buttons">
                            <button
                                onClick={() => setcategoria("")}
                                className={`ot-category-btn ${categoria === "" ? "active" : ""}`}
                            >
                                Prodotti Più Venduti
                            </button>
                            <button
                                onClick={() => setcategoria(1)}
                                className={`ot-category-btn ${categoria === 1 ? "active" : ""}`}
                            >
                                Supplements
                            </button>
                            <button
                                onClick={() => setcategoria(2)}
                                className={`ot-category-btn ${categoria === 2 ? "active" : ""}`}
                            >
                                Apparel
                            </button>
                            <button
                                onClick={() => setcategoria(3)}
                                className={`ot-category-btn ${categoria === 3 ? "active" : ""}`}
                            >
                                Accessories
                            </button>
                            <button
                                onClick={() => setcategoria(4)}
                                className={`ot-category-btn ${categoria === 4 ? "active" : ""}`}
                            >
                                Food & Snacks
                            </button>
                        </div>
                    </div>

                    <div className="ot-filter-group">
                        <label>Visualizza:</label>
                        <div className="ot-view-buttons">
                            <button
                                onClick={() => setisGridMode("")}
                                className={`ot-view-btn ${!isGridMode ? "active" : ""}`}
                            >
                                <i className="bi bi-grid-3x3-gap"></i> Griglia
                            </button>
                            <button
                                onClick={() => setisGridMode(1)}
                                className={`ot-view-btn ${isGridMode ? "active" : ""}`}
                            >
                                <i className="bi bi-list-ul"></i> Lista
                            </button>
                        </div>
                    </div>
                </div>


                {!isGridMode ? (
                    <div className="d-flex container ot-bg-teal">
                        <div className="row">
                            {loading && <p>Caricamento prodotti...</p>}
                            {error && <p>{error}</p>}
                            {!loading && !error && Array.isArray(products) && (
                                categoria === ""
                                    ? products.slice(0, 12).map((card, idx) => (
                                        <div className="col-sm-12 col-md-6 col-lg-4 d-flex" key={idx}>
                                            <div className="card mb-3 ot-product-card">
                                                {/* HEART ICON */}
                                                <button
                                                    onClick={() => toggleFavourite(card)}
                                                    className="ot-heart-button"
                                                    aria-label={isFavourite(card.id) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
                                                >
                                                    <i
                                                        className={isFavourite(card.id) ? "bi bi-heart-fill" : "bi bi-heart"}
                                                        style={{
                                                            color: isFavourite(card.id) ? "#dc3545" : "#666",
                                                            fontSize: "18px",
                                                        }}
                                                    ></i>
                                                </button>
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col-12">
                                                        <div className="card-body">
                                                            <img
                                                                src={`${backendBaseUrl}${card.image}`}
                                                                alt={card.name}
                                                                style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain', marginBottom: '10px' }}
                                                            />
                                                            <h5 className="card-title">{card.name}</h5>
                                                            <p className="card-text">{card.description}</p>
                                                            <div className="ot-card-actions">
                                                                <Link to={`/products/${card.slug}`} className="btn btn-outline-primary btn-sm">
                                                                    Vedi dettagli
                                                                </Link>
                                                                <button onClick={() => addToCart(card)} className="btn btn-primary btn-sm">
                                                                    Aggiungi
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                    : products.filter(card => card.macro_categories_id === categoria).map((card, idx) => (
                                        <div className="col-sm-12 col-md-6 col-lg-4" key={idx}>
                                            <div className="card mb-3 ot-product-card">
                                                {/* HEART ICON */}
                                                <button
                                                    onClick={() => toggleFavourite(card)}
                                                    className="ot-heart-button"
                                                    aria-label={isFavourite(card.id) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
                                                >
                                                    <i
                                                        className={isFavourite(card.id) ? "bi bi-heart-fill" : "bi bi-heart"}
                                                        style={{
                                                            color: isFavourite(card.id) ? "#dc3545" : "#666",
                                                            fontSize: "18px",
                                                        }}
                                                    ></i>
                                                </button>
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col-12">
                                                        <div className="card-body">
                                                            <img
                                                                src={`${backendBaseUrl}${card.image}`}
                                                                alt={card.name}
                                                                style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain', marginBottom: '10px' }}
                                                            />
                                                            <h5 className="card-title">{card.name}</h5>
                                                            <p className="card-text">{card.description}</p>
                                                            <div className="ot-card-actions">
                                                                <Link to={`/products/${card.slug}`} className="btn btn-outline-primary btn-sm">
                                                                    Vedi dettagli
                                                                </Link>
                                                                <button onClick={() => addToCart(card)} className="btn btn-primary btn-sm">
                                                                    Aggiungi
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="container">
                        {!loading && !error && Array.isArray(products) && (
                            categoria === ""
                                ? products.slice(0, 12).map((card, idx) => (
                                    <div className="col-12" key={idx}>
                                        <div className="card mb-3 ot-product-card-list">
                                            {/* HEART ICON */}
                                            <button
                                                onClick={() => toggleFavourite(card)}
                                                className="ot-heart-button"
                                                aria-label={isFavourite(card.id) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
                                            >
                                                <i
                                                    className={isFavourite(card.id) ? "bi bi-heart-fill" : "bi bi-heart"}
                                                    style={{
                                                        color: isFavourite(card.id) ? "#dc3545" : "#666",
                                                        fontSize: "18px",
                                                    }}
                                                ></i>
                                            </button>

                                            <div className="ot-list-card-body">
                                                <img
                                                    src={`${backendBaseUrl}${card.image}`}
                                                    alt={card.name}
                                                    className="ot-list-card-image"
                                                />
                                                <div className="ot-list-card-content">
                                                    <h5 className="card-title">{card.name}</h5>
                                                    <p className="card-text">{card.description}</p>
                                                    <div className="ot-list-card-actions">
                                                        <Link to={`/products/${card.slug}`} className="btn btn-outline-primary btn-sm">
                                                            Vedi dettagli
                                                        </Link>
                                                        <button onClick={() => addToCart(card)} className="btn btn-primary btn-sm">
                                                            Aggiungi
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                                : products.filter(card => card.macro_categories_id === categoria).map((card, idx) => (
                                    <div className="col-12" key={idx}>
                                        <div className="card mb-3 ot-product-card-list">
                                            {/* HEART ICON */}
                                            <button
                                                onClick={() => toggleFavourite(card)}
                                                className="ot-heart-button"
                                                aria-label={isFavourite(card.id) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
                                            >
                                                <i
                                                    className={isFavourite(card.id) ? "bi bi-heart-fill" : "bi bi-heart"}
                                                    style={{
                                                        color: isFavourite(card.id) ? "#dc3545" : "#666",
                                                        fontSize: "18px",
                                                    }}
                                                ></i>
                                            </button>

                                            <div className="ot-list-card-body">
                                                <img
                                                    src={`${backendBaseUrl}${card.image}`}
                                                    alt={card.name}
                                                    className="ot-list-card-image"
                                                />
                                                <div className="ot-list-card-content">
                                                    <h5 className="card-title">{card.name}</h5>
                                                    <p className="card-text">{card.description}</p>
                                                    <div className="ot-list-card-actions">
                                                        <Link to={`/products/${card.slug}`} className="btn btn-outline-primary btn-sm">
                                                            Vedi dettagli
                                                        </Link>
                                                        <button onClick={() => addToCart(card)} className="btn btn-primary btn-sm">
                                                            Aggiungi
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                )}
            </section>
        </>
    );

}