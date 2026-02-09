import axios from "axios";
import { useEffect, useState } from "react";
import { useGlobal } from "../context/GlobalContext";
import SingleProductCard from "../components/SingleProductCard";
import SingleProductList from "../components/SingleProductList";
import "./ProductsPage.css";


export default function ProductsPage() {
  const { backendUrl } = useGlobal();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isGridMode, setisGridMode] = useState("");
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
        //console.log('Risposta backend prodotti:', data); // DEBUG
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
    <section className="ot-products-page-container">
      <div className="ot-products-page-header">
        <h1>I Nostri Prodotti</h1>
      </div>

      {loading && <div className="ot-loading-container"><p>Caricamento...</p></div>}
      {error && <div className="ot-error-message"><p>{error}</p></div>}

      {!loading && !error && (

        <>
          <div className="ot-products-filters">
            <div className="ot-filter-group">
              <label>Visualizza:</label>
              <div className="ot-view-buttons">
                <button onClick={() => setisGridMode("")} className={`ot-view-btn ${!isGridMode ? "active" : ""}`}>
                  <i className="bi bi-grid-3x3-gap"></i> Griglia
                </button>
                <button onClick={() => setisGridMode(1)} className={`ot-view-btn ${isGridMode ? "active" : ""}`}>
                  <i className="bi bi-list-ul"></i> Lista
                </button>
              </div>
            </div>
          </div>
          <div className={!isGridMode? "ot-products-grid": "ot-products-list"}>
            {products.map((p, index) => (
              <div className={!isGridMode ? "ot-product-card-wrapper" : "ot-product-list-wrapper"} key={p.id ?? p._id ?? index}>
                {!isGridMode? <SingleProductCard product={p} />: <SingleProductList product={p}/>}
              </div>
            ))}
          </div>
          {/* Bottoni paginazione sotto la griglia */}
          <div className="ot-pagination-container">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="ot-pagination-btn"
            >
              ← Indietro
            </button>
            <div className="ot-pagination-info">
              <span>Pagina <strong>{page}</strong> di <strong>{totalPages}</strong></span>
            </div>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="ot-pagination-btn"
            >
              Avanti →
            </button>
          </div>
        </>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="ot-no-products-message"><p>Nessun prodotto disponibile.</p></div>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <div className="ot-products-filters">
            <div className="ot-filter-group">
              <label>Visualizza:</label>
              <div className="ot-view-buttons">
                <button
                  type="button"
                  onClick={() => setisGridMode(false)}
                  className={`ot-view-btn ${!isGridMode ? "active" : ""}`}
                >
                  <i className="bi bi-grid-3x3-gap"></i> Griglia
                </button>

                <button
                  type="button"
                  onClick={() => setisGridMode(true)}
                  className={`ot-view-btn ${isGridMode ? "active" : ""}`}
                >
                  <i className="bi bi-list-ul"></i> Lista
                </button>
              </div>
            </div>
          </div>

          {/* GRIGLIA */}
          {isGridMode ? (
            <div className="ot-products-list">
              {products.map((p, index) => (
                <div className="ot-product-list-wrapper" key={p.id ?? p._id ?? index}>
                  <SingleProductList product={p} />
                </div>
              ))}
            </div>
          ) : (
            /* LISTA */
            <div className="ot-products-grid">
              {products.map((p, index) => (
                <div className="ot-product-card-wrapper" key={p.id ?? p._id ?? index}>
                  <SingleProductCard product={p} />
                </div>
              ))}
            </div>
          )}

          {/* PAGINAZIONE */}
          {totalPages > 1 && (
            <div className="ot-pagination-container">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="ot-pagination-btn"
              >
                ← Indietro
              </button>

              <div className="ot-pagination-info">
                <span>
                  Pagina <strong>{page}</strong> di{" "}
                  <strong>{totalPages}</strong>
                </span>
              </div>

              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="ot-pagination-btn"
              >
                Avanti →
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )};