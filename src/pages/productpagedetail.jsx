import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductPageDetail.css";

// ✅ aggiungi questo import
import { useCart } from "../context/CartContext";

export default function Productpagedetail() {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ prendi addToCart dal context
    const { addToCart } = useCart();

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

        addToCart({
            id: p.id, // IMPORTANTISSIMO: deve esserci
            name: slug.replaceAll ? slug.replaceAll("-", " ") : slug.split("-").join(" "),
            brand: p.brand,
            image: p.image,
            // scelgo il prezzo scontato se c’è, altrimenti quello base
            price: Number(p.discount_price ?? p.price ?? 0),
        });
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
                </div>
            ) : (
                <div>Product data not available.</div>
            )}
        </>
    );
}
