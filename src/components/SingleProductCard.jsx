import { Link } from "react-router-dom";

export default function SingleProductCard({ product }) {
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;

  return (
    <div className="card h-100 shadow-sm container pb-2">
      {/* IMMAGINE */}
      <img
        src={`${backendBaseUrl}${product.image}`}
        className="card-img-top"
        alt={product.title}
        style={{
          height: "220px",
          objectFit: "cover",
        }}
      />

      {/* BODY */}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-truncate">
          {product.name}
        </h5>

        {product.description && (
          <p className="card-text text-muted small line-clamp-2">
            {product.description}
          </p>
        )}

        {/* PREZZO */}
        {product.price && (
          <p className="fw-bold mb-3">
            € {product.price.toFixed(2)}
          </p>
        )}

        {/* FOOTER */}
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <Link
            to={`/products/${product.slug}`}
            className="btn btn-outline-primary btn-sm"
          >
            Dettagli
          </Link>

          {/* esempio futuro carrello */}
          {/* <button className="btn btn-primary btn-sm">
            Aggiungi
          </button> */}
        </div>
      </div>
    </div>
  );
}
