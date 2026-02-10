import axios from "axios";
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useFavourites } from "../context/FavouritesContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import Toasts from "../components/Toasts";
import "./HomePage.css";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isGridMode, setIsGridMode] = useState(""); // "" = griglia, 1 = lista
  const [categoria, setCategoria] = useState("");   // "" = best sellers, numero = categoria

  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;

  const { isFavourite, toggleFavourite } = useFavourites();
  const { cart, addToCart, increaseQuantity, decreaseQuantity, removeFromCart } =
    useCart();

  const navigate = useNavigate();

  // TOAST STATE (una sola volta)
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
    axios
      .get(`${backendBaseUrl}/api/products?limit=30`)
      .then((resp) => {
        let arr = [];
        if (Array.isArray(resp.data)) arr = resp.data;
        else if (Array.isArray(resp.data.result)) arr = resp.data.result;
        else if (Array.isArray(resp.data.products)) arr = resp.data.products;

        setProducts(arr);
        setLoading(false);
      })
      .catch(() => {
        setError("Errore nel caricamento dei prodotti");
        setLoading(false);
      });
  }, [backendBaseUrl]);

  // Lista filtrata
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    if (categoria === "") return products.slice(0, 12);
    return products.filter((p) => p.macro_categories_id === categoria);
  }, [products, categoria]);

  // HANDLERS (niente ripetizioni)
  function handleFav(card) {
    const alreadyFav = isFavourite(card.id);
    toggleFavourite(card);

    // Mostro toast solo quando aggiungo (come il tuo codice)
    if (!alreadyFav) {
      setFavToast({
        name: card.name,
        time: "adesso",
        image: `${backendBaseUrl}${card.image}`,
      });
      setShowFavToast(true);
    }
  }

  function handleCartAdd(card) {
    addToCart(card);
    setToast({
      name: card.name,
      time: "adesso",
      image: `${backendBaseUrl}${card.image}`,
    });
    setShowToast(true);
  }

  // RENDER CARD (un solo blocco per tutte le situazioni)
  function renderProductCard(card, idx) {
    const cartItem = cart.find((item) => item.id === card.id);
    const isInCart = !!cartItem;
    const quantity = cartItem?.quantity || 0;

    // scegli la classe/layout in base alla modalità
    const cardClass = !isGridMode ? "card mb-3 ot-product-card" : "card mb-3 ot-product-card-list";

    return (
      <div key={card.id ?? idx} className={!isGridMode ? "col-sm-12 col-md-6 col-lg-4" : "col-12"}>
        <div className={cardClass}>
          {/* HEART ICON */}
          <button
            onClick={() => handleFav(card)}
            className="ot-heart-button"
            aria-label={isFavourite(card.id) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
          >
            <i
              className={isFavourite(card.id) ? "bi bi-heart-fill" : "bi bi-heart"}
              style={{ color: isFavourite(card.id) ? "#dc3545" : "#666", fontSize: "18px" }}
            />
          </button>

          {/* BODY: cambia leggermente tra grid/list */}
          {!isGridMode ? (
            <div className="row no-gutters align-items-center">
              <div className="col-12">
                <div className="card-body dz-card-body">
                  <img
                    src={`${backendBaseUrl}${card.image}`}
                    alt={card.name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "150px",
                      objectFit: "contain",
                      marginBottom: "10px",
                    }}
                  />
                  <h5 className="card-title">{card.name}</h5>
                  <p className="card-text">{isGridMode === "" ? "" : card.description}</p>

                  <div className="ot-card-actions">
                    <Link to={`/products/${card.slug}`} className="btn btn-outline-primary btn-sm">
                      Dettagli
                    </Link>

                    {!isInCart ? (
                      <button onClick={() => handleCartAdd(card)} className="btn btn-primary btn-sm">
                        Aggiungi
                      </button>
                    ) : (
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
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
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

                  {!isInCart ? (
                    <button onClick={() => handleCartAdd(card)} className="btn btn-primary btn-sm">
                      Aggiungi
                    </button>
                  ) : (
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
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="ot-home-container ot-bg-teal">
        <div className="ot-hero-section"></div>

        {/* FILTRI */}
        <div className="ot-home-filters">
          <div className="ot-filter-group">
            <label>Categorie:</label>
            <div className="ot-category-buttons">
              <button
                onClick={() => setCategoria("")}
                className={`ot-category-btn ${categoria === "" ? "active" : ""}`}
              >
                Prodotti più venduti
              </button>
              <button
                onClick={() => setCategoria(1)}
                className={`ot-category-btn ${categoria === 1 ? "active" : ""}`}
              >
                Integratori
              </button>
              <button
                onClick={() => setCategoria(2)}
                className={`ot-category-btn ${categoria === 2 ? "active" : ""}`}
              >
                Abbigliamento
              </button>
              <button
                onClick={() => setCategoria(3)}
                className={`ot-category-btn ${categoria === 3 ? "active" : ""}`}
              >
                Accessori
              </button>
              <button
                onClick={() => setCategoria(4)}
                className={`ot-category-btn ${categoria === 4 ? "active" : ""}`}
              >
                Cibo & Snacks
              </button>
            </div>
          </div>

          <div className="ot-filter-group">
            <label>Visualizza:</label>
            <div className="ot-view-buttons">
              <button
                onClick={() => setIsGridMode("")}
                className={`ot-view-btn ${!isGridMode ? "active" : ""}`}
              >
                <i className="bi bi-grid-3x3-gap"></i> Griglia
              </button>
              <button
                onClick={() => setIsGridMode(1)}
                className={`ot-view-btn ${isGridMode ? "active" : ""}`}
              >
                <i className="bi bi-list-ul"></i> Lista
              </button>
            </div>
          </div>
        </div>

        {/* LISTA PRODOTTI */}
        <div className={!isGridMode ? "container ot-bg-teal" : "container"}>
          <div className="row">
            {loading && <p>Caricamento prodotti...</p>}
            {error && <p>{error}</p>}

            {!loading && !error && filteredProducts.map(renderProductCard)}
          </div>
        </div>

        {/* ✅ Toast: una sola volta */}
        <Toasts
          toast={toast}
          showToast={showToast}
          setShowToast={setShowToast}
          favToast={favToast}
          showFavToast={showFavToast}
          setShowFavToast={setShowFavToast}
        />
      </section>
    </>
  );
}
