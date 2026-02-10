import { Link, NavLink, useNavigate } from "react-router-dom";
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
  { title: "Integratori", path: "/products?category=1" },
  { title: "Abbigliamento", path: "/products?category=2" },
  { title: "Accessori", path: "/products?category=3" },
  { title: "Offerte", path: "/products?on_sale=1" },
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
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { favourites } = useFavourites();
  const favouritesCount = useMemo(() => favourites.length, [favourites]);

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
              <strong>{nameApp}</strong>
              <span>Fuel Your Performance</span>
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
              aria-label="Search products"
            />
            <button type="submit" className="btn-ui btn-ui-primary">
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
              label="Wishlist"
              onClick={() => {
                navigate("/products/favourites");
                setIsMenuOpen(false);
              }}
            />
            <IconAction
              icon="bi bi-bag"
              badge={totalItems}
              label="Cart"
              onClick={() => {
                navigate("/shopping-cart");
                setIsMenuOpen(false);
              }}
            />
            <IconAction
              icon="bi bi-person"
              badge={0}
              label="User"
              onClick={() => {
                navigate("/about-us");
                setIsMenuOpen(false);
              }}
            />
          </div>
        </div>

        <div className={`ot-header-nav-wrap ${isMenuOpen ? "open" : ""}`}>
          <nav className="ot-header-main-nav">
            {MAIN_LINKS.map((link) => (
              <NavLink key={link.path} to={link.path} onClick={() => setIsMenuOpen(false)}>
                {link.title}
              </NavLink>
            ))}
          </nav>

          <nav className="ot-header-category-nav">
            {CATEGORY_LINKS.map((link) => (
              <NavLink key={link.title} to={link.path} onClick={() => setIsMenuOpen(false)}>
                {link.title}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
