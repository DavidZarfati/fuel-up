import { Link } from "react-router-dom";
import "./HeroSection.css";

export default function HeroSection({
  title,
  subtitle,
  primaryText = "Esplora prodotti",
  primaryTo = "/products",
  secondaryText = "Offerte",
  secondaryTo = "/products?on_sale=1",
}) {
  return (
    <section className="hero-section surface-card">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <p className="hero-kicker">FuelUp Collezione Premium</p>
        <h1 className="title-xl">{title}</h1>
        <p className="hero-subtitle">{subtitle}</p>
        <div className="hero-actions">
          <Link className="btn-ui btn-ui-primary" to={primaryTo}>
            {primaryText}
          </Link>
          <Link className="btn-ui btn-ui-outline" to={secondaryTo}>
            {secondaryText}
          </Link>
        </div>
      </div>
    </section>
  );
}
