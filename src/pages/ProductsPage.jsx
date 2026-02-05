import axios from "axios";
import { useEffect, useState } from "react";
import { useGlobal } from "../context/GlobalContext";
import SingleProductCard from "../components/SingleProductCard";

export default function ProductsPage() {
  const { backendUrl } = useGlobal();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchProducts() {
      setLoading(true);
      setError("");

      try {
        const resp = await axios.get(`${backendUrl}/api/products`);

        // ✅ accetta vari formati di risposta:
        // - resp.data = [...]
        // - resp.data.result = [...]
        // - resp.data.results = [...]
        const data = resp.data;
        const list =
          Array.isArray(data) ? data :
          Array.isArray(data?.result) ? data.result :
          Array.isArray(data?.results) ? data.results :
          [];

        if (!ignore) setProducts(list);
      } catch (e) {
        console.log(e);
        if (!ignore) setError("Errore nel caricamento dei prodotti.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      ignore = true; // evita setState dopo unmount
    };
  }, [backendUrl]);

  return (
    <section className="container">
      <h1>Lista Prodotti</h1>

      {loading && <p>Caricamento...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
          {products.map((p, index) => (
            <div className="col" key={p.id ?? p._id ?? index}>
              <SingleProductCard product={p} />
            </div>
          ))}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <p>Nessun prodotto disponibile.</p>
      )}
    </section>
  );
}
