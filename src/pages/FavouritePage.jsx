import { useFavourites } from "../context/FavouritesContext";
import SingleProductCard from "../components/SingleProductCard";
import "./FavouritePage.css";



export default function FavouritePage() {


  const { favourites } = useFavourites();


  return (
    <section className="ot-favourite-page-container">
      <div className="ot-favourite-page-header">
        <h1>Prodotti Preferiti</h1>

        <p className="ot-favourite-count-display">
            
          {favourites.length > 0
            ? `Hai ${favourites.length} ${favourites.length === 1 ? "prodotto preferito" : "prodotti preferiti"}`
            : "Nessun prodotto nei preferiti"}
        </p>
      </div>

     
      {favourites.length === 0 && (
        <div className="ot-no-favourites-message">
          <i className="bi bi-heart" style={{ fontSize: "64px", color: "#ccc", marginBottom: "16px" }}></i>
          <p>Non hai ancora aggiunto nessun prodotto ai preferiti.</p>
          <p className="text-muted">
            Clicca sul cuore <i className="bi bi-heart"></i> nei prodotti che ti piacciono per aggiungerli qui!
          </p>
        </div>
      )}

    
      {favourites.length > 0 && (
        <div className="ot-products-grid">
          {favourites.map((product, index) => (
            <div className="ot-product-card-wrapper" key={product.id ?? index}>
              <SingleProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}