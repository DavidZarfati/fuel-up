import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import { useFavourites } from "../context/FavouritesContext";
import SingleProductCard from "../components/SingleProductCard";
import "./SearchPage.css";

export default function SearchPage() {
  const { backendUrl } = useGlobal();
  const { isFavourite, toggleFavourite } = useFavourites();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const searchTerm = searchParams.get("q") || "";
  const orderBy = searchParams.get("order_by") || "created_at";
  const orderDir = searchParams.get("order_dir") || "desc";
  const initialPage = parseInt(searchParams.get("page")) || 1;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(initialPage);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [localOrderBy, setLocalOrderBy] = useState(orderBy);
  const [localOrderDir, setLocalOrderDir] = useState(orderDir);

  // Toast preferiti
  const [favToast, setFavToast] = useState(null);
  const [showFavToast, setShowFavToast] = useState(false);

  const limit = 12;

  useEffect(() => {
    if (!favToast || !showFavToast) return;
    const timer = setTimeout(() => setShowFavToast(false), 4000);
    return () => clearTimeout(timer);
  }, [favToast, showFavToast]);

  useEffect(() => {
    let ignore = false;

    async function fetchSearchResults() {
      if (!searchTerm.trim()) {
        if (!ignore) {
          setProducts([]);
          setLoading(false);
          setError("Inserisci un termine di ricerca.");
        }
        return;
      }

      setLoading(true);
      setError("");

      try {
        const resp = await axios.get(`${backendUrl}/api/products/search`, {
          params: {
            q: searchTerm,
            order_by: localOrderBy,
            order_dir: localOrderDir,
            limit: limit,
            page: page,
          },
        });

        const data = resp.data;
        console.log("Risposta backend ricerca:", data);

        if (!ignore) {
          const list = Array.isArray(data?.risultati)
            ? data.risultati.map((p) => ({
              ...p,
              id: p.id ?? p.product_id ?? p.slug, // ✅ FIX: ensure stable id
            }))
            : [];

          const total = data?.paginazione?.totale_risultati || 0;
          const pages = data?.paginazione?.totale_pagine || 0;

          setProducts(list);
          setTotalProducts(total);
          setTotalPages(pages);

          if (list.length === 0 && page === 1) {
            setError(
              `Nessun prodotto trovato per "${searchTerm}". Prova con un termine diverso.`
            );
          }
        }
      } catch (e) {
        console.error("Errore ricerca:", e);
        if (!ignore) {
          setError("Errore nel caricamento dei risultati di ricerca.");
          setProducts([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchSearchResults();

    return () => {
      ignore = true;
    };
  }, [backendUrl, searchTerm, page, localOrderBy, localOrderDir]);


  // Aggiorna l'URL quando cambiano i parametri
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("q", searchTerm);
    if (localOrderBy !== "created_at") params.set("order_by", localOrderBy);
    if (localOrderDir !== "desc") params.set("order_dir", localOrderDir);
    if (page !== 1) params.set("page", page);

    const queryString = params.toString();
    navigate(`/search?${queryString}`, { replace: true });
  }, [searchTerm, page, localOrderBy, localOrderDir, navigate]);

  const handleOrderByChange = (e) => {
    setLocalOrderBy(e.target.value);
    setPage(1);
  };

  const handleOrderDirChange = (e) => {
    setLocalOrderDir(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNewSearch = (newSearchTerm) => {
    if (newSearchTerm.trim()) {
      setPage(1);
      setLocalOrderBy("created_at");
      setLocalOrderDir("desc");
      navigate(`/search?q=${encodeURIComponent(newSearchTerm)}`);
    }
  };

  function handleToggleFavourite(p) {
    const alreadyFav = isFavourite(p.id);
    toggleFavourite(p);

    if (!alreadyFav) {
      setFavToast({
        name: p.name,
        time: "adesso",
        image: `${backendUrl}${p.image}`,
      });
      setShowFavToast(true);
    }
  }

  return (
    <section className="ot-search-page-container">
      <div className="ot-search-page-header">
        <h1>Risultati di ricerca</h1>
        {searchTerm && (
          <p className="ot-search-term-display">
            Ricerca per: <strong>"{searchTerm}"</strong>
          </p>
        )}

      </div>

      {/* Filtri e ordinamento */}
      {products.length > 0 && (
        <div className="ot-search-filters">
          <div className="ot-filter-group">
            <label htmlFor="order-by">Ordina per:</label>
            <select
              id="order-by"
              value={localOrderBy}
              onChange={handleOrderByChange}
              className="ot-filter-select"
            >
              <option value="created_at">Data creazione</option>
              <option value="name">Nome (A-Z)</option>
              <option value="price">Prezzo</option>
              <option value="brand">Brand</option>
            </select>
          </div>

          <div className="ot-filter-group">
            <label htmlFor="order-dir">Direzione:</label>
            <select
              id="order-dir"
              value={localOrderDir}
              onChange={handleOrderDirChange}
              className="ot-filter-select"
            >
              <option value="desc">Decrescente</option>
              <option value="asc">Crescente</option>
            </select>
          </div>
        </div>
      )}

      {/* Contenuto principale */}
      {loading && (
        <div className="ot-loading-container">
          <p>Caricamento risultati...</p>
        </div>
      )}

      {error && !loading && (
        <div className="ot-error-message">
          <p>⚠️ {error}</p>
          <button
            onClick={() => handleNewSearch("protein")}
            className="ot-btn ot-btn-primary"
          >
            Visualizza prodotti consigliati
          </button>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <div className="ot-products-grid">
            {products.map((product, index) => (
              <div className="ot-product-card-wrapper" key={product.id ?? index}>
                <SingleProductCard product={product} onToggleFavourite={handleToggleFavourite} />
              </div>
            ))}
          </div>

          {/* Paginazione */}
          {totalPages > 1 && (
            <div className="ot-pagination-container">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="ot-pagination-btn"
              >
                ← Indietro
              </button>

              <div className="ot-pagination-info">
                <span>
                  Pagina <strong>{page}</strong> di <strong>{totalPages}</strong>
                </span>
              </div>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="ot-pagination-btn"
              >
                Avanti →
              </button>
            </div>
          )}
        </>
      )}

      {!loading && !error && products.length === 0 && !searchTerm && (
        <div className="ot-no-search-message">
          <p>Usa la barra di ricerca per trovare i tuoi prodotti preferiti.</p>
        </div>
      )}

      {/* Toast notification preferiti */}
      {favToast && showFavToast && (
        <div className="toast-container position-fixed" style={{ bottom: 30, right: 30, zIndex: 9999 }}>
          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true"
            style={{ minWidth: 320, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
            <div className="toast-header" style={{ background: "#f5f5f5", borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
              <img src={favToast.image} className="rounded me-2" alt={favToast.name}
                style={{ width: 32, height: 32, objectFit: "cover", marginRight: 8 }} />
              <strong className="me-auto">Preferiti</strong>
              <small className="text-body-secondary">{favToast.time}</small>
              <button type="button" className="btn-close" aria-label="Close"
                onClick={() => setShowFavToast(false)}
                style={{ marginLeft: 8, border: "none", background: "transparent", fontSize: 18 }}>
                ×
              </button>
            </div>

            <div className="toast-body" style={{ padding: "12px 24px", fontSize: 18 }}>
              Hai aggiunto <b>{favToast.name}</b> ai preferiti
              <div style={{ marginTop: 12 }}>
                <a
                  href="/products/favourites"
                  className="btn btn-danger btn-sm"
                  style={{ fontWeight: "bold", fontSize: 16 }}
                  onClick={() => setShowFavToast(false)}
                >
                  Vedi nella pagina dei preferiti
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}