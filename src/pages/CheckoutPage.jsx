import { useState } from "react";
import { useCart } from "../context/CartContext";
import "./CheckoutPage.css"


export default function CheckoutPage() {

  const { cart, totalPrice, expeditionCost, clearCart } = useCart();

  const [errorMessage, setErrorMessage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    nation: "",
    street_number: "",
    fiscal_code: ""
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    return /^\+?\d{6,15}$/.test(phone);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    console.log(cart);

    let error = false;
    let errors = [];

    if (!formData.name) {
      errors.push("Name is missing");
      error = true;
    }
    if (!formData.surname) {
      errors.push("Surname is missing");
      error = true;
    }
    if (!formData.email) {
      errors.push("Email is missing");
      error = true;
    } else if (!isValidEmail(formData.email)) {
      errors.push("Email is not valid");
      error = true;
    }
    if (!formData.phone) {
      errors.push("Phone number is missing");
      error = true;
    } else if (!isValidPhone(formData.phone)) {
      errors.push("Phone number is not valid");
      error = true;
    }
    if (!formData.address) {
      errors.push("Address is missing");
      error = true;
    }
    if (!formData.city) {
      errors.push("City is missing");
      error = true;
    }
    if (!formData.postal_code) {
      errors.push("Postal code is missing");
      error = true;
    }
    if (!formData.nation) {
      errors.push("Nation is missing");
      error = true;
    }
    if (!formData.street_number) {
      errors.push("Street number is missing");
      error = true;
    }
    if (!formData.fiscal_code) {
      errors.push("Fiscal code is missing");
      error = true;
    }

    if (error) {
      setErrorMessage(errors);
      return; // stop submission if there are errors
    }

    setErrorMessage(null);

    const items = cart.map(item => ({
      slug: item.slug,
      amount: item.quantity
    }));


    const orderData = {
      name: formData.name,
      surname: formData.surname,
      email: formData.email,
      nation: formData.nation,
      city: formData.city,
      postal_code: formData.postal_code,
      phone_number: formData.phone,
      address: formData.address,
      street_number: formData.street_number || "",
      fiscal_code: formData.fiscal_code || "",
      items: items
    };

    //console.log("Sending orderData:", JSON.stringify(orderData, null, 2));

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errData = await response.json();
        setErrorMessage([errData.message || "Something went wrong"]);
        return;
      }

      const data = await response.json();
      alert("Order submitted successfully");

      setFormData({
        name: "",
        surname: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postal_code: "",
        nation: "",
        street_number: "",
        fiscal_code: ""
      });

      clearCart();

    } catch (err) {
      console.error(err);
      setErrorMessage([err.message || "Network error"]);
    }
  }

  return (
    <div className="container my-4">

      <h2>Checkout</h2>

      <div className="row">

        {/* FORM */}
        <div className="col-md-7">

          <form onSubmit={handleSubmit}>

            <input className="form-control mb-2" name="name" placeholder="Nome" onChange={handleChange} value={formData.name} />
            <input className="form-control mb-2" name="surname" placeholder="Cognome" onChange={handleChange} value={formData.surname} />
            <input className="form-control mb-2" name="email" placeholder="Email" onChange={handleChange} value={formData.email} />
            <input className="form-control mb-2" name="phone" placeholder="Telefono" onChange={handleChange} value={formData.phone} />
            <input className="form-control mb-3" name="nation" placeholder="Nazione" onChange={handleChange} value={formData.nation} />
            <input className="form-control mb-2" name="city" placeholder="Città" onChange={handleChange} value={formData.city} />
            <input className="form-control mb-2" name="postal_code" placeholder="CAP" onChange={handleChange} value={formData.postal_code} />
            <input className="form-control mb-2" name="address" placeholder="Indirizzo" onChange={handleChange} value={formData.address} />
            <input className="form-control mb-3" name="street_number" placeholder="Numero civico" onChange={handleChange} value={formData.street_number} />
            <input className="form-control mb-3" name="fiscal_code" placeholder="Codice fiscale" onChange={handleChange} value={formData.fiscal_code} />

            {errorMessage && errorMessage.map((err, idx) => (
              <p key={idx} className="errorMessage">{err}</p>
            ))}

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

              <p>Totale articoli: €{Number(totalPrice).toFixed(2)}</p>

              <hr />

              <p>Totale spedizione: &euro;{Number(expeditionCost).toFixed(2)}</p>

              <hr />

              <h5>Totale: €{Number(totalPrice + expeditionCost).toFixed(2)}</h5>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
