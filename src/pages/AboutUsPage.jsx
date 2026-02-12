import "./AboutUsPage.css";
import AboutUsSection from "../components/AboutUsSection";

const VALUES = [
  {
    icon: "bi bi-patch-check",
    title: "Qualita certificata",
    text: "Selezioniamo solo prodotti testati e affidabili.",
  },
  {
    icon: "bi bi-eye",
    title: "Trasparenza",
    text: "Schede prodotto complete, ingredienti e note tecniche chiare.",
  },
  {
    icon: "bi bi-heart-pulse",
    title: "Performance",
    text: "Soluzioni pensate per migliorare allenamento, recupero e benessere.",
  },
  {
    icon: "bi bi-headset",
    title: "Supporto",
    text: "Team disponibile per aiutarti a scegliere il prodotto giusto.",
  },
];

export default function AboutUsPage() {
  return (
    <section className="page-section">
      <div className="app-container about-layout">
        <header className="surface-card about-hero">
          <p className="about-kicker">Chi siamo</p>
          <h1 className="title-lg">FuelUp e il partner per nutrizione sportiva e performance.</h1>
          <p className="text-muted">
            Lavoriamo ogni giorno per offrire un catalogo premium, affidabile e aggiornato per atleti,
            appassionati fitness e professionisti del benessere.
          </p>
        </header>

        <AboutUsSection
          title={<>FuelUp: la scienza<br /> della performance a un<br /> click da te.</>}
          subtitle="Scopri integratori, apparel e accessori premium con esperienza personalizzata FuelUp e acquisto rapido."
          primaryText="Esplora prodotti"
          secondaryText="Offerte attive"
        />

        <section className="surface-card about-content">
          <h2 className="title-md">La nostra filosofia</h2>
          <p>
            Crediamo che allenarsi meglio richieda prodotti migliori. Per questo selezioniamo solo brand
            solidi, formulazioni trasparenti e articoli pensati per risultati concreti.
          </p>
          <p>
            Ogni riferimento del catalogo viene scelto in base a qualita, sicurezza e utilita pratica:
            dall integrazione quotidiana ai prodotti specifici per obiettivi intensivi.
          </p>
        </section>

        <section className="about-values-grid">
          {VALUES.map((value) => (
            <article key={value.title} className="surface-card about-value-card">
              <i className={value.icon}></i>
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </article>
          ))}
        </section>

        <section className="surface-card about-contact">
          <h2 className="title-md">Contattaci</h2>
          <p className="text-muted">
            Hai domande su prodotti, ordini o abbinamenti nutrizionali? Il team FuelUp e pronto ad aiutarti.
          </p>
          <div className="about-contact-items">
            <p>
              <i className="bi bi-envelope"></i> support@fuelup.com
            </p>
            <p>
              <i className="bi bi-telephone"></i> +39 02 1234 5678
            </p>
            <p>
              <i className="bi bi-clock"></i> Lun - Ven, 09:00 - 18:00
            </p>
          </div>
        </section>
      </div>
    </section>
  );
}
