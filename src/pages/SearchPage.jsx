import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";
import "./SearchPage.css";

const CATEGORY_FILTERS = [
  { label: "Tutte le categorie", value: "" },
  { label: "Integratori", value: "1" },
  { label: "Abbigliamento", value: "2" },
  { label: "Accessori", value: "3" },
  { label: "Cibo & Snacks", value: "4" },
];

function getProductCategory(product) {
  const raw =
    product?.macro_categories_id ??
    product?.category_id ??
    product?.category ??
    product?.categories_id ??
    product?.macro_category_id ??
    product?.macro_category ??
    product?.macro_category?.id ??
    product?.category?.id;

  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function getCategoryName(product) {
  return (
    product?.category_name ||
    product?.category?.name ||
    product?.macro_category?.name ||
    ""
  );
}

function isNewArrival(product) {
  const createdAt = product?.created_at || product?.createdAt;
  if (!createdAt) return false;
  const ts = Date.parse(createdAt);
  if (Number.isNaN(ts)) return false;
  const daysDiff = (Date.now() - ts) / (1000 * 60 * 60 * 24);
  return daysDiff <= 45;
}

function matchesSearchTerm(product, term) {
  if (!term) return true;
  const normalized = term.toLowerCase();
  const haystack = [product?.name, product?.description, getCategoryName(product)];
  return haystack.some((value) => typeof value === "string" && value.toLowerCase().includes(normalized));
}

function getComparableValue(product, field) {
  if (field === "price") {
    const discount = Number(product.discount_price);
    const price = Number(product.price);
    if (Number.isFinite(discount) && Number.isFinite(price) && discount > 0 && discount < price) return discount;
    return Number.isFinite(price) ? price : 0;
  }

  const value = product[field];
  if (typeof value === "string") return value.toLowerCase();
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : value;
}

export default function SearchPage() {
  const { backendUrl } = useGlobal();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const searchTerm = searchParams.get("q") || "";
  const orderBy = searchParams.get("order_by") || "created_at";
  const orderDir = searchParams.get("order_dir") || "desc";
  const categoryParam = searchParams.get("category") || "";
  const newOnlyParam = searchParams.get("new_only") === "1";
  const initialPage = parseInt(searchParams.get("page") || "1", 10) || 1;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [localOrderBy, setLocalOrderBy] = useState(orderBy);
  const [localOrderDir, setLocalOrderDir] = useState(orderDir);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [newArrivalsOnly, setNewArrivalsOnly] = useState(newOnlyParam);
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
            category: selectedCategory || undefined,
            new_only: newArrivalsOnly ? 1 : undefined,
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
  }, [backendUrl, searchTerm, page, localOrderBy, localOrderDir, selectedCategory, newArrivalsOnly]);

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
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    setNewArrivalsOnly(newOnlyParam);
  }, [newOnlyParam]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("q", searchTerm);
    if (localOrderBy !== "created_at") params.set("order_by", localOrderBy);
    if (localOrderDir !== "desc") params.set("order_dir", localOrderDir);
    if (selectedCategory) params.set("category", selectedCategory);
    if (newArrivalsOnly) params.set("new_only", "1");
    if (page !== 1) params.set("page", String(page));
    navigate(`/search?${params.toString()}`, { replace: true });
  }, [searchTerm, page, localOrderBy, localOrderDir, selectedCategory, newArrivalsOnly, navigate]);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim();

    const filtered = products
      .filter((product) => {
        const categoryId = getProductCategory(product);
        const matchesCategory = !selectedCategory || categoryId === Number(selectedCategory);
        const matchesNewArrivals = !newArrivalsOnly || isNewArrival(product);
        const matchesTerm = matchesSearchTerm(product, term);
        return matchesCategory && matchesNewArrivals && matchesTerm;
      })
      .sort((a, b) => {
        const aValue = getComparableValue(a, localOrderBy);
        const bValue = getComparableValue(b, localOrderBy);

        if (aValue < bValue) return localOrderDir === "asc" ? -1 : 1;
        if (aValue > bValue) return localOrderDir === "asc" ? 1 : -1;
        return 0;
      });

    return filtered;
  }, [products, searchTerm, selectedCategory, newArrivalsOnly, localOrderBy, localOrderDir]);

  const hasResults = filteredProducts.length > 0;

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

        {hasResults && (
          <div className="surface-card toolbar">
            <div className="toolbar-group">
              <span className="toolbar-label">Categoria</span>
              <select
                className="select-ui"
                value={selectedCategory}
                onChange={(event) => {
                  setSelectedCategory(event.target.value);
                  setPage(1);
                }}
              >
                {CATEGORY_FILTERS.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

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

            <div className="toolbar-group">
              <span className="toolbar-label">Solo nuovi arrivi</span>
              <label className="products-sale-switch">
                <input
                  type="checkbox"
                  checked={newArrivalsOnly}
                  onChange={(event) => {
                    setNewArrivalsOnly(event.target.checked);
                    setPage(1);
                  }}
                />
                <span>Mostra prodotti recenti</span>
              </label>
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

        {!loading && !error && hasResults && (
          <>
            <div className="products-grid">
              {filteredProducts.map((product, index) => (
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

        {!loading && !error && !hasResults && (
          <EmptyState
            icon="bi bi-search"
            title="Nessun prodotto trovato"
            description={`Nessun prodotto trovato per "${searchTerm}" con i filtri selezionati.`}
            ctaLabel="Reset filtri"
            ctaTo="/search?q="
          />
        )}
      </div>
    </section>
  );
}
