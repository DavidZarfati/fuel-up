import { NavLink, Link, useNavigate } from "react-router-dom";
import "./Header.css";
import "../index.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import logo from "../assets/images/logo.jpg";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function Header({ nameApp }) {

    const headerLinks = [
        { title: "About Us", path: "/about-us" },
        { title: "Nostri prodotti", path: "/products" },
        { title: "Prodotti preferiti", path: "/products/favourites" },
        { title: "Carrello", path: "/shopping-cart" },
    ];

    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { totalItems } = useCart();


    function searchProduct() {
        if (!search.trim()) {
            return;
        }

        // Naviga alla pagina di ricerca con il termine come parametro query
        navigate(`/search?q=${encodeURIComponent(search)}`);
        setSearch("");
        setIsMenuOpen(false); // Close menu after search on mobile
    }

    function handleSubmit(event) {
        event.preventDefault();
        searchProduct();
    }

    function toggleMenu() {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <header className="ot-header">
            <div className="ot-header-content">
                
                {/* Logo - Always visible on left (order: 1) */}
                <div className="ot-logo-container">
                    <Link to="/" className="ot-logo-link" onClick={() => setIsMenuOpen(false)}>
                        <img className="ot-logo" src={logo} alt={nameApp} />
                    </Link>
                </div>

                {/* Hamburger Menu - Mobile Only (order: 2) */}
                <button
                    className="ot-hamburger"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                    aria-expanded={isMenuOpen}
                >
                    <i className={isMenuOpen ? "bi bi-x-lg" : "bi bi-list"}></i>
                </button>

                {/* Navigation Menu - Desktop: inline (order: 2), Mobile: overlay */}
                <nav className={`ot-nav-menu ${isMenuOpen ? 'ot-menu-open' : ''}`}>
                    <ul className="ot-nav-list">
                        {headerLinks.map((link, index) => (
                            <li key={index} className="ot-nav-item">
                                <NavLink
                                    className="ot-nav-link"
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.title}
                                    {link.title === "Carrello" && totalItems > 0 && (
                                        <span className="ot-badge">
                                            {totalItems}
                                        </span>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    {/* Search Bar - Inside mobile menu, pinned right on desktop (order: 3) */}
                    <form className="ot-search-bar" onSubmit={handleSubmit}>
                        <input
                            type="search"
                            placeholder="Cosa cerchi?"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            aria-label="Search products"
                        />
                        <button type="submit" aria-label="Search button">
                            <i className="bi bi-search"></i>
                            <span className="ot-search-text">Cerca</span>
                        </button>
                    </form>
                </nav>

                {/* Mobile Action Icons - Mobile Only */}
                <div className="ot-mobile-actions">
                    <button
                        className="ot-icon-button"
                        onClick={() => navigate("/products/favourites")}
                        aria-label="Prodotti preferiti"
                    >
                        <i className="bi bi-heart"></i>
                    </button>

                    <button
                        className="ot-icon-button ot-cart-button"
                        onClick={() => navigate("/shopping-cart")}
                        aria-label="Carrello"
                    >
                        <i className="bi bi-cart"></i>
                        {totalItems > 0 && (
                            <span className="ot-cart-badge">
                                {totalItems}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}