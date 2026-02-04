import axios from "axios";
import { useState } from "react";
import "./HomePage.css";


export default function HomePage() {
    const arrayTestCard = [{
        title: "casein vanilla serving",
        image: "../assets/testimages/image/casein-vanilla-serving.jpg",
        description: "una porzione di proteine casearie alla vanilla",
        categories: "protein,integration,natural"
    }, {
        title: "beta alanine scoop",
        image: "../assets/testimages/image/beta-alanine-scoop.jpg",
        description: "uno scoop di beta alanina",
        categories: "protein,integration,science"
    }, {
        title: "beta alanine scoop",
        image: "../assets/testimages/image/casein-vanilla-serving.jpg",
        description: "uno scoop di beta alanina",
        categories: "protein,integration,science"
    }, {
        title: "beta alanine scoop",
        image: "../assets/testimages/image/beta-alanine-scoop.jpg",
        description: "uno scoop di beta alanina",
        categories: "protein,integration,science"
    }, {
        title: "beta alanine scoop",
        image: "../assets/testimages/image/casein-vanilla-serving.jpg",
        description: "uno scoop di beta alanina",
        categories: "protein,integration,science"
    }, {
        title: "beta alanine scoop",
        image: "../assets/testimages/image/beta-alanine-scoop.jpg",
        description: "uno scoop di beta alanina",
        categories: "protein,integration,science"
    }];

    return (
        <>
            <section className="ot-home-container">
                <div className="ot-hero-section">

                </div>
                <div className="d-flex container">
                    <div class="row">
                        {arrayTestCard.map((card, idx) => (
                            <div className="col-sm-12 col-md-6 col-lg-4" key={idx}>
                                <div className="card mb-3">
                                    <div className="row no-gutters">
                                        <div className="col-md-4">
                                            <img src={card.image} className="card-img" alt={card.title} />
                                        </div>
                                        <div className="col-md-8">
                                            <div className="card-body">
                                                <h5 className="card-title">{card.title}</h5>
                                                <p className="card-text">{card.description}</p>
                                                <p className="card-text">{card.categories}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section >
        </>
    );
}