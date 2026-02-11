import { Link } from "react-router-dom";
import "./Toast.css";

export default function Toast({ toast, visible, onClose, type = "cart" }) {
  if (!toast || !visible) return null;

  const isFavourite = type === "fav";
  const title = isFavourite ? "Preferiti" : "Carrello";
  const fallbackMessage = isFavourite
    ? `Hai aggiornato i preferiti: ${toast.name}`
    : `Hai aggiornato il carrello: ${toast.name}`;
  const linkTo = isFavourite ? "/products/favourites" : "/shopping-cart";
  const linkLabel = isFavourite ? "Vai ai preferiti" : "Vai al carrello";

  return (
    <div className={`ot-toast ${isFavourite ? "ot-toast-fav" : "ot-toast-cart"}`} role="alert" aria-live="assertive" aria-atomic="true">
      <div className="ot-toast-header">
        <img src={toast.image} alt={toast.name} />
        <strong>{title}</strong>
        <small>{toast.time}</small>
        <button type="button" onClick={onClose} aria-label="Chiudi notifica">
          <i className="bi bi-x"></i>
        </button>
      </div>

      <div className="ot-toast-body">
        <p>{toast.message ? `${toast.message} ${toast.name}` : fallbackMessage}</p>
        <Link to={linkTo} className="btn-ui btn-ui-outline" onClick={onClose}>
          {linkLabel}
        </Link>
      </div>
    </div>
  );
}
