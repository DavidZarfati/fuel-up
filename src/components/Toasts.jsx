import { Link } from "react-router-dom";

export default function Toasts({
  toast,
  showToast,
  setShowToast,
  favToast,
  showFavToast,
  setShowFavToast,
}) {
  return (
    <>
      {/* CONTENITORE UNICO: basso a destra */}
      <div
        className="toast-container position-fixed"
        style={{
          bottom: 0,
          
          left: 10,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 16, // distanza verticale tra i toast
          alignItems: "flex-end",
        }}
      >
        {/* TOAST PREFERITI */}
        {favToast && showFavToast && (
          <div
            className="toast show"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            style={{
              minWidth: 320,
              background: "#fff",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            <div
              className="toast-header"
              style={{
                background: "#f5f5f5",
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}
            >
              <img
                src={favToast.image}
                className="rounded me-2"
                alt={favToast.name}
                style={{
                  width: 32,
                  height: 32,
                  objectFit: "cover",
                  marginRight: 8,
                }}
              />
              <strong className="me-auto">Preferiti</strong>
              <small className="text-body-secondary">{favToast.time}</small>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setShowFavToast(false)}
                style={{
                  marginLeft: 8,
                  border: "none",
                  background: "transparent",
                  fontSize: 18,
                }}
              >
                ×
              </button>
            </div>

            <div className="toast-body" style={{ padding: "12px 24px", fontSize: 18 }}>
              {favToast.message ? (
                <>
                  {favToast.message} <b>{favToast.name}</b>
                </>
              ) : (
                <>
                  Hai aggiunto <b>{favToast.name}</b> ai preferiti
                </>
              )}

              <div style={{ marginTop: 12 }}>
                <Link
                  to="/products/favourites"
                  className="btn btn-danger btn-sm"
                  style={{ fontWeight: "bold", fontSize: 16 }}
                  onClick={() => setShowFavToast(false)}
                >
                  Vedi nella pagina dei preferiti
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TOAST CARRELLO */}
        {toast && showToast && (
          <div
            className="toast show"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            style={{
              minWidth: 320,
              background: "#fff",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            <div
              className="toast-header"
              style={{
                background: "#f5f5f5",
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}
            >
              <img
                src={toast.image}
                className="rounded me-2"
                alt={toast.name}
                style={{
                  width: 32,
                  height: 32,
                  objectFit: "cover",
                  marginRight: 8,
                }}
              />
              <strong className="me-auto">Carrello</strong>
              <small className="text-body-secondary">{toast.time}</small>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setShowToast(false)}
                style={{
                  marginLeft: 8,
                  border: "none",
                  background: "transparent",
                  fontSize: 18,
                }}
              >
                ×
              </button>
            </div>

            <div className="toast-body" style={{ padding: "12px 24px", fontSize: 18 }}>
              {toast.message ? (
                <>
                  {toast.message} <b>{toast.name}</b>
                </>
              ) : (
                <>
                  Hai aggiunto <b>{toast.name}</b> al carrello
                </>
              )}

              <div style={{ marginTop: 12 }}>
                <Link
                  to="/shopping-cart"
                  className="btn btn-success btn-sm"
                  style={{ fontWeight: "bold", fontSize: 16 }}
                  onClick={() => setShowToast(false)}
                >
                  Vedi nel carrello
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
