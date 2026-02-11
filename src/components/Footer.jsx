import "./Footer.css";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.PNG";

export default function Footer() {
  return (
    <footer className="ot-footer">
      <div className="app-container ot-footer-content">
        <div className="ot-footer-brand">
          <img src={logo} alt="FuelUp logo" />
          <h3>FuelUp</h3>
          <p>Nutrizione fitness premium</p>
          <small>Via esempio 1234, Italia</small>
        </div>

        <div className="ot-footer-column">
          <h4>Negozio</h4>
          <Link to="/products">Prodotti</Link>
          <Link to="/products?on_sale=1">Offerte</Link>
          <Link to="/products/favourites">Preferiti</Link>
        </div>

        <div className="ot-footer-column">
          <h4>Categorie</h4>
          <Link to="/products?category=1">Integratori</Link>
          <Link to="/products?category=2">Abbigliamento</Link>
          <Link to="/products?category=3">Accessori</Link>
          <Link to="/products?category=4">Cibo &amp; Snacks</Link>
        </div>

        <div className="ot-footer-column">
          <h4>Supporto</h4>
          <p>
            <i className="bi bi-lightning-charge"></i> Spedizione rapida
          </p>
          <p>
            <i className="bi bi-shield-check"></i> Pagamenti sicuri
          </p>
          <p>
            <i className="bi bi-headset"></i> Supporto dedicato
          </p>
        </div>
      </div>
    </footer>
  );
}
