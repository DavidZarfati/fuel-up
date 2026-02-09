import axios from "axios";
import { useEffect, useState } from "react";
import { useFavourites } from "../context/FavouritesContext";
import { useGlobal } from "../context/GlobalContext";
import SingleProductCard from "../components/SingleProductCard";
import SingleProductList from "../components/SingleProductList";
import "./ProductsPage.css";


export default function ProductsPage() {
  const { backendUrl } = useGlobal();
  const { isFavourite, toggleFavourite } = useFavourites();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isGridMode, setisGridMode] = useState("");
  const limit = 12;
  // Toast preferiti
  const [favToast, setFavToast] = useState(null);
  const [showFavToast, setShowFavToast] = useState(false);

  useEffect(() => {
    if (favToast && showFavToast) {
      const timer = setTimeout(() => setShowFavToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [favToast, showFavToast]);

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
        <h1>Prodotti professionali per risultati reali</h1>
      </div>

      {loading && <div className="ot-loading-container"><p>Caricamento...</p></div>}
      {error && <div className="ot-error-message"><p>{error}</p></div>}

      {/* ...existing code... */}

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
                  {/* HEART ICON */}
                  <button
                    onClick={() => toggleFavourite(p)}
                    className="ot-heart-button"
                    aria-label={isFavourite(p.id) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
                  >
                    <i
                      className={isFavourite(p.id) ? "bi bi-heart-fill" : "bi bi-heart"}
                      style={{ color: isFavourite(p.id) ? "#dc3545" : "#666", fontSize: "18px" }}
                    ></i>
                  </button>
                  <SingleProductList product={p} />
                </div>
              ))}
            </div>
          ) : (
            /* LISTA */
            <div className="ot-products-grid">
              {products.map((p, index) => (
                <div className="ot-product-card-wrapper" key={p.id ?? p._id ?? index}>
                  {/* HEART ICON */}
                  <button
                    onClick={() => {
                      toggleFavourite(p);
                      if (!isFavourite(p.id)) {
                        setFavToast({
                          name: p.name,
                          time: 'adesso',
                          image: `${backendUrl}${p.image}`
                        });
                        setShowFavToast(true);
                      }
                    }}
                    className="ot-heart-button"
                    aria-label={isFavourite(p.id) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
                    style={{ position: "absolute", top: "10px", right: "10px", background: "white", border: "none", borderRadius: "50%", width: "35px", height: "35px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 1 }}
                  >
                    <i
                      className={isFavourite(p.id) ? "bi bi-heart-fill" : "bi bi-heart"}
                      style={{ color: isFavourite(p.id) ? "#dc3545" : "#666", fontSize: "18px" }}
                    ></i>
                  </button>
                  <SingleProductCard product={p} />
                </div>
              ))}
            </div>
          )}

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
                    <a href="/products/favourites" className="btn btn-danger btn-sm" style={{ fontWeight: 'bold', fontSize: 16 }} onClick={() => setShowFavToast(false)}>
                      Vedi nella pagina dei preferiti
                    </a>
                  </div>
                </div>
              </div>
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
      )
      }
    </section >
  )
};