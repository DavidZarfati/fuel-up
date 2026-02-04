import axios from "axios";
import { useState } from "react";
import "./HomePage.css";


export default function HomePage() {
    const arrayTestCard = [{
        title: "",
        image: "",
        description: "",
        categories: ""
    }, {
        title: "",
        image: "",
        description: "",
        categories: ""
    }, {
        title: "",
        image: "",
        description: "",
        categories: ""
    }, {
        title: "",
        image: "",
        description: "",
        categories: ""
    }, {
        title: "",
        image: "",
        description: "",
        categories: ""
    }, {
        title: "",
        image: "",
        description: "",
        categories: ""
    }];

    return (
        <>
            <section className="home-container">
                <div className="hero-section">

                </div>
                <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-4">
                        <div className="card mb-3">
                            <div className="row no-gutters">
                                <div className="col-md-4">
                                    <img src="/img/integratori.webp" className="card-img" alt="..." />
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body">
                                        <h5 className="card-title">Card title</h5>
                                        <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                        <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </>
    );
}