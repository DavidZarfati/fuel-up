import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import EmptyState from "../components/EmptyState";
import "./CartPage.css";

function formatPrice(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "EUR 0.00";
  return `EUR ${amount.toFixed(2)}`;
}

export default function CartPage() {
  const FREE_SHIPPING_TARGET = 100;
  const [bannerVisible, setBannerVisible] = useState(true);
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart, totalItems, totalPrice, expeditionCost } = useCart();
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;
  const freeShippingActive = totalPrice >= FREE_SHIPPING_TARGET;
  const missingAmount = Math.max(0, FREE_SHIPPING_TARGET - totalPrice);
  const progressPercentage = Math.min((totalPrice / FREE_SHIPPING_TARGET) * 100, 100);

  // Banner disappears after 5 seconds or when reaching 100EUR
  useEffect(() => {
    setBannerVisible(true);
    const timer = setTimeout(() => {
      setBannerVisible(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [freeShippingActive, totalPrice]);

  return (
    <section className="page-section">
      <div className="app-container">
        <div className="surface-card cart-header">
          <div className="cart-header-left">
            <div className="cart-icon-neon">
              <i className="bi bi-cart3"></i>
            </div>
            <div>
              <h1 className="title-lg">Carrello</h1>
              <p className="text-muted">{totalItems} articoli selezionati</p>
            </div>
          </div>
          {cart.length > 0 && (
            <button type="button" className="btn-ui btn-ui-danger cart-clear-cta neon-btn" onClick={clearCart}>
              <i className="bi bi-trash"></i>
              Svuota carrello
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <EmptyState
            icon="bi bi-bag"
            title="Il carrello e vuoto"
            description="Aggiungi prodotti premium per iniziare il checkout."
            ctaLabel="Vai ai prodotti"
            ctaTo="/products"
          />
        ) : (
          <>
            {/* Premium Shipping Banner - Fades out after 5 seconds */}
            {bannerVisible && (
              <div className="shipping-banner-premium">
                <div className="shipping-banner-premium-content">
                  <div className="shipping-banner-premium-text">
                    <h3 className="shipping-banner-premium-title">
                      {freeShippingActive
                        ? "🎉 Spedizione Gratuita Sbloccata!"
                        : "Spedizione Gratuita a EUR 100"}
                    </h3>
                    <p className="shipping-banner-premium-subtitle">
                      {freeShippingActive
                        ? "Congratulazioni! Il tuo ordine avrà la spedizione gratuita."
                        : `Aggiungi ancora EUR ${missingAmount.toFixed(2)} per sbloccare la spedizione gratuita`}
                    </p>
                  </div>
                  <div className="shipping-banner-premium-progress">
                    <div className="progress-container">
                      <div className="progress-bar-bg">
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${progressPercentage}%`,
                          }}
                        ></div>
                      </div>
                      <span className="progress-text">{Math.round(progressPercentage)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="cart-layout">
              <div className="surface-card cart-items-list">
                {cart.map((item) => (
                  <article key={item.id} className="cart-item">
                    <div className="cart-item-main">
                      <img src={`${backendBaseUrl}${item.image}`} alt={item.name} />
                      <div>
                        <h3>{item.name}</h3>
                        <div className="price-row">
                          {Number(item.discount_price) > 0 && Number(item.discount_price) < Number(item.price) ? (
                            <>
                              <span className="price-old">{formatPrice(item.price)}</span>
                              <span className="price-discount">{formatPrice(item.discount_price)}</span>
                            </>
                          ) : (
                            <span className="price-now">{formatPrice(item.price)}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="cart-item-actions">
                      <div className="cart-stepper">
                        <button type="button" onClick={() => decreaseQuantity(item.id)} disabled={item.quantity <= 1}>
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => increaseQuantity(item.id)}>
                          +
                        </button>
                      </div>
                      <button type="button" className="btn-ui btn-ui-danger" onClick={() => removeFromCart(item.id)}>
                        Rimuovi
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="surface-card cart-summary">
                <h2>Riepilogo ordine</h2>
                <div>
                  <span>Subtotale</span>
                  <strong>{formatPrice(totalPrice)}</strong>
                </div>
                <div>
                  <span>Spedizione</span>
                  <strong>{formatPrice(expeditionCost)}</strong>
                </div>
                <div className="cart-summary-total">
                  <span>Totale</span>
                  <strong>{formatPrice(totalPrice + expeditionCost)}</strong>
                </div>

                <Link to="/checkout" className="btn-ui btn-ui-primary cart-checkout-btn neon-btn">
                  Procedi al checkout
                </Link>

                <small className="text-muted">Spedizione gratuita per ordini da EUR {FREE_SHIPPING_TARGET} in su.</small>
              </aside>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
