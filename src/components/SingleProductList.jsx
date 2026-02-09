import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function SingleProductList({ product }) {
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;
  const { addToCart } = useCart();

  function handleAddToCart() {
    addToCart(product);
  }

  return (
    <div className="card shadow-sm mb-3">
      <div className="row g-0 align-items-center">

        {/* IMMAGINE */}
        <div className="col-3 col-md-2 p-2 text-center">
          <img
            src={`${backendBaseUrl}${product.image}`}
            alt={product.name}
            className="img-fluid"
            style={{ maxHeight: "120px", objectFit: "contain" }}
          />
        </div>

        {/* CONTENUTO */}
        <div className="col-9 col-md-10">
          <div className="card-body py-2 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">

            {/* TESTO */}
            <div>
              <h5 className="mb-1">{product.name}</h5>

              {product.description && (
                <p className="text-muted small mb-1 line-clamp-2">
                  {product.description}
                </p>
              )}

              {product.price && (
                <p className="fw-bold mb-0">
                  € {product.price.toFixed(2)}
                </p>
              )}
            </div>

            {/* AZIONI */}
            <div className="d-flex gap-2">
              <Link
                to={`/products/${product.slug}`}
                className="btn btn-outline-primary btn-sm"
              >
                Dettagli
              </Link>
              <button
                onClick={handleAddToCart}
                className="btn btn-primary btn-sm"
              >
                Aggiungi
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
