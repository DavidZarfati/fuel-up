import { Link } from "react-router-dom";
import "./EmptyState.css";

export default function EmptyState({
  icon = "bi bi-box-seam",
  title = "Nessun contenuto",
  description = "Non ci sono elementi da visualizzare al momento.",
  ctaLabel,
  ctaTo = "/products",
  onCtaClick, // ✅ nuovo
}) {
  return (
    <div className="surface-card state-card empty-state">
      <i className={icon}></i>
      <h3>{title}</h3>
      <p>{description}</p>

      {ctaLabel &&
        (onCtaClick ? (
          <button type="button" onClick={onCtaClick} className="btn-ui btn-ui-primary neon-btn">
            {ctaLabel}
          </button>
        ) : (
          <Link to={ctaTo} className="btn-ui btn-ui-primary neon-btn">
            {ctaLabel}
          </Link>
        ))}
    </div>
  );
}

