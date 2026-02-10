import axios from "axios";
import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useFavourites } from "../context/FavouritesContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";


export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isGridMode, setisGridMode] = useState("");
    const [categoria, setcategoria] = useState("");
    const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;
    const { isFavourite, toggleFavourite } = useFavourites();
    const { cart, addToCart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [favToast, setFavToast] = useState(null);
    const [showFavToast, setShowFavToast] = useState(false);
    useEffect(() => {
        if (toast && showToast) {
            const timer = setTimeout(() => setShowToast(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [toast, showToast]);

    useEffect(() => {
        if (favToast && showFavToast) {
            const timer = setTimeout(() => setShowFavToast(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [favToast, showFavToast]);


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
            </div>
            <section className="ot-home-container ot-bg-teal">
                <div className="ot-hero-section"></div>



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
                                        <div className="col-sm-12 col-md-6 col-lg-4" key={idx}>
                                            <div className="card mb-3 ot-product-card">
                                                {/* HEART ICON */}
                                                <button
                                                    onClick={() => {
                                                        toggleFavourite(card);
                                                        if (!isFavourite(card.id)) {
                                                            setFavToast({
                                                                name: card.name,
                                                                time: 'adesso',
                                                                image: `${backendBaseUrl}${card.image}`
                                                            });
                                                            setShowFavToast(true);
                                                        }
                                                    }}
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
                                                        <div className="card-body dz-card-body">
                                                            <img
                                                                src={`${backendBaseUrl}${card.image}`}
                                                                alt={card.name}
                                                                style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain', marginBottom: '10px' }}
                                                            />
                                                            <h5 className="card-title">{card.name}</h5>
                                                            <p className="card-text">{isGridMode === "" ? "" : card.description}</p>
                                                            <div className="ot-card-actions">
                                                                <Link to={`/products/${card.slug}`} className="btn btn-outline-primary btn-sm">
                                                                    Dettagli
                                                                </Link>
                                                                {(() => {
                                                                    const cartItem = cart.find(item => item.id === card.id);
                                                                    const isInCart = !!cartItem;
                                                                    const quantity = cartItem?.quantity || 0;
                                                                    if (!isInCart) {
                                                                        return (
                                                                            <button
                                                                                onClick={() => {
                                                                                    addToCart(card);
                                                                                    setToast({
                                                                                        name: card.name,
                                                                                        time: 'adesso',
                                                                                        image: `${backendBaseUrl}${card.image}`
                                                                                    });
                                                                                    setShowToast(true);
                                                                                }}
                                                                                className="btn btn-primary btn-sm"
                                                                            >
                                                                                Aggiungi <i className="bi bi-cart-plus"></i>
                                                                            </button>
                                                                        );
                                                                    } else {
                                                                        return (
                                                                            <>
                                                                                <div className="d-flex align-items-center gap-1">
                                                                                    <button
                                                                                        onClick={() => decreaseQuantity(card.id)}
                                                                                        className="btn btn-outline-secondary btn-sm"
                                                                                    >
                                                                                        -
                                                                                    </button>
                                                                                    <span className="fw-bold">{quantity}</span>
                                                                                    <button
                                                                                        onClick={() => increaseQuantity(card.id)}
                                                                                        className="btn btn-outline-secondary btn-sm"
                                                                                    >
                                                                                        +
                                                                                    </button>
                                                                                </div>
                                                                                <button
                                                                                    onClick={() => navigate("/shopping-cart")}
                                                                                    className="btn btn-success btn-sm"
                                                                                >
                                                                                    Carrello
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => removeFromCart(card.id)}
                                                                                    className="btn btn-outline-danger btn-sm"
                                                                                >
                                                                                    Rimuovi
                                                                                </button>
                                                                            </>
                                                                        );
                                                                    }
                                                                })()}
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
                                                        <div className="card-body dz-card-body">
                                                            <img
                                                                src={`${backendBaseUrl}${card.image}`}
                                                                alt={card.name}
                                                                style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain', marginBottom: '10px' }}
                                                            />
                                                            <h5 className="card-title">{card.name}</h5>
                                                            <p className="card-text">{isGridMode === "" ? "" : card.description}</p>
                                                            <div className="ot-card-actions">
                                                                <Link to={`/products/${card.slug}`} className="btn btn-outline-primary btn-sm">
                                                                    Vedi dettagli
                                                                </Link>
                                                                <button
                                                                    onClick={() => {
                                                                        addToCart(card);
                                                                        setToast({
                                                                            name: card.name,
                                                                            time: 'adesso',
                                                                            image: `${backendBaseUrl}${card.image}`
                                                                        });
                                                                        setShowToast(true);
                                                                    }}
                                                                    className="btn btn-primary btn-sm"
                                                                >
                                                                    Aggiungi <i className="bi bi-cart-plus"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                            )}
                            {/* Toast notification */}
                            {/* Toast notification preferiti */}
                            {favToast && showFavToast && (
                                <div className="toast-container position-fixed" style={{ bottom: 90, right: 30, zIndex: 9999 }}>
                                    <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true" style={{ minWidth: 320, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                                        <div className="toast-header" style={{ background: '#f5f5f5', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                                            <img src={favToast.image} className="rounded me-2" alt={favToast.name} style={{ width: 32, height: 32, objectFit: 'cover', marginRight: 8 }} />
                                            <strong className="me-auto">Preferiti</strong>
                                            <small className="text-body-secondary">{favToast.time}</small>
                                            <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowFavToast(false)} style={{ marginLeft: 8, border: 'none', background: 'transparent', fontSize: 18 }}>×</button>
                                        </div>
                                        <div className="toast-body" style={{ padding: '12px 24px', fontSize: 18 }}>
                                            Hai aggiunto <b>{favToast.name}</b> ai preferiti
                                            <div style={{ marginTop: 12 }}>
                                                <Link to="products/favourites" className="btn btn-danger btn-sm" style={{ fontWeight: 'bold', fontSize: 16 }} onClick={() => setShowFavToast(false)}>
                                                    Vedi nella pagina dei preferiti
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {toast && showToast && (
                                <div className="toast-container position-fixed" style={{ bottom: 30, right: 30, zIndex: 9999 }}>
                                    <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true" style={{ minWidth: 320, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                                        <div className="toast-header" style={{ background: '#f5f5f5', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                                            <img src={toast.image} className="rounded me-2" alt={toast.name} style={{ width: 32, height: 32, objectFit: 'cover', marginRight: 8 }} />
                                            <strong className="me-auto">Carrello</strong>
                                            <small className="text-body-secondary">{toast.time}</small>
                                            <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowToast(false)} style={{ marginLeft: 8, border: 'none', background: 'transparent', fontSize: 18 }}>×</button>
                                        </div>
                                        <div className="toast-body" style={{ padding: '12px 24px', fontSize: 18 }}>
                                            Hai aggiunto <b>{toast.name}</b> al carrello
                                            <div style={{ marginTop: 12 }}>
                                                <Link to="/shopping-cart" className="btn btn-success btn-sm" style={{ fontWeight: 'bold', fontSize: 16 }} onClick={() => setShowToast(false)}>
                                                    Vedi nel carrello
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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

                                            <div className="ot-list-card-body dz-card-body">
                                                <img
                                                    src={`${backendBaseUrl}${card.image}`}
                                                    alt={card.name}
                                                    className="ot-list-card-image"
                                                />
                                                <div className="ot-list-card-content">
                                                    <h5 className="card-title">{card.name}</h5>
                                                    <p className="card-text">{isGridMode === "" ? "" : card.description}</p>
                                                    <div className="ot-list-card-actions">
                                                        <Link to={`/products/${card.slug}`} className="btn btn-outline-primary btn-sm">
                                                            Vedi dettagli
                                                        </Link>
                                                        {/* <button
                                                            onClick={() => {
                                                                addToCart(card);
                                                                setToast({
                                                                    name: card.name,
                                                                    time: 'adesso',
                                                                    image: `${backendBaseUrl}${card.image}`
                                                                });
                                                                setShowToast(true);
                                                            }}
                                                            className="btn btn-primary btn-sm"
                                                        >
                                                            Aggiungi <i className="bi bi-cart-plus"></i>
                                                        </button> */}

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

                                            <div className="ot-list-card-body dz-card-body">
                                                <img
                                                    src={`${backendBaseUrl}${card.image}`}
                                                    alt={card.name}
                                                    className="ot-list-card-image"
                                                />
                                                <div className="ot-list-card-content">
                                                    <h5 className="card-title">{card.name}</h5>
                                                    <p className="card-text">{isGridMode === "" ? "" : card.description}</p>
                                                    <div className="ot-list-card-actions">
                                                        <Link to={`/products/${card.slug}`} className="btn btn-outline-primary btn-sm">
                                                            Dettagli
                                                        </Link>
                                                        {(() => {
                                                            const cartItem = cart.find(item => item.id === card.id);
                                                            const isInCart = !!cartItem;
                                                            const quantity = cartItem?.quantity || 0;
                                                            if (!isInCart) {
                                                                return (
                                                                    <button
                                                                        onClick={() => addToCart(card)}
                                                                        className="btn btn-primary btn-sm"
                                                                    >
                                                                        Aggiungi<i className="bi bi-cart-plus"></i>
                                                                    </button>
                                                                );
                                                            } else {
                                                                return (
                                                                    <>
                                                                        <div className="d-flex align-items-center gap-1">
                                                                            <button
                                                                                onClick={() => decreaseQuantity(card.id)}
                                                                                className="btn btn-outline-secondary btn-sm"
                                                                            >
                                                                                -
                                                                            </button>
                                                                            <span className="fw-bold">{quantity}</span>
                                                                            <button
                                                                                onClick={() => increaseQuantity(card.id)}
                                                                                className="btn btn-outline-secondary btn-sm"
                                                                            >
                                                                                +
                                                                            </button>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => navigate("/shopping-cart")}
                                                                            className="btn btn-success btn-sm"
                                                                        >
                                                                            Carrello
                                                                        </button>
                                                                        <button
                                                                            onClick={() => removeFromCart(card.id)}
                                                                            className="btn btn-outline-danger btn-sm"
                                                                        >
                                                                            Rimuovi
                                                                        </button>
                                                                    </>
                                                                );
                                                            }
                                                        })()}
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