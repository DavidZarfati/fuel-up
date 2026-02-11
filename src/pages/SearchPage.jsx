import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";
import "./SearchPage.css";

export default function SearchPage() {
  const { backendUrl } = useGlobal();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const searchTerm = searchParams.get("q") || "";
  const orderBy = searchParams.get("order_by") || "created_at";
  const orderDir = searchParams.get("order_dir") || "desc";
  const initialPage = parseInt(searchParams.get("page") || "1", 10) || 1;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [localOrderBy, setLocalOrderBy] = useState(orderBy);
  const [localOrderDir, setLocalOrderDir] = useState(orderDir);
  const limit = 12;

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
            limit,
            page,
          },
        });

        if (!ignore) {
          const data = resp.data;
          const list = Array.isArray(data?.risultati)
            ? data.risultati.map((product) => ({
                ...product,
                id: product.id ?? product.product_id ?? product.slug,
              }))
            : [];

          setProducts(list);
          setTotalPages(data?.paginazione?.totale_pagine || 0);

          if (list.length === 0 && page === 1) {
            setError(`Nessun prodotto trovato per "${searchTerm}".`);
          }
        }
      } catch {
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

  useEffect(() => {
    setPage(initialPage);
  }, [initialPage]);

  useEffect(() => {
    setLocalOrderBy(orderBy);
  }, [orderBy]);

  useEffect(() => {
    setLocalOrderDir(orderDir);
  }, [orderDir]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("q", searchTerm);
    if (localOrderBy !== "created_at") params.set("order_by", localOrderBy);
    if (localOrderDir !== "desc") params.set("order_dir", localOrderDir);
    if (page !== 1) params.set("page", String(page));
    navigate(`/search?${params.toString()}`, { replace: true });
  }, [searchTerm, page, localOrderBy, localOrderDir, navigate]);

  function handlePageChange(nextPage) {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section className="page-section">
      <div className="app-container">
        <div className="surface-card search-header">
          <h1 className="title-lg">Risultati ricerca</h1>
          {searchTerm && <p className="text-muted">Ricerca attiva: "{searchTerm}"</p>}
        </div>

        {products.length > 0 && (
          <div className="surface-card toolbar">
            <div className="toolbar-group">
              <span className="toolbar-label">Ordina per</span>
              <select
                className="select-ui"
                value={localOrderBy}
                onChange={(event) => {
                  setLocalOrderBy(event.target.value);
                  setPage(1);
                }}
              >
                <option value="created_at">Nuovi arrivi / Novità</option>
                <option value="name">Nome (A-Z)</option>
                <option value="price">Prezzo</option>
                <option value="brand">Brand</option>
              </select>
            </div>

            <div className="toolbar-group">
              <span className="toolbar-label">Direzione</span>
              <select
                className="select-ui"
                value={localOrderDir}
                onChange={(event) => {
                  setLocalOrderDir(event.target.value);
                  setPage(1);
                }}
              >
                <option value="desc">Decrescente</option>
                <option value="asc">Crescente</option>
              </select>
            </div>
          </div>
        )}

        {loading && (
          <div className="surface-card state-card">
            <p>Caricamento risultati...</p>
          </div>
        )}

        {!loading && error && (
          <EmptyState
            icon="bi bi-search"
            title="Nessun risultato"
            description={error}
            ctaLabel="Visualizza prodotti consigliati"
            ctaTo="/search?q=protein"
          />
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <div className="products-grid">
              {products.map((product, index) => (
                <ProductCard key={product.id ?? index} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="surface-card pagination">
                <button
                  type="button"
                  className="btn-ui btn-ui-outline"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  Indietro
                </button>

                <span>
                  Pagina <strong>{page}</strong> di <strong>{totalPages}</strong>
                </span>

                <button
                  type="button"
                  className="btn-ui btn-ui-outline"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  Avanti
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
