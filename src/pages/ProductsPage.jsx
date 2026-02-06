
import axios from "axios";
import { useEffect, useState } from "react";
import { useGlobal } from "../context/GlobalContext";
import SingleProductCard from "../components/SingleProductCard";


export default function ProductsPage() {
  const { backendUrl } = useGlobal();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  useEffect(() => {
    let ignore = false;

    async function fetchProducts() {
      setLoading(true);
      setError("");
      try {
        const resp = await axios.get(`${backendUrl}/api/products?page=${page}&limit=${limit}`);
        // Adatta qui secondo la risposta del backend
        // Esempio: { products: [...], totalPages: 5 }
        const data = resp.data;
        console.log('Risposta backend prodotti:', data); // DEBUG
        // Adattamento struttura: prodotti in data.result, totale pagine in data.info.totale_pagine
        const list = Array.isArray(data?.result) ? data.result : [];
        let pagine = 1;
        if (data?.info) {
          if (typeof data.info.totale_pagine === "number") pagine = data.info.totale_pagine;
          else if (typeof data.info.pages === "number") pagine = data.info.pages;
        } else if (typeof data.totale_pagine === "number") {
          pagine = data.totale_pagine;
        }
        if (!ignore) {
          setProducts(list);
          setTotalPages(pagine);
        }
      } catch (e) {
        console.log(e);
        if (!ignore) setError("Errore nel caricamento dei prodotti.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      ignore = true;
    };
  }, [backendUrl, page]);

  return (
    <section className="container">
      <h1>Lista Prodotti</h1>

      {loading && <p>Caricamento...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
            {products.map((p, index) => (
              <div className="col" key={p.id ?? p._id ?? index}>
                <SingleProductCard product={p} />
              </div>
            ))}
          </div>
          {/* Bottoni paginazione sotto la griglia */}
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "2rem" }}>
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              style={{
                background: "#d32f2f",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "0.5rem 1.5rem",
                fontWeight: "bold",
                fontSize: "1rem",
                opacity: page === 1 ? 0.5 : 1,
                cursor: page === 1 ? "not-allowed" : "pointer",
                transition: "background 0.2s"
              }}
            >
              Indietro
            </button>
            <span>Pagina {page} di {totalPages}</span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              style={{
                background: "#d32f2f",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "0.5rem 1.5rem",
                fontWeight: "bold",
                fontSize: "1rem",
                opacity: page === totalPages ? 0.5 : 1,
                cursor: page === totalPages ? "not-allowed" : "pointer",
                transition: "background 0.2s"
              }}
            >
              Avanti
            </button>
          </div>
        </>
      )}

      {!loading && !error && products.length === 0 && (
        <p>Nessun prodotto disponibile.</p>
      )}
    </section>
  );
}
