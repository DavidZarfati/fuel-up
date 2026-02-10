import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useFavourites } from "../context/FavouritesContext";

export default function SingleProductCard({ product }) {

  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;

  const {
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity
  } = useCart();

  const { isFavourite, toggleFavourite } = useFavourites();

  const navigate = useNavigate();

  const cartItem = cart.find(item => item.id === product.id);
  const isInCart = !!cartItem;
  const quantity = cartItem?.quantity || 0;

  function handleToggleFavourite() {
    toggleFavourite(product);
  }

  return (
    <div className="card h-100 shadow-sm container pb-2" style={{ position: "relative" }}>

      {/* ❤️ CUORE PREFERITI */}
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
        ></i>
      </button>

      <img
        src={`${backendBaseUrl}${product.image}`}
        className="card-img-top"
        alt={product.title}
        style={{
          height: "220px",
          objectFit: "contain",
        }}
      />

      <div className="card-body d-flex flex-column">

        <h5 className="card-title text-truncate">
          {product.name}
        </h5>

        {product.description && (
          <p className="card-text text-muted small line-clamp-2">
            {product.description}
          </p>
        )}

        {product.price && (
          <p className="fw-bold mb-3 dz">
            € {product.price.toFixed(2)}
            {product.discount_price && (
              <span className="dz-prezzo-scontato">
                &nbsp;€ {product.discount_price.toFixed(2)}
              </span>
            )}
          </p>
        )}

        {/* BOTTONI */}
        <div className="mt-auto d-flex gap-2 flex-wrap align-items-center">

          <Link
            to={`/products/${product.slug}`}
            className="btn btn-outline-primary btn-sm"
          >
            Dettagli
          </Link>

          {!isInCart ? (

            <button
              onClick={() => addToCart(product)}
              className="btn btn-primary btn-sm"
            >
              Aggiungi
            </button>

          ) : (

            <>
              <div className="d-flex align-items-center gap-1">

                <button
                  onClick={() => decreaseQuantity(product.id)}
                  className="btn btn-outline-secondary btn-sm"
                >
                  -
                </button>

                <span className="fw-bold">
                  {quantity}
                </span>

                <button
                  onClick={() => increaseQuantity(product.id)}
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
                onClick={() => removeFromCart(product.id)}
                className="btn btn-outline-danger btn-sm"
              >
                Rimuovi
              </button>

            </>
          )}

        </div>

      </div>
    </div>
  );
}
