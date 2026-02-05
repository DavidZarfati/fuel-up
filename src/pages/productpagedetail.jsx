// // import { useEffect, useState } from "react"
// // import axios from "axios"
// // import { useGlobal } from "../context/GlobalContext";
// // import { useNavigate } from "react-router-dom";

// // export default function Productpagedetail () {



// //     // const [product, setProduct] = useState()
// //     // const {slug} = useParams();
// //     // const {backendUrl} = useGlobal();
// //     // const navigate = useNavigate();

// //     // useEffect(()=>{
// //     //     getProduct();
// //     // },[slug]);

// //     // function getProduct(){
// //     //     axios.get(`${backendUrl}/api/products/${slug}`)
// //     //     .then((resp)=> {
// //     //         setProduct(resp.data)
// //     //         console.log(resp.data)
// //     //     })
// //     //     .catch((err)=>{
// //     //         console.log(err);
// //     //     })

// //     // }
// //     // function goBack(event) {
// //     //     event.preventDefault();
// //     //     navigate(-1);
// //     // }
// //    

// //     return(
// //         <>
// //         {Product.map((card, index)=>{
// //             return(
// //                 <>
// //                 <section >
// //                 <h1>{card.title}</h1>
// //                 <p>{card.description}</p>
// //                 </section>
// //                 </>
// //             )
// //         })}



// //         </>
// //     )

// // }


import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductPageDetail.css"

export default function Productpagedetail() {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${backendBaseUrl}/api/products/${slug}`)
            .then((resp) => {
                setProduct(resp.data);
                setLoading(false);
            })
            .catch((err) => {
                setError("Prodotto non trovato");
                setLoading(false);
            });
    }, [slug]);


    return (
        <>
            <h1>ti prego</h1>
        </>
    );
}
