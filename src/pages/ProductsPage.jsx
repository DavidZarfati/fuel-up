import axios from "axios";
import { useEffect, useState } from "react";




export default function ProductsPage() {


    const [products, setProducts] = useState([]);
    const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;


    useEffect(() => {

        axios
            .get(`${backendBaseUrl}/api/products`)
            .then((resp) => {
                setProducts(resp.data.results);
            })
            .catch((err) => {
                console.log(err);
            });


    }, []);



    return (
        <div className="products-container">

            <div className="products-grid">
                {products.map((product) => (

                    <div className="movies-grid" key={product.id}>
                        <SingleProductCard product={product} />
                    </div>

                ))}
            </div>

        </div>
    );
}