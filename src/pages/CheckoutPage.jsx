import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./CheckoutPage.css"


export default function CheckoutPage() {

  const { cart, totalPrice, expeditionCost, clearCart } = useCart();

  const [errorMessage, setErrorMessage] = useState([]);
  const [submitting, setSubmitting] = useState(false);

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

  const navigate = useNavigate();

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

  function isValidCAP(cap) {
    return /^\d{5}$/.test(cap);
  }

  function isValidFiscalCode(fiscal_code) {
    return /^[A-Za-z]{6}[0-9]{2}[A-Za-z][0-9]{2}[A-Za-z][0-9]{3}[A-Za-z]$/.test(fiscal_code);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if(submitting)
    {
      //Is already submitting
      return;
    }

    setSubmitting(true);

    //console.log(cart);

    let errorList = [];

    if (!formData.name) {
      errorList.push({field: "name", message: "Il nome è assente"});
    }
    if (!formData.surname) {
      errorList.push({field: "surname", message: "Il cognome è assente"});
    }
    if (!formData.email) {
      errorList.push({field: "email", message: "L'email è assente"});
    } else if (!isValidEmail(formData.email)) {
      errorList.push({field: "email", message: "L'email inserita non è valida"});
    }
    if (!formData.phone) {
      errorList.push({field: "phone_number", message: "Il numero di telefono è assente"});
    } else if (!isValidPhone(formData.phone)) {
      errorList.push({field: "phone_number", message: "Il numero di telefono non è valido"});
    }
    if(!formData.fiscal_code) {
      errorList.push({field: "fiscal_code", message: "Il codice fiscale è assente"});
    }
    else if (!isValidFiscalCode(formData.fiscal_code)) {
      errorList.push({field: "fiscal_code", message: "Il codice fiscale non è valido"});
    }
    if (!formData.nation) {
      errorList.push({field: "nation", message: "La nazione è assente"});
    }
    if (!formData.city) {
      errorList.push({field: "city", message: "La città è assente"});
    }
    if (!formData.postal_code) {
      errorList.push({field: "postal_code", message: "Il CAP è assente"});
    }
    else if (!isValidCAP(formData.postal_code)) {
      errorList.push({field: "postal_code", message: "Il CAP non è valido"});
    }
    if (!formData.address) {
      errorList.push({field: "address", message: "L'indirizzo è assente"});
    }
    if (!formData.street_number) {
      errorList.push({field: "street_number", message: "Il numero civico è assente"});
    }

    //console.log(errorList);

    //setErrors(errorList);

    if (errorList.length > 0) {
      setErrorMessage(errorList);
      setSubmitting(false);
      return; // stop submission if there are errors
    }

    setErrorMessage([]);

    const items = cart.map(item => ({
      slug: item.slug,
      amount: item.quantity
    }));


    const orderData = {
      name: formData.name.trim(),
      surname: formData.surname.trim(),
      email: formData.email.trim(),
      nation: formData.nation.trim(),
      city: formData.city.trim(),
      postal_code: formData.postal_code.trim(),
      phone_number: formData.phone.trim(),
      address: formData.address.trim(),
      street_number: formData.street_number.trim(),
      fiscal_code: formData.fiscal_code.toUpperCase().trim(),
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
        setSubmitting(false);
        return;
      }

      const data = await response.json();
      //alert("Order submitted successfully");
      
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
      navigate("/thank-you");

    } catch (err) {
      console.error(err);
      setErrorMessage([err.message || "Network error"]);
    }
    finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container my-4">

      <h2>Checkout</h2>

      <div className="row">

        {/* FORM */}
        <div className="col-md-7">

          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Nome</label>
            <input className="form-control" id="name" name="name" placeholder="Mario" onChange={handleChange} value={formData.name}/>
            {errorMessage.some(e => e.field === "name") && <p className="errorMessage">{errorMessage.find(e => e.field === "name").message}</p>}
            <label htmlFor="surname">Cognome</label>
            <input className="form-control" id="surname" name="surname" placeholder="Rossi" onChange={handleChange}  value={formData.surname}/>
            {errorMessage.some(e => e.field === "surname") && <p className="errorMessage">{errorMessage.find(e => e.field === "surname").message}</p>}
            <label htmlFor="email">Email</label>
            <input className="form-control" id="email" name="email" placeholder="mariorossi@gmail.com" onChange={handleChange}  value={formData.email}/>
            {errorMessage.some(e => e.field === "email") && <p className="errorMessage">{errorMessage.find(e => e.field === "email").message}</p>}
            <label htmlFor="phone">Numero di telefono</label>
            <input className="form-control" id="phone" name="phone" placeholder="3334942030" onChange={handleChange}  value={formData.phone}/>
            {errorMessage.some(e => e.field === "phone_number") && <p className="errorMessage">{errorMessage.find(e => e.field === "phone_number").message}</p>}
            <label htmlFor="fiscal_code">Codice fiscale</label>
            <input className="form-control text-uppercase" id="fiscal_code" name="fiscal_code" placeholder="RSSMRA00T01H501P" onChange={handleChange}  value={formData.fiscal_code}/>
            {errorMessage.some(e => e.field === "fiscal_code") && <p className="errorMessage">{errorMessage.find(e => e.field === "fiscal_code").message}</p>}
            <label htmlFor="nation">Nazione</label>
            <input className="form-control" id="nation" name="nation" placeholder="Italia" onChange={handleChange}  value={formData.nation}/>
            {errorMessage.some(e => e.field === "nation") && <p className="errorMessage">{errorMessage.find(e => e.field === "nation").message}</p>}
            <label htmlFor="city">Città</label>
            <input className="form-control" id="city" name="city" placeholder="Roma" onChange={handleChange}  value={formData.city}/>
            {errorMessage.some(e => e.field === "city") && <p className="errorMessage">{errorMessage.find(e => e.field === "city").message}</p>}
            <label htmlFor="postal_code">CAP</label>
            <input className="form-control" id="postal_code" name="postal_code" placeholder="00000" onChange={handleChange}  value={formData.postal_code}/>
            {errorMessage.some(e => e.field === "postal_code") && <p className="errorMessage">{errorMessage.find(e => e.field === "postal_code").message}</p>}
            <label htmlFor="address">Indirizzo</label>
            <input className="form-control" id="address" name="address" placeholder="Via Rossi" onChange={handleChange}  value={formData.address}/>
            {errorMessage.some(e => e.field === "address") && <p className="errorMessage">{errorMessage.find(e => e.field === "address").message}</p>}
            <label htmlFor="street_number">Numero civico</label>
            <input className="form-control"id="street_number" name="street_number" placeholder="21" onChange={handleChange}  value={formData.street_number}/>
            {errorMessage.some(e => e.field === "street_number") && <p className="errorMessage">{errorMessage.find(e => e.field === "street_number").message}</p>}

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
                  <span>&euro;{(item.discount_price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              <hr />

              <p>Totale articoli: &euro;{Number(totalPrice).toFixed(2)}</p>

              <hr />

              <p>Totale spedizione: &euro;{Number(expeditionCost).toFixed(2)}</p>

              <hr />

              <h5>Totale: &euro;{Number(totalPrice + expeditionCost).toFixed(2)}</h5>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
