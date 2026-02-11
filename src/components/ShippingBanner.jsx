import { useEffect, useState, useMemo } from "react";
import { useCart } from "../context/CartContext";
import "./ShippingBanner.css";

export default function ShippingBanner() {
  const FREE_SHIPPING_THRESHOLD = 100;
  const { totalPrice } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [hideUnderIcons, setHideUnderIcons] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const remainingAmount = useMemo(
    () => Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice),
    [totalPrice]
  );

  const isFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;
  const shouldShow = remainingAmount > 0 || isFreeShipping;

  // Show/hide animation logic
  useEffect(() => {
    if (!shouldShow) {
      setIsVisible(false);
      return;
    }

    setIsClosing(false);
    setIsVisible(true);

    // Auto-collapse under icons after 5 seconds (only if not free shipping)
    if (!isFreeShipping) {
      const timer = setTimeout(() => {
        setHideUnderIcons(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [shouldShow, isFreeShipping]);

  // Reset collapse on major amount change
  useEffect(() => {
    setHideUnderIcons(false);
    if (isFreeShipping) {
      // force surface the banner when threshold is reached
      setIsVisible(true);
      setIsClosing(false);
    }
  }, [isFreeShipping]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 260);
  };

  if (!shouldShow || !isVisible) return null;

  return (
    <div
      className={`shipping-banner neon-banner ${
        hideUnderIcons ? "under-icons" : "expanded"
      } ${isFreeShipping ? "success" : "warning"} ${isClosing ? "closing" : ""}`}
    >
      <div className="shipping-banner-content">
        {isFreeShipping ? (
          <>
            <div className="shipping-banner-icon">
              <i className="bi bi-truck"></i>
            </div>
            <div className="shipping-banner-text">
              <p className="shipping-banner-title">Spedizione Gratuita! 🎉</p>
              <p className="shipping-banner-subtitle">
                Congratulazioni! Il tuo ordine avrà la spedizione gratuita
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="shipping-banner-icon">
              <i className="bi bi-lightning-fill"></i>
            </div>
            <div className="shipping-banner-text">
              <p className="shipping-banner-title">
                Spedizione Gratuita a €{FREE_SHIPPING_THRESHOLD.toFixed(2)}
              </p>
              <p className="shipping-banner-subtitle">
                Aggiungi altri €{remainingAmount.toFixed(2)} per sbloccare la spedizione gratuita
              </p>
            </div>
            <div className="shipping-banner-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${((totalPrice / FREE_SHIPPING_THRESHOLD) * 100).toFixed(0)}%`,
                  }}
                ></div>
              </div>
              <span className="progress-text">
                {((totalPrice / FREE_SHIPPING_THRESHOLD) * 100).toFixed(0)}%
              </span>
            </div>
          </>
        )}
      </div>
      <button
        type="button"
        className="shipping-banner-close"
        aria-label="Chiudi banner"
        onClick={handleClose}
      >
        <i className="bi bi-x-lg"></i>
      </button>
    </div>
  );
}
