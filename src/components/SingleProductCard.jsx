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
            € <span className="dz-prodotto-senza-sconto">{product.price.toFixed(2)}</span>
            {product.discount_price && (
              <span className="dz-prezzo-scontato">
                &nbsp;€ {product.discount_price.toFixed(2)}
              </span>
            )}
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