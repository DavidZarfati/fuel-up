import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useFavourites } from "../context/FavouritesContext";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import RelatedProductsCarousel from "../components/CaroselProducts";
import "./ProductDetailPage.css";


export default function ProductDetailPage() {
  const { slug } = useParams();
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isFavourite, toggleFavourite } = useFavourites();
  const { addToCart } = useCart();

  // Toast preferiti
  const [favToast, setFavToast] = useState(null);
  const [showFavToast, setShowFavToast] = useState(false);

  //Toast cart
  const [cartToast, setCartToast] = useState(null);
  const [showCartToast, setShowCartToast] = useState(false);

  // Carico prodotto
  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    axios
      .get(`${backendBaseUrl}/api/products/${slug}`)
      .then((resp) => {
        if (cancelled) return;
        setProduct(resp.data);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Prodotto non trovato");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, backendBaseUrl]);

  // Timer toast
  useEffect(() => {
    if (!favToast || !showFavToast) return;
    const timer = setTimeout(() => setShowFavToast(false), 4000);
    return () => clearTimeout(timer);
  }, [favToast, showFavToast]);

  // Prendo il prodotto vero dalla risposta
  const p = useMemo(() => {
    return product?.result?.[0] ?? null;
  }, [product]);

  function handleAddToCart() {
    if (!p) return;
    addToCart(p);

    setCartToast({
      name: p.name,
      time: "adesso",
      image: `${backendBaseUrl}${p.image}`,
    });
    setShowCartToast(true);
  }

  function handleToggleFav() {
    if (!p) return;

    const alreadyFav = isFavourite(p.id);
    toggleFavourite(p);

    // Mostra toast solo quando aggiungi (non quando rimuovi)
    if (!alreadyFav) {
      setFavToast({
        name: p.name,
        time: "adesso",
        image: `${backendBaseUrl}${p.image}`,
      });
      setShowFavToast(true);
    }
  }

  return (
    <>
      {loading && <div>Loading...</div>}

      {!loading && error && <div>{error}</div>}

      {!loading && !error && p && (
        <>
          <div className="d-flex flex-column">
            <div className="ml-image-wrap align-self-center">
              <img
                src={`${backendBaseUrl}${p.image}`}
                alt={p.name}
                style={{
                  width: "300px",
                  height: "auto",
                  display: "block",
                  margin: "0 0 15px 0",
                  //border: "1px solid black"
                }}
              //className=".ml-main-image"
              />
              <button
                onClick={handleToggleFav}
                className="ot-heart-button"
                aria-label={
                  isFavourite(p.id)
                    ? "Rimuovi dai preferiti"
                    : "Aggiungi ai preferiti"
                }
                style={{
                  marginLeft: 16,
                  position: "absolute",
                  top: "24px",
                  right: "-12px",
                  background: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "35px",
                  height: "35px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 10,
                }}
              >
                <i
                  className={isFavourite(p.id) ? "bi bi-heart-fill" : "bi bi-heart"}
                  style={{
                    color: isFavourite(p.id) ? "#dc3545" : "#666",
                    fontSize: "18px",
                  }}
                />
              </button>
            </div>




            {/* <h2 className="dz-titolo-prodotto">
              {p.name || "No name available."}{" "}
              <span className="dz-brand-badge">{p.brand}</span>

              {HEART ICON}
              <button
                onClick={handleToggleFav}
                className="ot-heart-button"
                aria-label={
                  isFavourite(p.id)
                    ? "Rimuovi dai preferiti"
                    : "Aggiungi ai preferiti"
                }
                style={{
                  marginLeft: 16,
                  background: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "35px",
                  height: "35px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 1,
                }}
              >
                <i
                  className={isFavourite(p.id) ? "bi bi-heart-fill" : "bi bi-heart"}
                  style={{
                    color: isFavourite(p.id) ? "#dc3545" : "#666",
                    fontSize: "18px",
                  }}
                />
              </button>
            </h2> */}

            <h2 className="dz-titolo-prodotto">
              {p.name || "No name available."}{" "}
              <span className="dz-brand-badge">{p.brand}</span>


            </h2>

            <p className="dz-description-prodotto">
              {p.description || "No description available."}
            </p>

            <p className="dz-description-prodotto">
              {p.size ? `Size: ${p.size}` : ""}
            </p>

            {p.manufacturer_note && (
              <p className="dz-description-prodotto">
                Additional information: {p.manufacturer_note}
              </p>
            )}

            <p className="dz-description-prodotto">
              {p.color
                ? `Color: ${p.color}`
                : p.flavor
                  ? `Taste: ${p.flavor}`
                  : ""}
            </p>

            <div className="d-flex justify-content-around">
              {p.discount_price && p.discount_price < p.price ? (
                <>
                  <p className="dz-description-prodotto">
                    Prezzo Base:{" "}
                    <span className="dz-prodotto-senza-sconto">€{p.price}</span>
                  </p>
                  <p className="dz-description-prodotto">
                    Prezzo Scontato:{" "}
                    <span className="dz-prezzo-scontato">€{p.discount_price}</span>
                  </p>
                </>
              ) : (
                <p className="dz-description-prodotto">
                  Prezzo: <span className="dz-prezzo-regular">€{p.price}</span>
                </p>
              )}
            </div>

            {/* bottone aggiungi al carrello */}
            <div className="d-flex justify-content-center" style={{ marginTop: 20 }}>
              <button className="btn btn-primary" onClick={handleAddToCart}>
                Aggiungi al carrello
              </button>
            </div>

            {/* Toast notification preferiti */}
            {favToast && showFavToast && (
              <div
                className="toast-container position-fixed"
                style={{ bottom: 90, right: 30, zIndex: 9999 }}
              >
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
                      src={favToast?.image}
                      className="rounded me-2"
                      alt={favToast?.name}
                      style={{
                        width: 32,
                        height: 32,
                        objectFit: "cover",
                        marginRight: 8,
                      }}
                    />
                    <strong className="me-auto">Preferiti</strong>
                    <small className="text-body-secondary">{favToast?.time}</small>
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
                    Hai aggiunto <b>{favToast?.name}</b> ai preferiti
                    {favToast && (
                      <div style={{ marginTop: 12 }}>
                        <Link
                          to="/products/favourites"
                          className="btn btn-danger btn-sm"
                          style={{ fontWeight: 'bold', fontSize: 16 }}
                          onClick={() => setShowFavToast(false)}
                        >
                          Vedi nella pagina dei preferiti
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Toast notification preferiti */}
            {cartToast && showCartToast && (
              <div
                className="toast-container position-fixed"
                style={{ bottom: 30, right: 30, zIndex: 9999 }}
              >
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
                      src={cartToast?.image}
                      className="rounded me-2"
                      alt={cartToast?.name}
                      style={{
                        width: 32,
                        height: 32,
                        objectFit: "cover",
                        marginRight: 8,
                      }}
                    />
                    <strong className="me-auto">Preferiti</strong>
                    <small className="text-body-secondary">{cartToast?.time}</small>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={() => setShowCartToast(false)}
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
                    Hai aggiunto <b>{cartToast?.name}</b> ai preferiti
                    {cartToast && (
                      <div style={{ marginTop: 12 }}>
                        <Link
                          to="/shopping-cart"
                          className="btn btn-danger btn-sm"
                          style={{ fontWeight: 'bold', fontSize: 16 }}
                          onClick={() => setShowCartToast(false)}
                        >
                          Vedi nella pagina dei preferiti
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <RelatedProductsCarousel slug={slug} />
        </>
      )
      }

      {!loading && !error && !p && <div>Product data not available.</div>}
    </>
  );
}
