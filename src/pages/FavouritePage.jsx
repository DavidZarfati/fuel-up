import { useFavourites } from "../context/FavouritesContext";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import SingleProductCard from "../components/SingleProductCard";
import "./FavouritePage.css";
import { useState, useEffect } from "react";


export default function FavouritePage() {

  const { favourites, isFavourite, toggleFavourite, clearFavourites } = useFavourites();
  const { addToCart } = useCart();
  const [isGridMode, setisGridMode] = useState("");
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;

  // Toast preferiti
  const [favToast, setFavToast] = useState(null);
  const [showFavToast, setShowFavToast] = useState(false);

  useEffect(() => {
    if (!favToast || !showFavToast) return;
    const timer = setTimeout(() => setShowFavToast(false), 4000);
    return () => clearTimeout(timer);
  }, [favToast, showFavToast]);

  function handleToggleFavourite(product) {
    const alreadyFav = isFavourite(product.id);
    toggleFavourite(product);

    if (!alreadyFav) {
      setFavToast({
        name: product.name,
        time: "adesso",
        image: `${backendBaseUrl}${product.image}`,
      });
      setShowFavToast(true);
    }
  }

  function handleClearAll() {
    if (window.confirm("Sei sicuro di voler rimuovere tutti i prodotti dai preferiti?")) {
      clearFavourites();
    }
  }

  return (
    <section className="ot-favourite-page-container">
      <div className="ot-favourite-page-header">
        <h1>I tuoi prodotti preferiti</h1>

        <p className="ot-favourite-count-display">
          {favourites.length > 0
            ? `Hai ${favourites.length} ${favourites.length === 1 ? "prodotto preferito" : "prodotti preferiti"}`
            : "Nessun prodotto nei preferiti"}
        </p>
      </div>

      {/* Visualization toggle buttons - Only show if there are favourites */}
      {favourites.length > 0 && (
        <div className="ot-favourite-filters">
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

          <button
            onClick={handleClearAll}
            className="ot-clear-all-btn"
            disabled={favourites.length === 0}
          >
            <i className="bi bi-trash"></i> Svuota tutto
          </button>

        </div>
      )}

      {/* Empty state message */}
      {favourites.length === 0 && (
        <div className="ot-no-favourites-message">
          <i className="bi bi-heart" style={{ fontSize: "64px", color: "#ccc", marginBottom: "16px" }}></i>
          <p>Non hai ancora aggiunto nessun prodotto ai preferiti.</p>
          <p className="text-muted">
            Clicca sul cuore <i className="bi bi-heart"></i> nei prodotti che ti piacciono per aggiungerli qui!
          </p>
        </div>
      )}

      {/* Grid view */}
      {!isGridMode && favourites.length > 0 && (
        <div className="ot-products-grid">
          {favourites.map((product, index) => (
            <div className="ot-product-card-wrapper" key={product.id ?? index}>
              <button
                onClick={() => handleToggleFavourite(product)}
                className="ot-heart-button"
                aria-label={
                  isFavourite(product.id) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"
                }
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "35px",
                  height: "35px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 1,
                }}
              >
                <i
                  className={isFavourite(product.id) ? "bi bi-heart-fill" : "bi bi-heart"}
                  style={{ color: isFavourite(product.id) ? "#dc3545" : "#666", fontSize: "18px" }}
                />
              </button>

              <SingleProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      {/* List view */}
      {isGridMode && favourites.length > 0 && (
        <div className="ot-products-list">
          {favourites.map((product, index) => (
            <div className="ot-list-item" key={product.id ?? index}>
              <div className="ot-list-item-content">
                {/* Heart button */}
                <button
                  onClick={() => handleToggleFavourite(product)}
                  className="ot-heart-button-list"
                  aria-label={isFavourite(product.id) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
                >
                  <i
                    className={isFavourite(product.id) ? "bi bi-heart-fill" : "bi bi-heart"}
                    style={{
                      color: isFavourite(product.id) ? "#dc3545" : "#666",
                      fontSize: "18px",
                    }}
                  ></i>
                </button>

                {/* Product image */}
                <img
                  src={`${backendBaseUrl}${product.image}`}
                  alt={product.name}
                  className="ot-list-item-image"
                />

                {/* Product details */}
                <div className="ot-list-item-details">
                  <h5 className="ot-list-item-title">{product.name}</h5>
                  <p className="ot-list-item-description">{product.description}</p>
                  <p className="ot-list-item-price">
                    {product.discount_price ? (
                      <>
                        <span style={{ textDecoration: 'line-through', color: 'black' }}>
                          € {product.price?.toFixed(2)}
                        </span>
                        <span style={{ color: 'red', marginLeft: '8px' }}>
                          € {product.discount_price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <>€ {product.price?.toFixed(2)}</>
                    )}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="ot-list-item-actions">
                  <Link to={`/products/${product.slug}`} className="btn btn-outline-primary btn-sm">
                    Vedi dettagli
                  </Link>
                  <button onClick={() => addToCart(product)} className="btn btn-primary btn-sm">
                    Aggiungi
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toast notification preferiti */}
      {favToast && showFavToast && (
        <div className="toast-container position-fixed" style={{ bottom: 90, right: 30, zIndex: 9999 }}>
          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true"
            style={{ minWidth: 320, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
            <div className="toast-header" style={{ background: "#f5f5f5", borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
              <img src={favToast.image} className="rounded me-2" alt={favToast.name}
                style={{ width: 32, height: 32, objectFit: "cover", marginRight: 8 }} />
              <strong className="me-auto">Preferiti</strong>
              <small className="text-body-secondary">{favToast.time}</small>
              <button type="button" className="btn-close" aria-label="Close"
                onClick={() => setShowFavToast(false)}
                style={{ marginLeft: 8, border: "none", background: "transparent", fontSize: 18 }}>
                ×
              </button>
            </div>

            <div className="toast-body" style={{ padding: "12px 24px", fontSize: 18 }}>
              Hai aggiunto <b>{favToast.name}</b> ai preferiti
              <div style={{ marginTop: 12 }}>
                <Link
                  to="/products/favourites"
                  className="btn btn-danger btn-sm"
                  style={{ fontWeight: "bold", fontSize: 16 }}
                  onClick={() => setShowFavToast(false)}
                >
                  Vedi nella pagina dei preferiti
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}