import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import CategoryPills from "../components/CategoryPills";
import ViewToggle from "../components/ViewToggle";
import ProductCard from "../components/ProductCard";
import ProductRow from "../components/ProductRow";
import EmptyState from "../components/EmptyState";
import "./ProductsPage.css";

const CATEGORY_FILTERS = [
  { label: "Tutti", value: "" },
  { label: "Integratori", value: 1 },
  { label: "Abbigliamento", value: 2 },
  { label: "Accessori", value: 3 },
  { label: "Cibo & Snacks", value: 4 },
];

function hasDiscount(product) {
  const discount = Number(product.discount_price);
  const price = Number(product.price);
  return Number.isFinite(discount) && Number.isFinite(price) && discount > 0 && discount < price;
}

function getProductCategory(product) {
  return Number(
    product?.macro_categories_id ??
    product?.category_id ??
    product?.category ??
    product?.categories_id ??
    product?.macro_category_id ??
    product?.macro_category
  );
}

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
    const orderDir = (searchParams.get("order_dir") || "desc").toLowerCase() === "asc" ? "asc" : "desc";
    const category = searchParams.get("category") || "";
    const onSaleOnly = searchParams.get("on_sale") === "1";
    return { safePage, safeView, q, orderBy, orderDir, category, onSaleOnly };
  }, [searchParams]);

  const limit = 12;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(urlState.safePage);
  const [totalPages, setTotalPages] = useState(1);
  const [view, setView] = useState(urlState.safeView);
  const [q, setQ] = useState(urlState.q);
  const [orderBy, setOrderBy] = useState(urlState.orderBy);
  const [orderDir, setOrderDir] = useState(urlState.orderDir);
  const [category, setCategory] = useState(urlState.category ? Number(urlState.category) : "");
  const [onSaleOnly, setOnSaleOnly] = useState(urlState.onSaleOnly);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    if (page !== urlState.safePage) setPage(urlState.safePage);
    if (view !== urlState.safeView) setView(urlState.safeView);
    if (q !== urlState.q) setQ(urlState.q);
    if (orderBy !== urlState.orderBy) setOrderBy(urlState.orderBy);
    if (orderDir !== urlState.orderDir) setOrderDir(urlState.orderDir);
    const nextCategory = urlState.category ? Number(urlState.category) : "";
    if (category !== nextCategory) setCategory(nextCategory);
    if (onSaleOnly !== urlState.onSaleOnly) setOnSaleOnly(urlState.onSaleOnly);
  }, [urlState]);

  useEffect(() => {
    // reset pagination when changing category to avoid empty pages
    setPage(1);
  }, [category]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (page > 1) params.set("page", String(page));
    else params.delete("page");
    params.set("view", view);
    if (q) params.set("q", q);
    else params.delete("q");
    params.set("order_by", orderBy);
    params.set("order_dir", orderDir);
    const limitValue = category === "" ? limit : 100; // fetch more items when filtering by category
    params.set("limit", String(limitValue));
    if (category !== "") params.set("category", String(category));
    else params.delete("category");
    if (onSaleOnly) params.set("on_sale", "1");
    else params.delete("on_sale");

    setSearchParams(params, { replace: false });
  }, [page, view, q, orderBy, orderDir, category, onSaleOnly]);

  useEffect(() => {
    let ignore = false;

    async function fetchProducts() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        const limitValue = category === "" ? limit : 100; // ensure all category items are in the page payload
        params.set("limit", String(limitValue));
        if (q) params.set("q", q);
        if (orderBy) params.set("order_by", orderBy);
        if (orderDir) params.set("order_dir", orderDir);
        // NON filtriamo per categoria lato backend (schema non omogeneo); filtriamo lato client
        if (onSaleOnly) params.set("on_sale", "1");

        const resp = await axios.get(`${backendUrl}/api/products?${params.toString()}`);
        const data = resp.data;
        const list = Array.isArray(data?.result) ? data.result : [];
        let pages = 1;
        if (data?.info) {
          if (typeof data.info.totale_pagine === "number") pages = data.info.totale_pagine;
          else if (typeof data.info.pages === "number") pages = data.info.pages;
        } else if (typeof data?.totale_pagine === "number") {
          pages = data.totale_pagine;
        }

        if (!ignore) {
          setProducts(list);
          setTotalPages(pages);
        }
      } catch {
        if (!ignore) setError("Errore nel caricamento dei prodotti.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchProducts();
    return () => {
      ignore = true;
    };
  }, [backendUrl, page, q, orderBy, orderDir, category, onSaleOnly]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const visibleProducts = useMemo(() => {
    // Filtro
    let filtered = products.filter((product) => {
      const productCategory = getProductCategory(product);
      const matchesCategory = category === "" || productCategory === Number(category);
      const matchesSale = !onSaleOnly || hasDiscount(product);
      return matchesCategory && matchesSale;
    });

    // Ordinamento client-side
    if (orderBy) {
      filtered = [...filtered].sort((a, b) => {
        let aValue, bValue;
        if (orderBy === "price") {
          // Se c'è discount_price valido, usa quello, altrimenti price
          aValue = (a.discount_price && Number(a.discount_price) > 0) ? Number(a.discount_price) : Number(a.price);
          bValue = (b.discount_price && Number(b.discount_price) > 0) ? Number(b.discount_price) : Number(b.price);
        } else {
          aValue = a[orderBy];
          bValue = b[orderBy];
          if (orderBy === "discount_price") {
            aValue = Number(aValue);
            bValue = Number(bValue);
          } else if (typeof aValue === "string" && typeof bValue === "string") {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }
        }
        if (aValue < bValue) return orderDir === "asc" ? -1 : 1;
        if (aValue > bValue) return orderDir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [products, category, onSaleOnly, orderBy, orderDir]);

  return (
    <section className="page-section">
      <div className="app-container">
        {/* <div className="products-page-header surface-card">
          <div>
            <h1 className="title-lg">Catalogo FuelUp PRO</h1>
            <p className="text-muted">Prodotti premium in stile fitness performance dark.</p>
          </div>
          <button type="button" className="btn-ui btn-ui-outline products-filter-toggle" onClick={() => setFiltersOpen((value) => !value)}>
            <i className="bi bi-sliders"></i>
            Filtri
          </button>
        </div> */}

        <div className="products-page-layout">
          <aside className={`surface-card products-filters-panel ${filtersOpen ? "open" : ""}`}>
            <div className="toolbar-group">
              <span className="toolbar-label">Categorie</span>
              <CategoryPills categories={CATEGORY_FILTERS} selectedValue={category} onChange={setCategory} />
            </div>

            <div className="toolbar-group">
              <span className="toolbar-label">Offerte</span>
              <label className="products-sale-switch">
                <input type="checkbox" checked={onSaleOnly} onChange={(event) => setOnSaleOnly(event.target.checked)} />
                <span>Mostra solo scontati</span>
              </label>
            </div>

            <div className="toolbar-group">
              <span className="toolbar-label">Ordinamento</span>
              <select className="select-ui" value={orderBy} onChange={(event) => { setOrderBy(event.target.value); setPage(1); }}>
                <option value="created_at">Nuovi arrivi / Novità</option>
                <option value="name">Nome</option>
                <option value="price">Prezzo</option>
                <option value="brand">Brand</option>
              </select>
              <select className="select-ui" value={orderDir} onChange={(event) => { setOrderDir(event.target.value); setPage(1); }}>
                <option value="desc">Decrescente</option>
                <option value="asc">Crescente</option>
              </select>
            </div>
          </aside>

          <div className="products-main">
            <div className="surface-card toolbar products-main-toolbar">
              <div className="toolbar-group">
                <span className="toolbar-label">Visualizza</span>
                <ViewToggle value={view} onChange={(nextView) => { setView(nextView); setPage(1); }} />
              </div>
              <div className="products-count text-muted">{visibleProducts.length} prodotti visualizzati</div>
            </div>

            {loading && (
              <div className="surface-card state-card">
                <p>Caricamento prodotti...</p>
              </div>
            )}

            {!loading && error && <EmptyState icon="bi bi-exclamation-circle" title="Errore" description={error} />}

            {!loading && !error && visibleProducts.length === 0 && (
              <EmptyState
                icon="bi bi-search"
                title="Nessun prodotto trovato"
                description="Modifica i filtri o resetta la ricerca per vedere piu risultati."
                ctaLabel="Reset filtri"
                ctaTo="/products"
              />
            )}

            {!loading && !error && visibleProducts.length > 0 && (
              <>
                {view === "grid" ? (
                  <div className="products-grid">
                    {visibleProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="products-list">
                    {visibleProducts.map((product) => (
                      <ProductRow key={product.id} product={product} />
                    ))}
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="surface-card pagination">
                    <button
                      type="button"
                      className="btn-ui btn-ui-outline"
                      onClick={() => setPage((current) => Math.max(current - 1, 1))}
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
                      onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
                      disabled={page === totalPages}
                    >
                      Avanti
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
