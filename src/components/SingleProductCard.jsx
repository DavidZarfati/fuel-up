
import { Link } from "react-router-dom";



export default function SingleProductCard({ product }) {

    const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;



    return (
        <div className="product-card">

            <div className="card-img">
                <img
                    src={`${backendBaseUrl}/imgs/${product.image}`}
                    alt={product.title}
                />
            </div>

            <div className="card-info">
                {/* da aggiungere i dati del prodotto */}



                <div className="flex">
                    <Link to={`/products/${product.slug}`} className="seeDetailsBtn">
                        See details
                    </Link>
                </div>
            </div>

        </div>
    );
}