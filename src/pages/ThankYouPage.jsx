import { Link, useLocation } from "react-router-dom";
import { useMemo } from "react";
import "./ThankYouPage.css";

function formatPrice(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "EUR 0.00";
  return `EUR ${amount.toFixed(2)}`;
}

export default function ThankYouPage() {
  const location = useLocation();
  const orderSummary = useMemo(() => {
    if (location.state?.orderSummary) return location.state.orderSummary;

    try {
      const raw = sessionStorage.getItem("lastOrderSummary");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [location.state]);

  const hasWeight = Number(orderSummary?.totals?.totalWeight) > 0;

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

          {orderSummary ? (
            <div className="thankyou-summary surface-card">
              <h2 className="title1">Riepilogo ordine</h2>

              <div className="thankyou-summary-list">
                {orderSummary.items.map((item) => (
                  <div className="thankyou-summary-row" key={`${item.id}-${item.name}`}>
                    <div className="thankyou-summary-info">
                      <p className="thankyou-item-name">{item.name}</p>
                      <p className="thankyou-item-meta">Quantità: {item.quantity}</p>
                    </div>
                    <div className="thankyou-summary-pricing">
                      <span className="thankyou-unit-price">Unitario {formatPrice(item.unitPrice)}</span>
                      <strong>{formatPrice(item.unitPrice * item.quantity)}</strong>
                    </div>
                  </div>
                ))}
              </div>

              <div className="thankyou-totals">
                <div className="thankyou-total-row">
                  <span>Totale articoli</span>
                  <strong>{formatPrice(orderSummary.totals.itemsTotal)}</strong>
                </div>
                <div className="thankyou-total-row">
                  <span>Spedizione</span>
                  <strong>{formatPrice(orderSummary.totals.shipping)}</strong>
                </div>
                {hasWeight && (
                  <div className="thankyou-total-row">
                    <span>Peso totale</span>
                    <strong>{Number(orderSummary.totals.totalWeight).toFixed(2)} kg</strong>
                  </div>
                )}
                <div className="thankyou-total-row thankyou-grand-total">
                  <span>Totale ordine</span>
                  <strong>{formatPrice(orderSummary.totals.grandTotal)}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="surface-card state-card">
              <p>Riepilogo ordine non disponibile. Puoi continuare lo shopping qui sotto.</p>
            </div>
          )}

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
