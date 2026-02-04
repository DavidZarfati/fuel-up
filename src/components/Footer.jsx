import "bootstrap/dist/css/bootstrap.css"
import "./footer.css"
import logo from "../assets/images/logo.jpg";


export default function Footer() {
    return (
        <>
            <div className="d-flex justify-content-between dz-bordi-footer dz-bg-footer">
                <div className="">
                    <ul>
                        <h2><img className="dz-logo-footer" src={logo} alt="Logo FuelUp" /></h2>
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
                <div className="">
                    <ul>
                        <h2>I nostri Social</h2>
                        <li>Facebook: <a id="link" href="https://drawsql.app/teams/david-zarfati/diagrams/books" target="_blank" rel="noopener noreferrer">FuelUp</a></li>
                        <li>Instagram: <a id="link" href="http://" target="_blank" rel="noopener noreferrer">FuelUp_Official</a></li>
                        <li>pinterest: <a id="link" href="http://" target="_blank" rel="noopener noreferrer">FuelUp_Pinterest</a></li>
                    </ul>
                </div>
            </div>
        </>
    )
}