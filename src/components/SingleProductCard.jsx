import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useFavourites } from "../context/FavouritesContext";



export default function SingleProductCard({ product }) {

  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;
  const { addToCart } = useCart();
  const { isFavourite, toggleFavourite } = useFavourites();


  function handleAddToCart() {
    addToCart(product);
  }


  function handleToggleFavourite() {
    toggleFavourite(product);
  }

  return (
    <div className="card h-100 shadow-sm container pb-2" style={{ position: "relative" }}>
      {/* HEART ICON */}
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
        aria-label={isFavourite(product.id) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
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
          <p className="fw-bold mb-3">
            € {product.price.toFixed(2)}
          </p>
        )}



        <div className="mt-auto d-flex justify-content-between align-items-center">
          <Link
            to={`/products/${product.slug}`}
            className="btn btn-outline-primary btn-sm"
          >
            Dettagli
          </Link>


          <button onClick={handleAddToCart} className="btn btn-primary btn-sm">
            Aggiungi
          </button>
        </div>
      </div>
    </div>
  );
}