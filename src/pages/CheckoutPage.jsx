import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {

  const { cart, totalPrice } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    nation: ""
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const orderData = {
      customer: formData,
      products: cart,
      total: totalPrice
    };

    console.log(orderData);
  }

  return (
    <div className="container my-4">

      <h2>Checkout</h2>

      <div className="row">

        {/* FORM */}
        <div className="col-md-7">

          <form onSubmit={handleSubmit}>

            <input className="form-control mb-2" name="name" placeholder="Nome" onChange={handleChange}/>
            <input className="form-control mb-2" name="surname" placeholder="Cognome" onChange={handleChange}/>
            <input className="form-control mb-2" name="email" placeholder="Email" onChange={handleChange}/>
            <input className="form-control mb-2" name="phone" placeholder="Telefono" onChange={handleChange}/>
            <input className="form-control mb-2" name="address" placeholder="Indirizzo" onChange={handleChange}/>
            <input className="form-control mb-2" name="city" placeholder="Città" onChange={handleChange}/>
            <input className="form-control mb-2" name="postal_code" placeholder="CAP" onChange={handleChange}/>
            <input className="form-control mb-3" name="nation" placeholder="Nazione" onChange={handleChange}/>

            <button className="btn btn-primary w-100">
              Conferma ordine
            </button>

          </form>

        </div>

        {/* RIEPILOGO */}
        <div className="col-md-5">

          <div className="card">
            <div className="card-body">

              <h5>Riepilogo ordine</h5>

              {cart.map(item => (
                <div key={item.id} className="d-flex justify-content-between mb-2">
                  <span>{item.name} x{item.quantity}</span>
                  <span>€{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              <hr />

              <h5>Totale: €{Number(totalPrice).toFixed(2)}</h5>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
