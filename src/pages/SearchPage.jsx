import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import SingleProductCard from "../components/SingleProductCard";
import "./SearchPage.css";

export default function SearchPage() {
    const { backendUrl } = useGlobal();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const searchTerm = searchParams.get("q") || "";
    const orderBy = searchParams.get("order_by") || "name";
    const initialPage = parseInt(searchParams.get("page")) || 1;

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(initialPage);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [localOrderBy, setLocalOrderBy] = useState(orderBy);

    const limit = 12;
    const orderDir = "asc"; // Fixed to ascending order

    useEffect(() => {
        let ignore = false;

        async function fetchSearchResults() {
            if (!searchTerm.trim()) {
                if (!ignore) {
                    setProducts([]);
                    setLoading(false);
                    setError("Inserisci un termine di ricerca.");
                }
                return;
            }

            setLoading(true);
            setError("");

            try {
                const resp = await axios.get(`${backendUrl}/api/products/search`, {
                    params: {
                        q: searchTerm,
                        order_by: localOrderBy,
                        order_dir: orderDir,
                        limit: limit,
                        page: page,
                    },
                });

                const data = resp.data;
                console.log("Risposta backend ricerca:", data);

                if (!ignore) {
                    const list = Array.isArray(data?.risultati) ? data.risultati : [];
                    const total = data?.paginazione?.totale_risultati || 0;
                    const pages = data?.paginazione?.totale_pagine || 0;

                    setProducts(list);
                    setTotalProducts(total);
                    setTotalPages(pages);

                    if (list.length === 0 && page === 1) {
                        setError(
                            `Nessun prodotto trovato per "${searchTerm}". Prova con un termine diverso.`
                        );
                    }
                }
            } catch (e) {
                console.error("Errore ricerca:", e);
                if (!ignore) {
                    setError("Errore nel caricamento dei risultati di ricerca.");
                    setProducts([]);
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        fetchSearchResults();

        return () => {
            ignore = true;
        };
    }, [backendUrl, searchTerm, page, localOrderBy]);

    // Aggiorna l'URL quando cambiano i parametri
    useEffect(() => {
        const params = new URLSearchParams();
        params.set("q", searchTerm);
        if (localOrderBy !== "name") params.set("order_by", localOrderBy);
        if (page !== 1) params.set("page", page);

        const queryString = params.toString();
        navigate(`/search?${queryString}`, { replace: true });
    }, [searchTerm, page, localOrderBy, navigate]);

    const handleOrderByChange = (e) => {
        setLocalOrderBy(e.target.value);
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleNewSearch = (newSearchTerm) => {
        if (newSearchTerm.trim()) {
            setPage(1);
            setLocalOrderBy("name");
            navigate(`/search?q=${encodeURIComponent(newSearchTerm)}`);
        }
    };

    return (


        <section className="ot-search-page-container">
            <div className="ot-search-page-header">
                <h1>Risultati di ricerca</h1>
                {searchTerm && (
                    <p className="ot-search-term-display">
                        Ricerca per: <strong>"{searchTerm}"</strong>
                    </p>
                )}

            </div>

            {/* Filtri e ordinamento */}
            {products.length > 0 && (
                <div className="ot-search-filters">
                    <div className="ot-filter-group">
                        <label htmlFor="order-by">Ordina per:</label>
                        <select
                            id="order-by"
                            value={localOrderBy}
                            onChange={handleOrderByChange}
                            className="ot-filter-select"
                        >
                            <option value="name">Nome (A-Z)</option>
                            {/* <option value="price">Prezzo</option> */}
                            <option value="brand">Brand</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Contenuto principale */}
            {loading && (
                <div className="ot-loading-container">
                    <p>Caricamento risultati...</p>
                </div>
            )}

            {error && !loading && (
                <div className="ot-error-message">
                    <p>{error}</p>
                    <button
                        onClick={() => handleNewSearch("protein")}
                        className="ot-btn ot-btn-primary"
                    >
                        Visualizza prodotti consigliati
                    </button>
                </div>
            )}

            {!loading && !error && products.length > 0 && (
                <>
                    <div className="ot-products-grid">
                        {products.map((product, index) => (
                            <div className="ot-product-card-wrapper" key={product.id ?? index}>
                                <SingleProductCard product={product} />
                            </div>
                        ))}
                    </div>

                    {/* Paginazione */}
                    {totalPages > 1 && (
                        <div className="ot-pagination-container">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className="ot-pagination-btn"
                            >
                                ← Indietro
                            </button>

                            <div className="ot-pagination-info">
                                <span>
                                    Pagina <strong>{page}</strong> di <strong>{totalPages}</strong>
                                </span>
                            </div>

                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === totalPages}
                                className="ot-pagination-btn"
                            >
                                Avanti →
                            </button>
                        </div>
                    )}
                </>
            )}

            {!loading && !error && products.length === 0 && !searchTerm && (
                <div className="ot-no-search-message">
                    <p>Usa la barra di ricerca per cercare un prodotto.</p>
                </div>
            )}
        </section>
    );
}