import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";




export default function ProductsPage() {

    const { slug } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;



    useEffect(() => {
        axios
            .get(`${backendBaseUrl}/api/products`)
            .then((resp) => {
                console.log('Risposta completa API:', resp.data);
                console.log('resp.data.results:', resp.data.results);
                console.log('resp.data direttamente:', resp.data);

                // Assicura che products sia sempre un array
                let productsData = [];
                if (Array.isArray(resp.data.results)) {
                    productsData = resp.data.results;
                } else if (Array.isArray(resp.data)) {
                    productsData = resp.data;
                } else {
                    productsData = [];
                }
                setProducts(productsData);
                setLoading(false);
                console.log('Prodotti impostati:', productsData);
                if (productsData.length === 0) {
                    console.log('Nessun prodotto ricevuto dall’API!');
                } else {
                    productsData.forEach((prod, idx) => {
                        console.log(`Prodotto #${idx}:`, prod);
                        console.log(`Slug prodotto #${idx}:`, prod.slug);
                    });
                }
            })
            .catch((err) => {
                console.log('Errore API:', err);
                setLoading(false);
            });
    }, []);



    return (
        <div className="products-container">

            <div className="products-grid">
                {loading ? (
                    <h2>Caricamento prodotti...</h2>
                ) : !slug ? (
                    <h2>Nessuno slug specificato</h2>
                ) : (() => {
                    const product = products.find(p => p.slug === slug);
                    console.log('Slug dalla URL:', slug);
                    console.log('Prodotto trovato:', product);
                    console.log('Tutti gli slug disponibili:', products.map(p => p.slug));

                    if (!product) {
                        return (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <h2>Prodotto non trovato</h2>
                                <p>Slug cercato: {slug}</p>
                                <p>Slug disponibili: {products.map(p => p.slug).join(', ')}</p>
                            </div>
                        );
                    }

                    return (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '20px' }}>
                            <img
                                src={`${backendBaseUrl}${product.image}`}
                                alt={product.title}
                                style={{ maxWidth: '500px', width: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', marginBottom: '30px' }}
                            />
                            <h1 style={{ marginBottom: '20px', fontSize: '2rem' }}>{product.title}</h1>
                            <p style={{ fontSize: '1.2rem', marginBottom: '16px', textAlign: 'center', maxWidth: '600px' }}>{product.description}</p>
                            <div style={{ marginTop: '10px', fontWeight: 'bold', color: '#3a96f2' }}>
                                {product.categories ? product.categories.split(',').map((cat) => (
                                    <span key={cat} style={{ marginRight: '8px', background: '#eaf6ff', padding: '6px 12px', borderRadius: '8px', fontSize: '0.95rem', display: 'inline-block', marginBottom: '8px' }}>{cat.trim()}</span>
                                )) : null}
                            </div>
                        </div>
                    );
                })()}
            </div>

        </div>
    );
}