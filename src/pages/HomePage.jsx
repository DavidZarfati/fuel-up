import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import HeroVideoSection from "../components/HeroVideoSection";
import CategoryPills from "../components/CategoryPills";
import ViewToggle from "../components/ViewToggle";
import ProductCard from "../components/ProductCard";
import ProductRow from "../components/ProductRow";
import EmptyState from "../components/EmptyState";
import { useCart } from "../context/CartContext";
import "./HomePage.css";

const CATEGORIES = [
  { label: "Piu venduti", value: "" },
  { label: "Integratori", value: 1 },
  { label: "Abbigliamento", value: 2 },
  { label: "Accessori", value: 3 },
  { label: "Cibo & Snacks", value: 4 },
];

const FEATURES = [
  { icon: "bi bi-lightning-charge", title: "Spedizione rapida", text: "Consegna veloce in 24/48h" },
  { icon: "bi bi-patch-check", title: "Qualita certificata", text: "Prodotti selezionati premium" },
  { icon: "bi bi-shield-lock", title: "Pagamenti sicuri", text: "Checkout protetto e affidabile" },
  { icon: "bi bi-headset", title: "Supporto esperto", text: "Assistenza dedicata FuelUp" },
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

export default function HomePage() {
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("grid");
  const [category, setCategory] = useState("");
  const { totalPrice } = useCart();
  const FREE_SHIPPING_TARGET = 100;
  const freeShippingActive = totalPrice >= FREE_SHIPPING_TARGET;

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (!categoryFromUrl) {
      setCategory("");
      return;
    }

    const parsed = Number(categoryFromUrl);
    setCategory(Number.isFinite(parsed) ? parsed : "");
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    setError("");

    axios
      .get(`${backendBaseUrl}/api/products?limit=40`)
      .then((resp) => {
        let items = [];
        if (Array.isArray(resp.data)) items = resp.data;
        else if (Array.isArray(resp.data?.result)) items = resp.data.result;
        else if (Array.isArray(resp.data?.products)) items = resp.data.products;
        setProducts(items);
      })
      .catch(() => setError("Errore nel caricamento dei prodotti."))
      .finally(() => setLoading(false));
  }, [backendBaseUrl]);

  const filteredProducts = useMemo(() => {
    if (category === "") return products;
    return products.filter((product) => getProductCategory(product) === Number(category));
  }, [products, category]);

  const bestSellers = useMemo(() => filteredProducts.slice(0, 12), [filteredProducts]);
  const onSaleProducts = useMemo(
    () => filteredProducts.filter((product) => hasDiscount(product)).slice(0, 8),
    [filteredProducts]
  );

  function handleCategoryChange(value) {
    setCategory(value);
    const params = new URLSearchParams(searchParams);

    if (value === "") {
      params.delete("category");
      setSearchParams(params, { replace: true });
      return;
    }

    params.set("category", String(value));
    setSearchParams(params, { replace: true });
  }

  return (
    <section className="page-section">
      <div className="app-container">
        <HeroVideoSection />

        {freeShippingActive && (
          <div className="free-shipping-banner surface-card">
            <i className="bi bi-truck"></i>
            <div>
              <strong>Spedizione gratuita</strong>
              <div>per ordini superiori a EUR {FREE_SHIPPING_TARGET}</div>
            </div>
          </div>
        )}

        <div className="surface-card home-features">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="home-feature-item">
              <i className={feature.icon}></i>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>

        <div className="surface-card toolbar">
          <div className="toolbar-group">
            <span className="toolbar-label">Categorie</span>
            <CategoryPills categories={CATEGORIES} selectedValue={category} onChange={handleCategoryChange} className="home-categories-row" />
          </div>
          <div className="toolbar-group">
            <span className="toolbar-label">Visualizzazione</span>
            <ViewToggle value={view} onChange={setView} />
          </div>
        </div>

        {loading && (
          <div className="surface-card state-card">
            <p>Caricamento prodotti...</p>
          </div>
        )}

        {!loading && error && <EmptyState icon="bi bi-exclamation-circle" title="Errore" description={error} />}

        {!loading && !error && bestSellers.length === 0 && (
          <EmptyState icon="bi bi-box-seam" title="Nessun prodotto disponibile" description="Riprova tra qualche minuto." />
        )}

        {!loading && !error && bestSellers.length > 0 && (
          <>
            <section className="home-product-section">
              <div className="home-section-head">
                <h2 className="title-lg">Best Sellers</h2>
                <p className="text-muted">Selezione top per performance e recupero.</p>
              </div>

              {view === "grid" ? (
                <div className="products-grid">
                  {bestSellers.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="products-list">
                  {bestSellers.map((product) => (
                    <ProductRow key={product.id} product={product} />
                  ))}
                </div>
              )}
            </section>

            <section className="home-product-section">
              <div className="home-section-head">
                <h2 className="title-lg">On Sale</h2>
                <p className="text-muted">Le migliori offerte del momento.</p>
              </div>

              {onSaleProducts.length === 0 ? (
                <EmptyState icon="bi bi-tag" title="Nessuna offerta in questa categoria" description="Prova una categoria diversa o torna piu tardi." />
              ) : view === "grid" ? (
                <div className="products-grid">
                  {onSaleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="products-list">
                  {onSaleProducts.map((product) => (
                    <ProductRow key={product.id} product={product} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </section>
  );
}
