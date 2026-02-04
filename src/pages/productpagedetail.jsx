import { useEffect, useState } from "react"
import axios from "axios"
import { useGlobal } from "../context/GlobalContext";
import { useNavigate } from "react-router-dom";

export default function Productpagedetail () {
    


    const [product, setProduct] = useState()
    const {slug} = useParams();
    const {backendUrl} = useGlobal();
    const navigate = useNavigate();

    useEffect(()=>{
        getProduct();
    },[slug]);

    function getProduct(){
        axios.get(`${backendUrl}/api/products/${slug}`)
        .then((resp)=> {
            setProduct(resp.data)
            console.log(resp.data)
        })
        .catch((err)=>{
            console.log(err);
        })

    }
    function goBack(event) {
        event.preventDefault();
        navigate(-1);
    }


    return(
        <>
        {product.map((p)=>{
            return(
                <><h1>{p.name}</h1>
                <p>{p.description}</p>
                </>
            )
        })}



        </>
    )

}