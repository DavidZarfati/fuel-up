import axios from "axios";
import { useEffect, useState } from "react";
import { useFavourites } from "../context/FavouritesContext";
import { useParams } from "react-router-dom";
import "./ProductDetailPage.css"
import { useCart } from "../context/CartContext";

export default function ProductDetailPage() {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isFavourite, toggleFavourite } = useFavourites();
    // Toast preferiti
    const [favToast, setFavToast] = useState(null);
    const [showFavToast, setShowFavToast] = useState(false);
    // ✅ prendi addToCart dal context
    const { addToCart } = useCart();

    useEffect(() => {
        if (favToast && showFavToast) {
            const timer = setTimeout(() => setShowFavToast(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [favToast, showFavToast]);

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${backendBaseUrl}/api/products/${slug}`)
            .then((resp) => {
                setProduct(resp.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Prodotto non trovato");
                setLoading(false);
            });
    }, [slug, backendBaseUrl]);

    // ✅ comodo: estrai il prodotto vero e proprio
    const p = product?.result?.[0];

    // ✅ funzione che costruisce l’oggetto da mettere nel carrello
    function handleAddToCart() {
        if (!p) return;

        addToCart(p);
    }

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>{error}</div>
            ) : p ? (
                <div className="d-flex flex-column">
                    <img
                        src={`${backendBaseUrl}${p.image}`}
                        alt={slug}
                        style={{ maxWidth: "20%", height: "30%", display: "block", margin: "40px auto" }}
                    />

                    <h2 className="dz-titolo-prodotto">
                        {product.result[0].name ? product.result[0].name : "No name available."}{" "}
                        <span className="dz-brand-badge">{p.brand}</span>
                        {/* HEART ICON */}
                        <button
                            onClick={() => {
                                toggleFavourite(p);
                                if (!isFavourite(p.id)) {
                                    setFavToast({
                                        name: p.name,
                                        time: 'adesso',
                                        image: `${backendBaseUrl}${p.image}`
                                    });
                                    setShowFavToast(true);
                                }
                            }}
                            className="ot-heart-button"
                            aria-label={isFavourite(p.id) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
                            style={{ marginLeft: 16, background: "white", border: "none", borderRadius: "50%", width: "35px", height: "35px", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 1 }}
                        >
                            <i
                                className={isFavourite(p.id) ? "bi bi-heart-fill" : "bi bi-heart"}
                                style={{ color: isFavourite(p.id) ? "#dc3545" : "#666", fontSize: "18px" }}
                            ></i>
                        </button>
                    </h2>

                    <p className="dz-description-prodotto">
                        {p.description ? p.description : "No description available."}
                    </p>

                    <p className="dz-description-prodotto">
                        {p.size ? `Size: ${p.size}` : "No description available."}
                    </p>

                    <p className="dz-description-prodotto">
                        {p.manufacturer_note ? `Additional information: ${p.manufacturer_note}` : "No description available."}
                    </p>

                    <p className="dz-description-prodotto">
                        {p.color ? `Color: ${p.color}` : `Taste: ${p.flavor}`}
                    </p>

                    <div className="d-flex justify-content-around">
                        {product.result[0].discount_price &&
                            product.result[0].discount_price < product.result[0].price ? (
                            <>
                                <p className="dz-description-prodotto">
                                    Prezzo Base :{" "}
                                    <span className="dz-prodotto-senza-sconto">
                                        &euro;
                                        {product.result[0].price}
                                    </span>
                                </p>
                                <p className="dz-description-prodotto">
                                    Prezzo Scontato :{" "}
                                    <span className="dz-prezzo-scontato">
                                        &euro;
                                        {product.result[0].discount_price}
                                    </span>
                                </p>
                            </>
                        ) : (
                            <p className="dz-description-prodotto">
                                Prezzo :{" "}
                                <span className="dz-prezzo-regular">
                                    &euro;
                                    {product.result[0].price}
                                </span>
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
                        <div className="toast-container position-fixed" style={{ bottom: 90, right: 30, zIndex: 9999 }}>
                            <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true" style={{ minWidth: 320, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                                <div className="toast-header" style={{ background: '#f5f5f5', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                                    <img src={favToast.image} className="rounded me-2" alt={favToast.name} style={{ width: 32, height: 32, objectFit: 'cover', marginRight: 8 }} />
                                    <strong className="me-auto">Preferiti</strong>
                                    <small className="text-body-secondary">{favToast.time}</small>
                                    <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowFavToast(false)} style={{ marginLeft: 8, border: 'none', background: 'transparent', fontSize: 18 }}>×</button>
                                </div>
                                <div className="toast-body" style={{ padding: '12px 24px', fontSize: 18 }}>
                                    Hai aggiunto <b>{favToast.name}</b> ai preferiti
                                    <div style={{ marginTop: 12 }}>
                                        {/* Puoi aggiungere un link ai preferiti se vuoi */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div>Product data not available.</div>
            )}
        </>
    );
}
