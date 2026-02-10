import "./HomePage.css";

export default function AboutUsPage() {
    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-12">
                    <h1 className="display-4 mb-4 text-center">Chi Siamo</h1>
                    <div className="card shadow-sm">
                        <div className="card-body p-4 p-md-5">
                            <h2 className="h3 mb-4">Benvenuti in FuelUp</h2>
                            <p className="lead mb-4">
                                FuelUp è il tuo partner di fiducia per l'integrazione sportiva e il benessere fisico.
                            </p>
                            <p className="mb-4">
                                Da anni ci dedichiamo a fornire prodotti di altissima qualità per atleti, 
                                appassionati di fitness e chiunque desideri migliorare le proprie prestazioni fisiche. 
                                La nostra missione è supportare il tuo percorso verso il raggiungimento degli obiettivi, 
                                offrendo integratori sicuri, efficaci e scientificamente testati.
                            </p>
                            
                            <h3 className="h4 mb-3 mt-5">La Nostra Filosofia</h3>
                            <p className="mb-4">
                                Crediamo che ogni persona meriti il meglio per il proprio corpo. Per questo motivo, 
                                selezioniamo con cura ogni prodotto del nostro catalogo, privilegiando la qualità, 
                                la trasparenza e l'efficacia. Ogni integratore che trovi su FuelUp è stato 
                                attentamente scelto per garantire risultati concreti e sicurezza.
                            </p>

                            <h3 className="h4 mb-3 mt-5">I Nostri Valori</h3>
                            <ul className="list-unstyled mb-4">
                                <li className="mb-2">✓ <strong>Qualità:</strong> Solo prodotti testati e certificati</li>
                                <li className="mb-2">✓ <strong>Trasparenza:</strong> Informazioni chiare su ogni prodotto</li>
                                <li className="mb-2">✓ <strong>Passione:</strong> Amore per lo sport e il benessere</li>
                                <li className="mb-2">✓ <strong>Supporto:</strong> Assistenza dedicata ai nostri clienti</li>
                            </ul>

                            <h3 className="h4 mb-3 mt-5">Il Nostro Team</h3>
                            <p className="mb-4">
                                Il team di FuelUp è composto da esperti del settore, atleti e nutrizionisti 
                                che condividono la stessa passione per lo sport e il benessere. Siamo sempre 
                                disponibili per consigliarti il prodotto più adatto alle tue esigenze.
                            </p>

                            <div className="alert alert-info mt-5">
                                <h4 className="h5 mb-3">Contattaci</h4>
                                <p className="mb-0">
                                    Hai domande o hai bisogno di consigli? Non esitare a contattarci. 
                                    Siamo qui per aiutarti a raggiungere i tuoi obiettivi!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}