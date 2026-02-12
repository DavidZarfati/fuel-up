import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useMemo, useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { useFavourites } from "../context/FavouritesContext";
import "./Header.css";
import logo from "../assets/images/logo.png";
import ShippingBanner from "./ShippingBanner";


const MAIN_LINKS = [
  { title: "Home", path: "/" },
  { title: "Chi siamo", path: "/about-us" },
  { title: "Nostri prodotti", path: "/products" },
];

const CATEGORY_LINKS = [
  { title: "Tutti i prodotti", path: "/products" },
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
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 980);
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const { favourites } = useFavourites();
  const favouritesCount = useMemo(() => favourites.length, [favourites]);
  const dropdownTimeout = useRef(null);


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

  useEffect(() => {
    function handleResize() {
      setIsDesktop(window.innerWidth > 980);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="ot-header">
      <div className="app-container">
        <div className="ot-header-main-row">
          <Link to="/" className="ot-header-brand" onClick={() => setIsMenuOpen(false)}>
            <img src={logo} alt={nameApp} className="neon-logo" />
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
              className="ot-header-menu-toggle "
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
            <IconAction
              icon="bi bi-cart3"
              badge={totalItems}
              label="Carrello"
              onClick={() => {
                navigate("/shopping-cart");
                setIsMenuOpen(false);
              }}
            />
          </div>
        </div>

        <div className={`ot-header-nav-wrap ${isMenuOpen ? "open" : ""}`}>

          {/* <nav className="ot-header-main-nav">
            {MAIN_LINKS.map((link) => {
              if (link.path === "/products") {
                return (
                  <div
                    key={link.path}
                    className="products-main-link"
                    onMouseEnter={() => {
                      clearTimeout(dropdownTimeout.current);
                      setProductsDropdownOpen(true);
                    }}
                    onMouseLeave={() => {
                      dropdownTimeout.current = setTimeout(() => {
                        setProductsDropdownOpen(false);
                      }, 200); // slight delay for tolerance
                    }}
                  >
                    <button
                      type="button"
                      className={`products-toggle ${productsDropdownOpen ? "open" : ""} ${location.pathname === "/products" && !category && !onSale ? "active" : ""}`}
                      onClick={() => setProductsDropdownOpen(true)}
                    >
                      {link.title}
                    </button>

                    {isDesktop && productsDropdownOpen && (
                      <div className="products-dropdown" onClick={() => setIsMenuOpen(false)}>
                        {CATEGORY_LINKS.map((c) => (
                          <NavLink
                            key={c.title}
                            to={c.path}
                            className={({ isActive }) => {
                              if (c.category) return category === c.category ? "active" : "";
                              if (c.onSale) return onSale === c.onSale ? "active" : "";
                              if (c.path === "/products") return !category && !onSale ? "active" : "";
                              return "";
                            }}
                            onClick={() => setIsMenuOpen(false)}
                          >
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
          </nav> */}

          <nav className="ot-header-main-nav">
            {MAIN_LINKS.map((link) => {
              if (link.path === "/products") {
                return isDesktop ? (
                  // Desktop: dropdown
                  <div
                    key={link.path}
                    className="products-main-link"
                    onMouseEnter={() => {
                      clearTimeout(dropdownTimeout.current);
                      setProductsDropdownOpen(true);
                    }}
                    onMouseLeave={() => {
                      dropdownTimeout.current = setTimeout(() => {
                        setProductsDropdownOpen(false);
                      }, 200);
                    }}
                  >
                    <button
                      type="button"
                      className={`products-toggle ${productsDropdownOpen ? "open" : ""
                        } ${location.pathname === "/products" ? "active" : ""}`}
                      onClick={() => setProductsDropdownOpen(true)}
                    >
                      {link.title}
                    </button>

                    {productsDropdownOpen && (
                      <div className="products-dropdown" onClick={() => setIsMenuOpen(false)}>
                        {CATEGORY_LINKS.map((c) => (
                          <NavLink
                            key={c.title}
                            to={c.path}
                            className={({ isActive }) => {
                              if (c.category) return category === c.category ? "active" : "";
                              if (c.onSale) return onSale === c.onSale ? "active" : "";
                              if (c.path === "/products") return !category && !onSale ? "active" : "";
                              return "";
                            }}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {c.title}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Mobile: flatten all categories under "I nostri prodotti"
                  CATEGORY_LINKS.map((c) => (
                    <NavLink
                      key={c.title}
                      to={c.path}
                      className={({ isActive }) => {
                        if (c.category) return category === c.category ? "active" : "";
                        if (c.onSale) return onSale === c.onSale ? "active" : "";
                        if (c.path === "/products") return !category && !onSale ? "active" : "";
                        return "";
                      }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {c.title}
                    </NavLink>
                  ))
                );
              }

              // Other main links
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => (location.pathname === link.path ? "active" : "")}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.title}
                  {link.icon && <i className={link.icon} style={{ marginLeft: '6px' }}></i>}
                </NavLink>
              );
            })}
          </nav>

        </div>
      </div>
      
      {/* Shipping Banner */}
      <ShippingBanner />
    </header>
  );
}