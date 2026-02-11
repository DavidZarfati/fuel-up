import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFavourites } from "../context/FavouritesContext";
import { useCart } from "../context/CartContext";
import { useToasts } from "../hooks/useToasts";
import Toasts from "../components/Toasts";
import RelatedProductsCarousel from "../components/CaroselProducts";
import EmptyState from "../components/EmptyState";
import "./ProductDetailPage.css";

function formatPrice(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "EUR 0.00";
  return `EUR ${amount.toFixed(2)}`;
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { isFavourite, toggleFavourite } = useFavourites();
  const { addToCart } = useCart();
  const {
    toast,
    showToast,
    setShowToast,
    favToast,
    showFavToast,
    setShowFavToast,
    fireCartToast,
    fireFavToast,
  } = useToasts();

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");

    axios
      .get(`${backendBaseUrl}/api/products/${slug}`)
      .then((resp) => {
        if (!ignore) setProduct(resp.data);
      })
      .catch(() => {
        if (!ignore) setError("Prodotto non trovato.");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [backendBaseUrl, slug]);

  const item = useMemo(() => product?.result?.[0] ?? null, [product]);

  function handleAddToCart() {
    if (!item) return;
    // add with quantity if supported by CartContext
    try {
      addToCart(item, quantity);
    } catch (e) {
      // fallback: call multiple times
      for (let i = 0; i < quantity; i++) addToCart(item);
    }
    fireCartToast({
      name: item.name,
      time: "adesso",
      image: `${backendBaseUrl}${item.image}`,
      message: `Hai aggiunto al carrello (${quantity}):`,
    });
  }

  function handleToggleFavourite() {
    if (!item) return;
    const wasFavourite = isFavourite(item.id);
    toggleFavourite(item);
    fireFavToast({
      name: item.name,
      time: "adesso",
      image: `${backendBaseUrl}${item.image}`,
      message: wasFavourite ? "Hai rimosso dai preferiti:" : "Hai aggiunto ai preferiti:",
    });
  }

  if (loading) {
    return (
      <section className="page-section">
        <div className="app-container">
          <div className="surface-card state-card">Caricamento prodotto...</div>
        </div>
      </section>
    );
  }

  if (error || !item) {
    return (
      <section className="page-section">
        <div className="app-container">
          <EmptyState icon="bi bi-exclamation-circle" title="Prodotto non disponibile" description={error || "Dati prodotto non disponibili."} ctaLabel="Torna ai prodotti" ctaTo="/products" />
        </div>
      </section>
    );
  }

  const hasDiscount =
    Number(item.discount_price) > 0 && Number(item.discount_price) < Number(item.price);

  return (
    <section className="page-section">
      <div className="app-container">
        <article className="surface-card detail-layout">
          <div className="detail-image-wrap">
            <img src={`${backendBaseUrl}${item.image}`} alt={item.name} className="detail-image" />
            <button
              type="button"
              className={`detail-heart ${isFavourite(item.id) ? "active" : ""}`}
              onClick={handleToggleFavourite}
              aria-label={isFavourite(item.id) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
            >
              <i className={isFavourite(item.id) ? "bi bi-heart-fill" : "bi bi-heart"}></i>
            </button>
          </div>

          <div className="detail-content">
            <h1 className="title-lg">{item.name}</h1>
            <p className="text-muted">{item.description || "Nessuna descrizione disponibile."}</p>

            <div className="detail-meta-grid">
              {item.brand && <p><strong>Brand:</strong> {item.brand}</p>}
              {item.size && <p><strong>Formato:</strong> {item.size}</p>}
              {item.color && <p><strong>Colore:</strong> {item.color}</p>}
              {item.flavor && <p><strong>Gusto:</strong> {item.flavor}</p>}
            </div>

            {item.manufacturer_note && <p className="detail-note">{item.manufacturer_note}</p>}

            <div className="price-row">
              {hasDiscount ? (
                <>
                  <span className="price-old">{formatPrice(item.price)}</span>
                  <span className="price-discount">{formatPrice(item.discount_price)}</span>
                </>
              ) : (
                <span className="price-now">{formatPrice(item.price)}</span>
              )}
            </div>

            <div className="product-quantity-row">
              <div className="product-stepper">
                <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity((q) => q + 1)}>+</button>
              </div>
            </div>

            <button type="button" className="btn-ui btn-ui-primary detail-cart-btn" onClick={handleAddToCart}>
              Aggiungi al carrello <i className="bi bi-cart3"></i>
            </button>
          </div>
        </article>

        <RelatedProductsCarousel slug={slug} />
      </div>

      <Toasts
        toast={toast}
        showToast={showToast}
        setShowToast={setShowToast}
        favToast={favToast}
        showFavToast={showFavToast}
        setShowFavToast={setShowFavToast}
      />
    </section>
  );
}