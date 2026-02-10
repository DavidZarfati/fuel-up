import "bootstrap/dist/css/bootstrap.css";
import "./Footer.css";
import logo from "../assets/images/logo.jpg";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Footer() {
    return (
        <>
            <footer className="ot-footer">
                <div className="ot-footer-content">
                    
                    <div className="ot-footer-column">
                        <img
                            className="ot-footer-logo"
                            src={logo}
                            alt="Logo FuelUp"
                        />
                        <ul className="ot-footer-list">
                            <li>Via esempio,1234</li>
                            <li>Selling Products is: Fitness</li>
                        </ul>
                    </div>

                    <div className="ot-footer-column">
                        <h2 className="ot-footer-title">I nostri Servizi</h2>
                        <ul className="ot-footer-list">
                            <li>Integratori</li>
                            <li>Abbigliamento</li>
                            <li>Pesi</li>
                            <li>Corsi Fitness</li>
                        </ul>
                    </div>

                    <div className="ot-footer-column">
                        <h2 className="ot-footer-title">I nostri Social</h2>
                        <ul className="ot-footer-list ot-footer-social">
                            <li><i className="bi bi-facebook"></i><a href="#">fuelUp_facebook</a></li>
                            <li><i className="bi bi-instagram"></i><a href="#">fuelUp_official</a></li>
                            <li><i className="bi bi-pinterest"></i><a href="#">fuelUp_pinterest</a></li>
                            <li><i className="bi bi-twitter-x"></i><a href="#">fuelUp_x</a></li>
                            <li><i className="bi bi-tiktok"></i><a href="#">fuelUp_tikTok</a></li>
                        </ul>
                    </div>

                </div>
            </footer>
        </>
    );
}
