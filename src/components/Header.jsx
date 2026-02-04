import { NavLink, Link, useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "../assets/images/logo.jpg";
import { useState } from "react";
import axios from "axios";




export default function Header({ nameApp }) {


    const headerLinks = [

        { title: "Chi siamo", path: "/" },
        { title: "Nostri prodotti", path: "/products" },

    ];



    const [search, setSearch] = useState("");
    const navigate = useNavigate();

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

                    alert("Non abiamo trovato nessun prodotto con questo nome");
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


    return (
        <header className="header">
            <div className="header-content">

                <div className="flex-inline">


                    <ul className="nav-item">
                        {headerLinks.map((link, index) => (
                            <li key={index}>
                                <NavLink
                                    className="nav-link"
                                    aria-current="page"
                                    to={link.path}
                                >
                                    {link.title}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <img className="logo" src={logo} alt="" />
                </div>



                <div>
                    <form className="search-bar" onSubmit={handleSubmit}>
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