import { useFavourites } from "../context/FavouritesContext";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import SingleProductCard from "../components/SingleProductCard";
import "./FavouritePage.css";
import { useState } from "react";


export default function FavouritePage() {

  const { favourites, isFavourite, toggleFavourite } = useFavourites();
  const { addToCart } = useCart();
  const [isGridMode, setisGridMode] = useState("");
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;

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
                  onClick={() => toggleFavourite(product)}
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
                  <p className="ot-list-item-price">€ {product.price?.toFixed(2)}</p>
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
    </section>
  );
}