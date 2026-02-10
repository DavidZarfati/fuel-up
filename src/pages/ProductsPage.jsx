import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import SingleProductCard from "../components/SingleProductCard";
import SingleProductList from "../components/SingleProductList";
import "./ProductsPage.css";

export default function ProductsPage() {
  const { backendUrl } = useGlobal();

  const [searchParams, setSearchParams] = useSearchParams();

  const urlState = useMemo(() => {
    const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
    const safePage = Number.isFinite(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;

    const view = searchParams.get("view") || "grid";
    const safeView = view === "list" ? "list" : "grid";

    const q = searchParams.get("q") || "";
    const orderBy = searchParams.get("order_by") || "created_at";
    const orderDir =
      (searchParams.get("order_dir") || "desc").toLowerCase() === "asc" ? "asc" : "desc";

    return { safePage, safeView, q, orderBy, orderDir };
  }, [searchParams]);

  const limit = 12;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(urlState.safePage);
  const [totalPages, setTotalPages] = useState(1);

  const [isListMode, setIsListMode] = useState(urlState.safeView === "list");

  const [q, setQ] = useState(urlState.q);
  const [orderBy, setOrderBy] = useState(urlState.orderBy);
  const [orderDir, setOrderDir] = useState(urlState.orderDir);

  // Sync stato da URL
  useEffect(() => {
    if (page !== urlState.safePage) setPage(urlState.safePage);

    const nextIsList = urlState.safeView === "list";
    if (isListMode !== nextIsList) setIsListMode(nextIsList);

    if (q !== urlState.q) setQ(urlState.q);
    if (orderBy !== urlState.orderBy) setOrderBy(urlState.orderBy);
    if (orderDir !== urlState.orderDir) setOrderDir(urlState.orderDir);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlState]);

  function updateUrlParams(patch) {
    const params = new URLSearchParams(searchParams);

    Object.entries(patch).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") params.delete(key);
      else params.set(key, String(value));
    });

    params.set("limit", String(limit));
    setSearchParams(params, { replace: false });
  }

  // Scrivo su URL quando cambia lo stato
  useEffect(() => {
    updateUrlParams({
      page,
      view: isListMode ? "list" : "grid",
      q,
      order_by: orderBy,
      order_dir: orderDir,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, isListMode, q, orderBy, orderDir]);

  // Fetch prodotti
  useEffect(() => {
    let ignore = false;

    async function fetchProducts() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        if (q) params.set("q", q);
        if (orderBy) params.set("order_by", orderBy);
        if (orderDir) params.set("order_dir", orderDir);

        const resp = await axios.get(`${backendUrl}/api/products?${params.toString()}`);
        const data = resp.data;

        const list = Array.isArray(data?.result) ? data.result : [];

        let pagine = 1;
        if (data?.info) {
          if (typeof data.info.totale_pagine === "number") pagine = data.info.totale_pagine;
          else if (typeof data.info.pages === "number") pagine = data.info.pages;
        } else if (typeof data?.totale_pagine === "number") {
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
  }, [backendUrl, page, limit, q, orderBy, orderDir]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  return (
    <section className="ot-products-page-container">
      <div className="ot-products-page-header">
        <h1>Prodotti professionali per risultati reali</h1>
      </div>

      {loading && (
        <div className="ot-loading-container">
          <p>Caricamento...</p>
        </div>
      )}

      {error && (
        <div className="ot-error-message">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="ot-products-filters">
            <div className="ot-filter-group">
              <label>Visualizza:</label>

              <div className="ot-view-buttons">
                <button
                  type="button"
                  onClick={() => {
                    setIsListMode(false);
                    setPage(1);
                  }}
                  className={`ot-view-btn ${!isListMode ? "active" : ""}`}
                >
                  <i className="bi bi-grid-3x3-gap"></i> Griglia
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsListMode(true);
                    setPage(1);
                  }}
                  className={`ot-view-btn ${isListMode ? "active" : ""}`}
                >
                  <i className="bi bi-list-ul"></i> Lista
                </button>
              </div>
            </div>
          </div>

          {/* GRIGLIA */}
          {!isListMode ? (
            <div className="ot-products-grid">
              {products.map((p, index) => (
                <div className="ot-product-card-wrapper" key={p.id ?? p._id ?? index}>
                  {/* niente onToggleFavourite: lo gestisce la card internamente */}
                  <SingleProductCard product={p} />
                </div>
              ))}
            </div>
          ) : (
            /* LISTA */
            <div className="ot-products-list">
              {products.map((p, index) => (
                <div className="ot-product-list-wrapper" key={p.id ?? p._id ?? index}>
                  {/* niente cuore esterno: lo gestisce SingleProductList */}
                  <SingleProductList product={p} />
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
                  Pagina <strong>{page}</strong> di <strong>{totalPages}</strong>
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
  );
}
