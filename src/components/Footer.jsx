import "bootstrap/dist/css/bootstrap.css"
import "./footer.css"
import logo from "../assets/images/logo.jpg";
import 'bootstrap-icons/font/bootstrap-icons.css'


export default function Footer() {
  return (
    <footer className="dz-bordi-footer dz-bg-footer py-4 mt-5">
      <div className="container">
        <div className="row gy-4">

          {/* COL 1 */}
          <div className="col-12 col-md-6 col-lg-4">
            <h2 className="mb-3">
              <img className="dz-logo-footer img-fluid" src={logo} alt="Logo FuelUp" />
            </h2>
            <ul className="list-unstyled mb-0">
              <li>Via esempio, 1234</li>
              <li>Selling Products is: Fitness</li>
            </ul>
          </div>

          {/* COL 2 */}
          <div className="col-12 col-md-6 col-lg-4">
            <h2 className="mb-3">I nostri Servizi</h2>
            <ul className="list-unstyled mb-0">
              <li>Integratori</li>
              <li>Abbigliamento</li>
              <li>Pesi</li>
              <li>Corsi Fitness</li>
            </ul>
          </div>

          {/* COL 3 */}
          <div className="col-12 col-lg-4">
            <h2 className="mb-3">I nostri Social</h2>
            <ul className="list-unstyled mb-0">
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-facebook"></i>
                <a className="text-decoration-none" href="https://drawsql.app/teams/david-zarfati/diagrams/books" target="_blank" rel="noopener noreferrer">
                  fuelUp_facebook
                </a>
              </li>

              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-instagram"></i>
                <a className="text-decoration-none" href="http://" target="_blank" rel="noopener noreferrer">
                  fuelUp_official
                </a>
              </li>

              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-pinterest"></i>
                <a className="text-decoration-none" href="http://" target="_blank" rel="noopener noreferrer">
                  fuelUp_pinterest
                </a>
              </li>

              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-twitter-x"></i>
                <a className="text-decoration-none" href="http://" target="_blank" rel="noopener noreferrer">
                  fuelUp_x
                </a>
              </li>

              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-tiktok"></i>
                <a className="text-decoration-none" href="http://" target="_blank" rel="noopener noreferrer">
                  fuelUp_tikTok
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Riga sotto opzionale */}
        <hr className="my-4" />
        <p className="mb-0 text-center small">
          © {new Date().getFullYear()} FuelUp — Tutti i diritti riservati
        </p>
      </div>
    </footer>
  );
}
