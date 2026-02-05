import { NavLink, Link, useNavigate } from "react-router-dom";
import "./Header.css";
import "../index.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import logo from "../assets/images/logo.jpg";
import { useState } from "react";
import axios from "axios";




export default function Header({ nameApp }) {


    const headerLinks = [

        { title: "Chi siamo", path: "/" },
        { title: "Nostri prodotti", path: "/products" },
        { title: "Prodotti preferiti", path: "/products/favourites" },
        { title: "Carello", path: "/shopping-cart" },

    ];



    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;


    function searchProduct() {

        if (!search.trim()) {
            return;
        }

        axios
            .get(`${backendBaseUrl}/api/products/search?key=${search}`)
            .then((resp) => {

                const products = resp.data.results || [];

                if (products.length > 0) {
                    const firstProduct = products[0];

                    navigate(`/productss/${firstProduct.slug}`);

                    setSearch("");
                } else {

                    alert("Non abbiamo trovato nessun prodotto con questo nome");
                }
            })
            .catch((err) => {
                console.log(err);

            });
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
                <div>
                    <img className="ot-logo" src={logo} alt={nameApp} />
                </div>

                {/* Search Bar */}
                <div>
                    <form className="ot-search-bar" onSubmit={handleSubmit}>
                        <input
                            type="search"
                            placeholder="Cosa cerchi?"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                        <button type="submit">Cerca</button>
                    </form>
                </div>
            </div>
        </header>
    );
}