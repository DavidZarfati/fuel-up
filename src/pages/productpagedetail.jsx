import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductPageDetail.css"

export default function Productpagedetail() {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${backendBaseUrl}/api/products/${slug}`)
            .then((resp) => {
                setProduct(resp.data);
                setLoading(false);
            })
            .catch((err) => {
                setError("Prodotto non trovato");
                setLoading(false);
            });
    }, [slug]);



    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>{error}</div>
            ) : product && product.result && product.result[0] ? (
                <div className="d-flex flex-column">
                    <img
                        src={`${backendBaseUrl}${product.result[0].image}`}
                        alt={slug}
                        style={{ maxWidth: '20%', height: '30%', display: 'block', margin: '40px auto' }}
                    />
                    <h2 className="dz-titolo-prodotto">{slug.replaceAll ? slug.replaceAll('-', ' ') : slug.split('-').join(' ')}</h2>
                    <p className="dz-description-prodotto">
                        {product.result[0].description ? product.result[0].description : "Nessuna descrizione disponibile."}
                    </p>
                    <p className="dz-description-prodotto">
                        {product.result[0].size ? `Dimensione : ${product.result[0].size}` : "Nessuna descrizione disponibile."}
                    </p>
                    <p className="dz-description-prodotto">
                        {product.result[0].manufacturer_note ? `Informazioni Aggiuntive : ${product.result[0].manufacturer_note}` : "Nessuna descrizione disponibile."}
                    </p>
                    <p className="dz-description-prodotto">
                        {product.result[0].color ? `colore : ${product.result[0].color}` : ""}
                    </p>
                </div>
            ) : (
                <div>Product data not available.</div>
            )}
        </>
    );
}
