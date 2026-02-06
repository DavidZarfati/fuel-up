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
                    <h2 className="dz-titolo-prodotto">{product.result[0].name ? product.result[0].name : "No name available."} <span className="dz-brand-badge">{product.result[0].brand}</span></h2>
                    <p className="dz-description-prodotto">
                        {product.result[0].description ? product.result[0].description : "No description available."}
                    </p>
                    <p className="dz-description-prodotto">
                        {product.result[0].size ? `Size: ${product.result[0].size}` : "No description available."}
                    </p>
                    <p className="dz-description-prodotto">
                        {product.result[0].manufacturer_note ? `Additional information : ${product.result[0].manufacturer_note}` : "No description available."}
                    </p>
                    <p className="dz-description-prodotto">
                        {product.result[0].color ? `Color: ${product.result[0].color}` : `Taste: ${product.result[0].flavor}`}
                    </p>

                    <div className="d-flex justify-content-around">
                        {product.result[0].discount_price &&
                            product.result[0].discount_price < product.result[0].price ? (
                            <>
                                <p className="dz-description-prodotto">
                                    Base price: {" "}
                                    <span className="dz-prodotto-senza-sconto">
                                        &euro; {product.result[0].price}
                                    </span>
                                </p>
                                <p className="dz-description-prodotto">
                                    Discounted price: {" "}
                                    <span className="dz-prezzo-scontato">
                                        &euro; {product.result[0].discount_price}
                                    </span>
                                </p>
                            </>
                        ) : (
                            <p className="dz-description-prodotto">
                                Price: {" "}
                                <span className="dz-prezzo-regular">
                                    &euro; {product.result[0].price}
                                </span>
                            </p>
                        )}
                    </div>

                </div>
            ) : (
                <div>Product data not available.</div>
            )}
        </>
    );
}
