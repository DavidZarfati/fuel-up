import { NavLink, Link, useNavigate } from "react-router-dom";
import "./Header.css";
import "../index.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import logo from "../assets/images/logo.jpg";
import { useState } from "react";

export default function Header({ nameApp }) {

    const headerLinks = [
        { title: "Chi siamo", path: "/" },
        { title: "Nostri prodotti", path: "/products" },
        { title: "Prodotti preferiti", path: "/products/favourites" },
        { title: "Carrello", path: "/shopping-cart" },
    ];

    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    function searchProduct() {
        if (!search.trim()) {
            return;
        }

        // Naviga alla pagina di ricerca con il termine come parametro query
        navigate(`/search?q=${encodeURIComponent(search)}`);
        setSearch("");
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
                <div className="ot-mobile-icons">
                    <button
                        className="ot-hamburger"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        <i className={isMenuOpen ? "bi bi-x-lg" : "bi bi-list"}></i>
                    </button>

                    <button
                        className="ot-icon-button ot-favourites-icon"
                        onClick={() => navigate("/products/favourites")}
                        aria-label="Favourites"
                    >
                        <i className="bi bi-heart"></i>
                    </button>

                    <button
                        className="ot-icon-button ot-cart-icon"
                        onClick={() => navigate("/shopping-cart")}
                        aria-label="Shopping cart"
                    >
                        <i className="bi bi-cart"></i>
                    </button>
                </div>

                {/* Navigation Links */}
                <div className={`ot-flex-inline ${isMenuOpen ? 'ot-menu-open' : ''}`}>
                    <ul className="ot-nav-item">
                        {headerLinks.map((link, index) => (
                            <li key={index}>
                                <NavLink
                                    className="ot-nav-link"
                                    aria-current="page"
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.title}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Logo */}
                <div className="ml-no-shrink">
                    <Link to="/">
                        <img className="ot-logo ml-no-shrink ml-logo" src={logo} alt={nameApp} />
                    </Link>
                </div>

                {/* Search Bar */}
                <div>
                    <form className="ot-search-bar" onSubmit={handleSubmit}>
                        <input
                            type="search"
                            placeholder="Cosa cerchi?"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            aria-label="Search products"
                        />
                        <button type="submit" aria-label="Search button">
                            Cerca
                        </button>
                    </form>
                </div>
            </div>
        </header>
    );
}