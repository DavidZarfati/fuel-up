import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
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

export default function ProductsPage() {
  const { backendUrl } = useGlobal();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlState = useMemo(() => {
    const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
    const safePage = Number.isFinite(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;

    const viewFromUrl = searchParams.get("view") || "grid";
    const safeView = viewFromUrl === "list" ? "list" : "grid";

    const q = searchParams.get("q") || "";
    const orderBy = searchParams.get("order_by") || "created_at";
    const orderDir = (searchParams.get("order_dir") || "desc").toLowerCase() === "asc" ? "asc" : "desc";
    const categoryParam = searchParams.get("category") || "";
    const onSaleOnly = searchParams.get("on_sale") === "1";

    return { safePage, safeView, q, orderBy, orderDir, categoryParam, onSaleOnly };
  }, [searchParams]);

  const pageSize = 12;

  const [products, setProducts] = useState([]);
  const [serverTotalPages, setServerTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(urlState.safePage);
  const [view, setView] = useState(urlState.safeView);
  const [q, setQ] = useState(urlState.q);
  const [orderBy, setOrderBy] = useState(urlState.orderBy);
  const [orderDir, setOrderDir] = useState(urlState.orderDir);
  const [category, setCategory] = useState(urlState.categoryParam ? Number(urlState.categoryParam) : "");
  const [onSaleOnly, setOnSaleOnly] = useState(urlState.onSaleOnly);

  const [filtersOpen, setFiltersOpen] = useState(false);

  const didMountRef = useRef(false);

  // "Tutti" = nessun filtro attivo
  const isAll = category === "" && !onSaleOnly && !q;

  // Sync state con URL (quando incolli una URL deve rispettarla)
  useEffect(() => {
    if (page !== urlState.safePage) setPage(urlState.safePage);
    if (view !== urlState.safeView) setView(urlState.safeView);
    if (q !== urlState.q) setQ(urlState.q);
    if (orderBy !== urlState.orderBy) setOrderBy(urlState.orderBy);
    if (orderDir !== urlState.orderDir) setOrderDir(urlState.orderDir);

    const nextCategory = urlState.categoryParam ? Number(urlState.categoryParam) : "";
    if (category !== nextCategory) setCategory(nextCategory);

    if (onSaleOnly !== urlState.onSaleOnly) setOnSaleOnly(urlState.onSaleOnly);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlState]);

  // Reset pagina SOLO quando l’utente cambia filtri (non al primo render da URL)
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    setPage(1);
  }, [category, q, onSaleOnly, orderBy, orderDir, view]);

  // Aggiorna URL params (NON scrivere limit in URL)
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (page > 1) params.set("page", String(page));
    else params.delete("page");

    params.set("view", view);

    if (q) params.set("q", q);
    else params.delete("q");

    params.set("order_by", orderBy);
    params.set("order_dir", orderDir);

    if (category !== "") params.set("category", String(category));
    else params.delete("category");

    if (onSaleOnly) params.set("on_sale", "1");
    else params.delete("on_sale");

    setSearchParams(params, { replace: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, view, q, orderBy, orderDir, category, onSaleOnly]);

  // Fetch:
  // - se "Tutti": paginazione SERVER (page vero, limit=12)
  // - se filtri attivi: carica un set grande dalla page 1 e poi filtra+pagina CLIENT
  useEffect(() => {
    let ignore = false;

    async function fetchProducts() {
      setLoading(true);
      setError("");

      try {
        const shouldClientFilter = !isAll;

        const params = new URLSearchParams();
        params.set("page", String(shouldClientFilter ? 1 : page));
        params.set("limit", String(shouldClientFilter ? 500 : pageSize));

        if (q) params.set("q", q);
        if (orderBy) params.set("order_by", orderBy);
        if (orderDir) params.set("order_dir", orderDir);
        if (onSaleOnly) params.set("on_sale", "1");

        const resp = await axios.get(`${backendUrl}/api/products?${params.toString()}`);
        const data = resp.data;

        const list = Array.isArray(data?.result) ? data.result : [];
        const pagesFromServer = Number(data?.info?.pages) || 1;

        if (!ignore) {
          setProducts(list);
          setServerTotalPages(pagesFromServer);
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
  }, [backendUrl, page, q, orderBy, orderDir, category, onSaleOnly, isAll]);

  // Filtra + ordina lato client (quando filtri)
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const productCategory = getProductCategory(product);
      const matchesCategory = category === "" || productCategory === Number(category);
      const matchesSale = !onSaleOnly || hasDiscount(product);
      return matchesCategory && matchesSale;
    });

    if (orderBy) {
      filtered = [...filtered].sort((a, b) => {
        let aValue, bValue;

        if (orderBy === "price") {
          aValue = a.discount_price && Number(a.discount_price) > 0 ? Number(a.discount_price) : Number(a.price);
          bValue = b.discount_price && Number(b.discount_price) > 0 ? Number(b.discount_price) : Number(b.price);
        } else {
          aValue = a[orderBy];
          bValue = b[orderBy];

          if (typeof aValue === "string" && typeof bValue === "string") {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          } else {
            aValue = Number.isFinite(Number(aValue)) ? Number(aValue) : aValue;
            bValue = Number.isFinite(Number(bValue)) ? Number(bValue) : bValue;
          }
        }

        if (aValue < bValue) return orderDir === "asc" ? -1 : 1;
        if (aValue > bValue) return orderDir === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [products, category, onSaleOnly, orderBy, orderDir]);

  // Paginazione CLIENT sui filtrati
  const clientTotalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  }, [filteredProducts.length]);

  const pagedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, page]);

  // Totale pagine da mostrare:
  // - "Tutti" => serverTotalPages
  // - filtri => clientTotalPages
  const totalPagesToShow = isAll ? serverTotalPages : clientTotalPages;

  // Prodotti da renderizzare:
  // - "Tutti" => products (già paginati dal server)
  // - filtri => pagedProducts (paginati lato client)
  const productsToRender = isAll ? products : pagedProducts;

  // Clamp pagina solo dopo che ha finito di caricare
  useEffect(() => {
    if (loading) return;
    if (page > totalPagesToShow) setPage(totalPagesToShow);
  }, [totalPagesToShow, page, loading]);

  return (
    <section className="page-section">
      <div className="app-container">
        <div className="products-page-layout">
          <aside className={`surface-card products-filters-panel ${filtersOpen ? "open" : ""}`}>
            <div className="toolbar-group">
              <span className="toolbar-label">Categorie</span>
              <CategoryPills categories={CATEGORY_FILTERS} selectedValue={category} onChange={setCategory} />
            </div>

            <div className="toolbar-group">
              <span className="toolbar-label">Offerte</span>
              <label className="products-sale-switch">
                <input type="checkbox" checked={onSaleOnly} onChange={(e) => setOnSaleOnly(e.target.checked)} />
                <span>Mostra solo scontati</span>
              </label>
            </div>

            <div className="toolbar-group">
              <span className="toolbar-label">Ordinamento</span>
              <select className="select-ui" value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
                <option value="created_at">Nuovi arrivi / Novità</option>
                <option value="name">Nome</option>
                <option value="price">Prezzo</option>
                <option value="brand">Brand</option>
              </select>
              <select className="select-ui" value={orderDir} onChange={(e) => setOrderDir(e.target.value)}>
                <option value="desc">Decrescente</option>
                <option value="asc">Crescente</option>
              </select>
            </div>
          </aside>

          <div className="products-main">
            <div className="surface-card toolbar products-main-toolbar">
              <div className="toolbar-group">
                <span className="toolbar-label">Visualizza</span>
                <ViewToggle value={view} onChange={(nextView) => setView(nextView)} />
              </div>

              <div className="products-count text-muted">
                {isAll ? `${products.length} prodotti in questa pagina` : `${filteredProducts.length} prodotti visualizzati`}
              </div>
            </div>

            {loading && (
              <div className="surface-card state-card">
                <p>Caricamento prodotti...</p>
              </div>
            )}

            {!loading && error && <EmptyState icon="bi bi-exclamation-circle" title="Errore" description={error} />}

            {!loading && !error && !isAll && filteredProducts.length === 0 && (
              <EmptyState
                icon="bi bi-search"
                title="Nessun prodotto trovato"
                description="Modifica i filtri o resetta la ricerca per vedere piu risultati."
                ctaLabel="Reset filtri"
                ctaTo="/products"
              />
            )}

            {!loading && !error && (isAll || filteredProducts.length > 0) && (
              <>
                {view === "grid" ? (
                  <div className="products-grid">
                    {productsToRender.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="products-list">
                    {productsToRender.map((product) => (
                      <ProductRow key={product.id} product={product} />
                    ))}
                  </div>
                )}

                {totalPagesToShow > 1 && (
                  <div className="surface-card pagination">
                    <button
                      type="button"
                      className="btn-ui btn-ui-outline"
                      onClick={() => setPage((c) => Math.max(c - 1, 1))}
                      disabled={page === 1}
                    >
                      Indietro
                    </button>

                    <span>
                      Pagina <strong>{page}</strong> di <strong>{totalPagesToShow}</strong>
                    </span>

                    <button
                      type="button"
                      className="btn-ui btn-ui-outline"
                      onClick={() => setPage((c) => Math.min(c + 1, totalPagesToShow))}
                      disabled={page === totalPagesToShow}
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
