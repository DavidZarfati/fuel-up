import axios from "axios";
import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import "./HomePage.css";


export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isGridMode, setisGridMode] = useState("");
    const [categoria, setcategoria] = useState("");
    const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;


    useEffect(() => {
        setLoading(true);
        axios.get(`${backendBaseUrl}/api/products?limit=30`)
            .then((resp) => {
                // Se la risposta è un oggetto con chiave result (array), usa quella
                let arr = [];
                if (Array.isArray(resp.data)) {
                    arr = resp.data;
                } else if (Array.isArray(resp.data.result)) {
                    arr = resp.data.result;
                } else if (Array.isArray(resp.data.products)) {
                    arr = resp.data.products;
                }
                setProducts(arr);
                setLoading(false);
            })
            .catch((err) => {
                setError("Errore nel caricamento dei prodotti");
                setLoading(false);
            });
        console.log(categoria)
    }, [categoria, isGridMode]);

    return (
        <>
            <div style={{ color: 'red', fontWeight: 'bold', fontSize: 22, margin: 10 }}>
                {/* DEBUG: prodotti caricati: {Array.isArray(products) ? products.length : 'non array'} */}
            </div>
            <section className="ot-home-container ot-bg-teal">
                <div className="ot-hero-section"></div>
                <div className="d-flex justify-content-around">


                    <div>
                        <button className="dz-link" onClick={() => setcategoria("")}>Prodotti Piu Venduti</button>
                        <button className="dz-link" onClick={() => setcategoria(1)}>Supplements</button>
                        <button className="dz-link" onClick={() => setcategoria(2)}>Apparel</button>
                        <button className="dz-link" onClick={() => setcategoria(3)}>Accessories</button>
                        <button className="dz-link" onClick={() => setcategoria(4)}>Food & Snacks</button>
                    </div>
                    <div>
                        <button className="dz-link" onClick={async () => {
                            setisGridMode(1);
                            if (categoria !== "") {
                                setLoading(true);
                                try {
                                    const resp = await axios.get(`${backendBaseUrl}/api/products?macrocategoria_id=${categoria}`);
                                    let arr = [];
                                    if (Array.isArray(resp.data)) {
                                        arr = resp.data;
                                    } else if (Array.isArray(resp.data.result)) {
                                        arr = resp.data.result;
                                    } else if (Array.isArray(resp.data.products)) {
                                        arr = resp.data.products;
                                    }
                                    setProducts(arr);
                                } catch (err) {
                                    setError("Errore nel caricamento dei prodotti");
                                } finally {
                                    setLoading(false);
                                }
                            }
                        }}>Lista</button>
                        <button className="dz-link" onClick={() => setisGridMode("")}>Griglia</button>
                    </div>
                </div>
                {!isGridMode ? (
                    <div className="d-flex container ot-bg-teal">
                        <div className="row">
                            {loading && <p>Caricamento prodotti...</p>}
                            {error && <p>{error}</p>}
                            {!loading && !error && Array.isArray(products) && (
                                categoria === ""
                                    ? products.slice(0, 12).map((card, idx) => (
                                        <div className="col-sm-12 col-md-6 col-lg-4" key={idx}>
                                            <div className="card mb-3" style={{ border: '1px solid #ccc', background: '#f9f9f9', minHeight: 250 }}>
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col-12">
                                                        <div className="card-body">
                                                            <img
                                                                src={`${backendBaseUrl}${card.image}`}
                                                                alt={card.name}
                                                                style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain', marginBottom: '10px' }}
                                                            />
                                                            <h5 className="card-title">{card.name}</h5>
                                                            <p className="card-text">{card.description}</p>
                                                            <Link to={`/products/${card.slug}`} className="btn btn-outline-primary">
                                                                Vedi dettagli
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                    : products.filter(card => card.macro_categories_id === categoria).map((card, idx) => (
                                        <div className="col-sm-12 col-md-6 col-lg-4" key={idx}>
                                            <div className="card mb-3" style={{ border: '1px solid #ccc', background: '#f9f9f9', minHeight: 250 }}>
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col-12">
                                                        <div className="card-body">
                                                            <img
                                                                src={`${backendBaseUrl}${card.image}`}
                                                                alt={card.name}
                                                                style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain', marginBottom: '10px' }}
                                                            />
                                                            <h5 className="card-title">{card.name}</h5>
                                                            <p className="card-text">{card.description}</p>
                                                            <Link to={`/products/${card.slug}`} className="btn btn-outline-primary">
                                                                Vedi dettagli
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>
                ) : (<div>
                    {!loading && !error && Array.isArray(products) && products
                        .filter(card => categoria === "" || card.macro_categories_id === categoria)
                        .map((card, idx) => (
                            <div className="col-12" key={idx}>
                                <div className="card mb-3" style={{ border: '1px solid #ccc', background: '#f9f9f9', minHeight: 100 }}>
                                    <div className="row no-gutters align-items-center">
                                        <div className="col-12">
                                            <div className="card-body d-flex">
                                                <img
                                                    src={`${backendBaseUrl}${card.image}`}
                                                    alt={card.name}
                                                    style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', marginBottom: '10px' }}
                                                />
                                                <h5 className="card-title">{card.name}- </h5>
                                                <p className="card-text">{card.description}</p>
                                                <Link to={`/products/${card.slug}`} className="btn btn-outline-primary dz-bottone-dettagli">
                                                    Vedi dettagli
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}


                </div>)}


            </section >
        </>
    );
}