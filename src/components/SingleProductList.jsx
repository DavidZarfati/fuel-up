import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useFavourites } from "../context/FavouritesContext";
import { useToasts } from "../hooks/useToasts";
import Toasts from "./Toasts";

export default function SingleProductList({ product }) {
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;

  const { cart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity } =
    useCart();
  const { isFavourite, toggleFavourite } = useFavourites();
  const navigate = useNavigate();

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
  const isInCart = !!cartItem;
  const quantity = cartItem?.quantity || 0;

  function handleToggleFavourite() {
    const wasFav = isFavourite(product.id);
    toggleFavourite(product);

    fireFavToast({
      name: product.name,
      time: "adesso",
      image: `${backendBaseUrl}${product.image}`,
      message: wasFav ? "Hai rimosso dai preferiti:" : "Hai aggiunto ai preferiti:",
    });
  }

  function handleAddToCart() {
    addToCart(product);
    fireCartToast({
      name: product.name,
      time: "adesso",
      image: `${backendBaseUrl}${product.image}`,
      message: "Hai aggiunto al carrello:",
    });
  }

  function handleRemoveFromCart() {
    removeFromCart(product.id);
    fireCartToast({
      name: product.name,
      time: "adesso",
      image: `${backendBaseUrl}${product.image}`,
      message: "Hai rimosso dal carrello:",
    });
  }

  function handleIncrease() {
    increaseQuantity(product.id);
    fireCartToast({
      name: product.name,
      time: "adesso",
      image: `${backendBaseUrl}${product.image}`,
      message: `Quantità aumentata (ora ${quantity + 1}):`,
    });
  }

  function handleDecrease() {
    if (quantity <= 1) {
      handleRemoveFromCart();
      return;
    }
    decreaseQuantity(product.id);
    fireCartToast({
      name: product.name,
      time: "adesso",
      image: `${backendBaseUrl}${product.image}`,
      message: `Quantità diminuita (ora ${quantity - 1}):`,
    });
  }

  return (
    <>
      <div className="card h-100 shadow-sm position-relative pb-2e">
        {/* ❤️ CUORE */}
        <button
          onClick={handleToggleFavourite}
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
            style={{
              color: isFavourite(product.id) ? "#b03c47ff" : "#666",
              fontSize: "18px",
            }}
          />
        </button>

        <div className="row g-0 align-items-center p-2">
          <div className="col-3 col-md-2 p-2 text-center">
            <img
              src={`${backendBaseUrl}${product.image}`}
              alt={product.name}
              className="img-fluid"
              style={{ maxHeight: "120px", objectFit: "contain" }}
            />
          </div>

          <div className="col-9 col-md-10">
            <div className="card-body py-2 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
              <div>
                <h5 className="mb-1">{product.name}</h5>

                {product.description && (
                  <p className="text-muted small mb-1 line-clamp-2">
                    {product.description}
                  </p>
                )}

                <div className="ot-list-item-details">
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
              </div>

              <div className="d-flex gap-2 flex-wrap align-items-center">
                <Link
                  to={`/products/${product.slug}`}
                  className="btn btn-outline-primary btn-sm"
                >
                  Dettagli
                </Link>

                {!isInCart ? (
                  <button onClick={handleAddToCart} className="btn btn-primary btn-sm">
                    Aggiungi
                  </button>
                ) : (
                  <>
                    <div className="d-flex align-items-center gap-1">
                      <button
                        onClick={handleDecrease}
                        className="btn btn-outline-secondary btn-sm"
                      >
                        -
                      </button>

                      <span className="fw-bold">{quantity}</span>

                      <button
                        onClick={handleIncrease}
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
                      onClick={handleRemoveFromCart}
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
      </div>

      {/* ✅ Toast identici a HomePage */}
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
