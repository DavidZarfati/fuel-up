import "./HeroVideoSection.css";

export default function HeroVideoSection() {
  return (
    <section className="hero-video-section surface-card" aria-label="Hero video">
      <div className="hero-video-copy">
        <p className="hero-video-brand">FuelUp</p>
        <p className="hero-video-tagline">Alimento la tua performance</p>
      </div>
      <video
        className="hero-video-media"
        src="/videos/home-hero.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
    </section>
  );
}
