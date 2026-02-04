import axios from "axios";
import { useState } from "react";
import "./HomePage.css";


export default function HomePage() {

    // const [search, setSearch] = useState("");
    // const [products, setProducts] = useState([]);

    // const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;

    // function handleSubmit(event) {
    //     event.preventDefault();
    //     getProducts();
    // }

    // function getProducts() {

    //     axios
    //         .get(`${backendBaseUrl}/api/products/search?key=${search}`)
    //         .then((resp) => {
    //             setProducts(resp.data.results || []);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //             setProducts([]);
    //         });
    // }

    return (
        <>
            <section className="home-container">
                <div className="hero-section">
                    
                </div>
            </section>
        </>
    );
}