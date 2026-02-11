import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useFavourites } from "../context/FavouritesContext";
import { useToasts } from "../hooks/useToasts";
import Toasts from "./Toasts";
import "./ProductItem.css";

function formatPrice(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "EUR 0.00";
  return `EUR ${amount.toFixed(2)}`;
}

export default function ProductRow({ product }) {
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const { isFavourite, toggleFavourite } = useFavourites();
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

  const cartItem = cart.find((item) => item.id === product.id);
  const isInCart = Boolean(cartItem);
  const quantity = cartItem?.quantity || 0;

  function toggleFav() {
    const wasFavourite = isFavourite(product.id);
    toggleFavourite(product);
    fireFavToast({
      name: product.name,
      time: "adesso",
      image: `${backendBaseUrl}${product.image}`,
      message: wasFavourite ? "Hai rimosso dai preferiti:" : "Hai aggiunto ai preferiti:",
    });
  }

  function addItem() {
    addToCart(product);
    fireCartToast({
      name: product.name,
      time: "adesso",
      image: `${backendBaseUrl}${product.image}`,
      message: "Hai aggiunto al carrello:",
    });
  }

  function removeItem() {
    removeFromCart(product.id);
    fireCartToast({
      name: product.name,
      time: "adesso",
      image: `${backendBaseUrl}${product.image}`,
      message: "Hai rimosso dal carrello:",
    });
  }

  function increaseItem() {
    increaseQuantity(product.id);
    fireCartToast({
      name: product.name,
      time: "adesso",
      image: `${backendBaseUrl}${product.image}`,
      message: `Quantita aumentata (ora ${quantity + 1}):`,
    });
  }

  function decreaseItem() {
    if (quantity <= 1) {
      removeItem();
      return;
    }
    decreaseQuantity(product.id);
    fireCartToast({
      name: product.name,
      time: "adesso",
      image: `${backendBaseUrl}${product.image}`,
      message: `Quantita diminuita (ora ${quantity - 1}):`,
    });
  }

  const hasDiscount = Number(product.discount_price) > 0 && Number(product.discount_price) < Number(product.price);

  return (
    <>
      <article className="surface-card product-row neon-card">
        <button
          type="button"
          className={`product-heart ${isFavourite(product.id) ? "active" : ""}`}
          onClick={toggleFav}
          aria-label={isFavourite(product.id) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
        >
          <i className={isFavourite(product.id) ? "bi bi-heart-fill" : "bi bi-heart"}></i>
        </button>

        <Link to={`/products/${product.slug}`} className="product-row-image-wrap">
          <img src={`${backendBaseUrl}${product.image}`} alt={product.name} className="product-row-image" />
        </Link>

        <div className="product-row-info">
          <h3 className="line-clamp-2">{product.name}</h3>
          {product.description && <p className="product-description line-clamp-2">{product.description}</p>}
          <div className="price-row">
            {hasDiscount ? (
              <>
                <span className="price-old">{formatPrice(product.price)}</span>
                <span className="price-discount">{formatPrice(product.discount_price)}</span>
              </>
            ) : (
              <span className="price-now">{formatPrice(product.price)}</span>
            )}
          </div>
        </div>

        <div className="product-row-actions">
          <Link to={`/products/${product.slug}`} className="btn-ui btn-ui-outline" aria-label="Dettagli prodotto">
            <i className="bi bi-eye" title="Dettagli prodotto" aria-hidden="true"></i>
          </Link>

          {!isInCart ? (
            <button type="button" className="btn-ui btn-ui-primary neon-btn" onClick={addItem}>
              Aggiungi
            </button>
          ) : (
            <>
              <div className="product-stepper">
                <button type="button" onClick={decreaseItem}>
                  -
                </button>
                <span>{quantity}</span>
                <button type="button" onClick={increaseItem}>
                  +
                </button>
              </div>
              <button type="button" className="btn-ui btn-ui-outline neon-btn" onClick={() => navigate("/shopping-cart")}>
                Carrello
              </button>
            </>
          )}
        </div>
      </article>

      <Toasts
        toast={toast}
        showToast={showToast}
        setShowToast={setShowToast}
        favToast={favToast}
        showFavToast={showFavToast}
        setShowFavToast={setShowFavToast}
      />
    </>
  );
}
