import { Link } from "react-router-dom";
import "./ThankYouPage.css";

export default function ThankYouPage() {
  return (
    <section className="page-section">
      <div className="app-container">
        <article className="surface-card thankyou-card">
          <div className="thankyou-icon">
            <i className="bi bi-check2-circle"></i>
          </div>
          <h1 className="title-lg">Ordine confermato</h1>
          <p className="text-muted">
            Grazie per il tuo acquisto. Abbiamo ricevuto il tuo ordine e ti invieremo presto una email di conferma.
          </p>

          <div className="thankyou-actions">
            <Link to="/products" className="btn-ui btn-ui-primary neon-btn">
              Continua lo shopping
            </Link>
            <Link to="/" className="btn-ui btn-ui-outline">
              Torna alla home
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
