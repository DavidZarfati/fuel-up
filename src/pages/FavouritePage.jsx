import { useState } from "react";
import { useFavourites } from "../context/FavouritesContext";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductRow from "../components/ProductRow";
import ViewToggle from "../components/ViewToggle";
import EmptyState from "../components/EmptyState";
import "./FavouritePage.css";

export default function FavouritePage() {
  const { favourites, clearFavourites } = useFavourites();
  const [view, setView] = useState("grid");

  return (
    <section className="page-section">
      <div className="app-container">
        <div className="surface-card favourites-header">
          <div>
            <h1 className="title-lg">Preferiti</h1>
            <p className="text-muted">
              {favourites.length > 0
                ? `${favourites.length} ${favourites.length === 1 ? "prodotto salvato" : "prodotti salvati"}`
                : "Nessun prodotto nei preferiti"}
            </p>
          </div>
          {favourites.length > 0 && (
            <button type="button" className="btn-ui btn-ui-danger" onClick={clearFavourites}>
              <i className="bi bi-trash"></i>
              Svuota preferiti
            </button>
          )}
        </div>

        {favourites.length === 0 && (
          <EmptyState
            icon="bi bi-heart"
            title="Preferiti vuoti"
            description="Salva i tuoi prodotti preferiti e ritrovali subito qui."
            ctaLabel="Vai ai prodotti"
            ctaTo="/products"
          />
        )}

        {favourites.length > 0 && (
          <>
            <div className="surface-card toolbar">
              <div className="toolbar-group">
                <span className="toolbar-label">Visualizza</span>
                <ViewToggle value={view} onChange={setView} />
              </div>
            </div>

            {view === "grid" ? (
              <div className="products-grid">
                {favourites.map((product, index) => (
                  <ProductCard key={product.id ?? index} product={product} />
                ))}
              </div>
            ) : (
              <div className="products-list">
                {favourites.map((product, index) => (
                  <ProductRow key={product.id ?? index} product={product} />
                ))}
              </div>
            )}

            <div className="favourites-footer-link">
              <Link to="/products" className="btn-ui btn-ui-outline">
                Continua lo shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
