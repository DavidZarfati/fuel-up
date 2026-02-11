import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import { useFavourites } from "../context/FavouritesContext";
import "./Header.css";
import logo from "../assets/images/logo.png";

const MAIN_LINKS = [
  { title: "Chi siamo", path: "/about-us" },
  { title: "I nostri prodotti", path: "/products" },
  { title: "Preferiti", path: "/products/favourites" },
];

const CATEGORY_LINKS = [
  { title: "Prodotti", path: "/products" },
  { title: "Integratori", path: "/products?category=1", category: "1" },
  { title: "Abbigliamento", path: "/products?category=2", category: "2" },
  { title: "Accessori", path: "/products?category=3", category: "3" },
  { title: "Cibo & Snacks", path: "/products?category=4", category: "4" },
  { title: "Offerte", path: "/products?on_sale=1", onSale: "1" },
];

function IconAction({ icon, badge, label, onClick }) {
  return (
    <button type="button" className="ot-header-icon-btn" aria-label={label} onClick={onClick}>
      <i className={icon}></i>
      {badge > 0 && <span className="ot-header-icon-badge">{badge}</span>}
    </button>
  );
}

export default function Header({ nameApp }) {
  const [search, setSearch] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const { favourites } = useFavourites();
  const favouritesCount = useMemo(() => favourites.length, [favourites]);

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");
  const onSale = queryParams.get("on_sale");

  function handleSubmit(event) {
    event.preventDefault();
    if (!search.trim()) return;
    navigate(`/search?q=${encodeURIComponent(search)}`);
    setSearch("");
    setIsMenuOpen(false);
  }

  return (
    <header className="ot-header">
      <div className="app-container">
        <div className="ot-header-main-row">
          <Link to="/" className="ot-header-brand" onClick={() => setIsMenuOpen(false)}>
            <img src={logo} alt={nameApp} />
            <div>
              {/* <strong>{nameApp}</strong>
              <span>Alimenta la tua performance</span> */}
            </div>
          </Link>

            <form className="ot-header-search" onSubmit={handleSubmit}>
            <i className="bi bi-search"></i>
            <input
              className="input-ui"
              type="search"
              placeholder="Cerca prodotti, brand, categorie..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Cerca prodotti"
            />
            <button type="submit" className="btn-ui btn-ui-primary neon-btn">
              Cerca
            </button>
          </form>

          <div className="ot-header-actions">
            <button
              type="button"
              className="ot-header-menu-toggle"
              onClick={() => setIsMenuOpen((value) => !value)}
              aria-label="Apri menu"
            >
              <i className={isMenuOpen ? "bi bi-x-lg" : "bi bi-list"}></i>
            </button>

            <IconAction
              icon="bi bi-heart"
              badge={favouritesCount}
              label="Preferiti"
              onClick={() => {
                navigate("/products/favourites");
                setIsMenuOpen(false);
              }}
            />
            <button type="button" className="ot-header-icon-btn" aria-label="Carrello" onClick={() => { navigate('/shopping-cart'); setIsMenuOpen(false); }}>
              <i className="bi bi-cart3"></i>
              {totalItems > 0 && <span className="ot-header-icon-badge">{totalItems}</span>}
            </button>
            {/* account icon removed per request */}
          </div>
        </div>

        <div className={`ot-header-nav-wrap ${isMenuOpen ? "open" : ""}`}>
          {/* Main Navigation */}
          <nav className="ot-header-main-nav">
            {MAIN_LINKS.map((link) => {
              if (link.path === "/products") {
                return (
                  <div key={link.path} className="products-main-link" onMouseLeave={() => setProductsDropdownOpen(false)}>
                    <button
                      type="button"
                      className={`products-toggle ${productsDropdownOpen ? "open" : ""} ${location.pathname === "/products" && !category && !onSale ? "active" : ""}`}
                      onClick={() => setProductsDropdownOpen((v) => !v)}
                    >
                      {link.title}
                    </button>
                    {productsDropdownOpen && (
                      <div className="products-dropdown" onClick={() => setIsMenuOpen(false)}>
                        {CATEGORY_LINKS.map((c) => (
                          <NavLink key={c.title} to={c.path} className={({ isActive }) => (isActive ? "active" : "")} onClick={() => { setProductsDropdownOpen(false); }}>
                            {c.title}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => (location.pathname === link.path ? "active" : "")}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.title}
                </NavLink>
              );
            })}
          </nav>

          {/* Category Navigation */}
          <nav className="ot-header-category-nav">
            {CATEGORY_LINKS.map((link) => (
              <NavLink
                key={link.title}
                to={link.path}
                className={({ isActive }) => {
                  if (link.path === "/products") {
                    return location.pathname === "/products" && !category && !onSale ? "active" : "";
                  }
                  if (link.category) {
                    return location.pathname === "/products" && category === link.category ? "active" : "";
                  }
                  if (link.onSale) {
                    return location.pathname === "/products" && onSale === link.onSale ? "active" : "";
                  }
                  return "";
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.title}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
