import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetailPage.css";
import { useCart } from "../context/CartContext";
import RelatedProductsCarousel from "../components/CaroselProducts";

export default function ProductDetailPage() {
  const { slug } = useParams();

  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    setError(null);

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

  const p = product?.result?.[0];

  function handleAddToCart() {
    if (!p) return;
    addToCart(p);
  }

  return (
    <>
      {loading && <div>Loading...</div>}

      {!loading && error && <div>{error}</div>}

      {!loading && !error && p && (
        <>
          <div className="d-flex flex-column">
            <img
              src={`${backendBaseUrl}${p.image}`}
              alt={p.name}
              style={{
                maxWidth: "20%",
                height: "30%",
                display: "block",
                margin: "40px auto",
              }}
            />

            <h2 className="dz-titolo-prodotto">
              {p.name || "No name available"}{" "}
              <span className="dz-brand-badge">{p.brand}</span>
            </h2>

            <p className="dz-description-prodotto">
              {p.description || "No description available."}
            </p>

            {p.size && (
              <p className="dz-description-prodotto">
                Size: {p.size}
              </p>
            )}

            {p.manufacturer_note && (
              <p className="dz-description-prodotto">
                Additional information: {p.manufacturer_note}
              </p>
            )}

            <p className="dz-description-prodotto">
              {p.color ? `Color: ${p.color}` : p.flavor ? `Taste: ${p.flavor}` : ""}
            </p>

            <div className="d-flex justify-content-around">
              {p.discount_price && p.discount_price < p.price ? (
                <>
                  <p className="dz-description-prodotto">
                    Prezzo Base:{" "}
                    <span className="dz-prodotto-senza-sconto">
                      €{p.price}
                    </span>
                  </p>
                  <p className="dz-description-prodotto">
                    Prezzo Scontato:{" "}
                    <span className="dz-prezzo-scontato">
                      €{p.discount_price}
                    </span>
                  </p>
                </>
              ) : (
                <p className="dz-description-prodotto">
                  Prezzo:{" "}
                  <span className="dz-prezzo-regular">
                    €{p.price}
                  </span>
                </p>
              )}
            </div>

            <div className="d-flex justify-content-center mt-3">
              <button className="btn btn-primary" onClick={handleAddToCart}>
                Aggiungi al carrello
              </button>
            </div>
          </div>


          <RelatedProductsCarousel slug={slug} />
        </>
      )}

      {!loading && !error && !p && (
        <div>Product data not available.</div>
      )}
    </>
  );
}
