import axios from "axios";
import { useEffect, useState } from "react";
import { useGlobal } from "../context/GlobalContext";
import SingleProductCard from "./SingleProductCard";

export default function RelatedProductsCarousel({ slug }) {
  const { backendUrl } = useGlobal();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const limit = 4;

  useEffect(() => {
    setPage(1); // reset quando cambia prodotto
  }, [slug]);

  useEffect(() => {
    if (!slug) return;

    let ignore = false;

    async function fetchRelated() {
      setLoading(true);
      setError("");

      try {
        const resp = await axios.get(
          `${backendUrl}/api/products/similar-by-categories/${slug}?page=${page}&limit=${limit}`
        );

        const data = resp.data;

        if (!ignore) {
          setProducts(Array.isArray(data?.risultati) ? data.risultati : []);
          setTotalPages(data?.paginazione?.totale_pagine || 1);
        }
      } catch (e) {
        console.error(e);
        if (!ignore) setError("Errore nel caricamento dei prodotti correlati.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchRelated();
    return () => {
      ignore = true;
    };
  }, [backendUrl, slug, page]);

  if (!slug) return null;
  if (!loading && !error && products.length === 0) return null;

  return (
    <section className="container my-4">
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-sm-between gap-2 mb-3">
        <h3 className="m-0">Prodotti correlati</h3>

        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-outline-dark btn-sm"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1 || loading}
          >
            ←
          </button>

          <span className="small text-muted">
            Pagina <strong>{page}</strong> di <strong>{totalPages}</strong>
          </span>

          <button
            type="button"
            className="btn btn-outline-dark btn-sm"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages || loading}
          >
            →
          </button>
        </div>
      </div>

      {loading && (
        <div className="d-flex align-items-center gap-2">
          <div className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
          <span>Caricamento...</span>
        </div>
      )}

      {error && <div className="alert alert-danger py-2 my-3">{error}</div>}

      {!loading && !error && (
        <div className="row g-3">
          {products.map((p) => (
            <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <SingleProductCard product={p} />
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="d-flex justify-content-center gap-2 mt-3">
          <button
            type="button"
            className="btn btn-dark"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1 || loading}
          >
            ← Indietro
          </button>
          <button
            type="button"
            className="btn btn-dark"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages || loading}
          >
            Avanti →
          </button>
        </div>
      )}
    </section>
  );
}
