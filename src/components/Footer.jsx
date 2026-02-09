import "bootstrap/dist/css/bootstrap.css"
import "./footer.css"
import logo from "../assets/images/logo.jpg";
import 'bootstrap-icons/font/bootstrap-icons.css'


export default function Footer() {
    return (
        <>
            <div className="d-flex justify-content-between dz-bordi-footer dz-bg-footer">
                <div className="">
                    <ul>
                        {/* <h2><img className="dz-logo-footer" src={logo} alt="Logo FuelUp" /></h2> */}
                        <img className="dz-logo-footer ml-logo-footer" src={logo} alt="Logo FuelUp" />
                        <li>Via esempio,1234</li>
                        <li>Selling Products is: Fitness</li>
                    </ul>
                </div>
                <div className="">
                    <ul>
                        <h2>I nostri Servizi</h2>
                        <li>Integratori</li>
                        <li>Abbigliamento</li>
                        <li>Pesi</li>
                        <li>Corsi Fitness</li>
                    </ul>
                </div>
                <div className="ay-sociaol-footer">
                    <ul>
                        <h2>I nostri Social</h2>
                        <li><i className="bi bi-facebook"></i><a id="link" href="https://drawsql.app/teams/david-zarfati/diagrams/books" target="_blank" rel="noopener noreferrer">fuelUp_facebook</a></li>
                        <li><i className="bi bi-instagram"></i><a id="link" href="http://" target="_blank" rel="noopener noreferrer">fuelUp_official</a></li>
                        <li><i className="bi bi-pinterest"></i><a id="link" href="http://" target="_blank" rel="noopener noreferrer">fuelUp_pinterest</a></li>
                        <li><i className="bi bi-twitter-x"></i><a id="link" href="http://" target="_blank" rel="noopener noreferrer">fuelUp_x</a></li>
                        <li><i className="bi bi-tiktok"></i><a id="link" href="http://" target="_blank" rel="noopener noreferrer">fuelUp_tikTok</a></li>
                    </ul>
                </div>
            </div>
        </>
    )
}
