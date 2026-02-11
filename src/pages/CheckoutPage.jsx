import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import EmptyState from "../components/EmptyState";
import "./CheckoutPage.css";

function formatPrice(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "EUR 0.00";
  return `EUR ${amount.toFixed(2)}`;
}

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
    fiscal_code: "",
  });
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  function isValidFiscalCode(fiscalCode) {
    return /^[A-Za-z]{6}[0-9]{2}[A-Za-z][0-9]{2}[A-Za-z][0-9]{3}[A-Za-z]$/.test(fiscalCode);
  }

  function getError(field) {
    const error = errorMessage.find((item) => item.field === field);
    return error ? <p className="checkout-error">{error.message}</p> : null;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const errorList = [];
    if (!formData.name) errorList.push({ field: "name", message: "Il nome è assente" });
    if (!formData.surname) errorList.push({ field: "surname", message: "Il cognome è assente" });
    if (!formData.email) errorList.push({ field: "email", message: "L'email è assente" });
    else if (!isValidEmail(formData.email)) errorList.push({ field: "email", message: "L'email non è valida" });
    if (!formData.phone) errorList.push({ field: "phone_number", message: "Il numero di telefono è assente" });
    else if (!isValidPhone(formData.phone)) errorList.push({ field: "phone_number", message: "Il numero di telefono non è valido" });
    if (!formData.fiscal_code) errorList.push({ field: "fiscal_code", message: "Il codice fiscale è assente" });
    else if (!isValidFiscalCode(formData.fiscal_code)) errorList.push({ field: "fiscal_code", message: "Il codice fiscale non è valido" });
    if (!formData.nation) errorList.push({ field: "nation", message: "La nazione è assente" });
    if (!formData.city) errorList.push({ field: "city", message: "La citta è assente" });
    if (!formData.postal_code) errorList.push({ field: "postal_code", message: "Il CAP è assente" });
    else if (!isValidCAP(formData.postal_code)) errorList.push({ field: "postal_code", message: "Il CAP non è valido" });
    if (!formData.address) errorList.push({ field: "address", message: "L'indirizzo e assente" });
    if (!formData.street_number) errorList.push({ field: "street_number", message: "Il numero civico è assente" });

    if (errorList.length > 0) {
      setErrorMessage(errorList);
      setSubmitting(false);
      return;
    }

    setErrorMessage([]);

    const items = cart.map((item) => ({ slug: item.slug, amount: item.quantity }));
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
      items,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage([{ field: "global", message: errorData.message || "Something went wrong" }]);
        setSubmitting(false);
        return;
      }

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
        fiscal_code: "",
      });

      clearCart();
      navigate("/thank-you");
    } catch (error) {
      setErrorMessage([{ field: "global", message: error.message || "Network error" }]);
    } finally {
      setSubmitting(false);
    }
  }

  if (cart.length === 0) {
    return (
      <section className="page-section">
        <div className="app-container">
          <EmptyState
            icon="bi bi-bag"
            title="Carrello vuoto"
            description="Aggiungi prodotti al carrello prima di procedere al checkout."
            ctaLabel="Vai ai prodotti"
            ctaTo="/products"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="app-container">
        <div className="surface-card checkout-header">
          <h1 className="title-lg">Checkout</h1>
          <p className="text-muted">Completa i tuoi dati per finalizzare l'ordine.</p>
        </div>

        <div className="checkout-layout">
          <form className="surface-card checkout-form" onSubmit={handleSubmit}>
            {getError("global")}

            <div className="checkout-field-grid">
              <div>
                <label htmlFor="name">Nome</label>
                <input className="input-ui" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Mario" />
                {getError("name")}
              </div>
              <div>
                <label htmlFor="surname">Cognome</label>
                <input className="input-ui" id="surname" name="surname" value={formData.surname} onChange={handleChange} placeholder="Rossi" />
                {getError("surname")}
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input className="input-ui" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="nome@email.com" />
                {getError("email")}
              </div>
              <div>
                <label htmlFor="phone">Telefono</label>
                <input className="input-ui" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+393331112223" />
                {getError("phone_number")}
              </div>
              <div>
                <label htmlFor="fiscal_code">Codice fiscale</label>
                <input className="input-ui uppercase" id="fiscal_code" name="fiscal_code" value={formData.fiscal_code} onChange={handleChange} placeholder="RSSMRA00T01H501P" />
                {getError("fiscal_code")}
              </div>
              <div>
                <label htmlFor="nation">Nazione</label>
                <input className="input-ui" id="nation" name="nation" value={formData.nation} onChange={handleChange} placeholder="Italia" />
                {getError("nation")}
              </div>
              <div>
                <label htmlFor="city">Citta</label>
                <input className="input-ui" id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Roma" />
                {getError("city")}
              </div>
              <div>
                <label htmlFor="postal_code">CAP</label>
                <input className="input-ui" id="postal_code" name="postal_code" value={formData.postal_code} onChange={handleChange} placeholder="00100" />
                {getError("postal_code")}
              </div>
              <div>
                <label htmlFor="address">Indirizzo</label>
                <input className="input-ui" id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Via Roma" />
                {getError("address")}
              </div>
              <div>
                <label htmlFor="street_number">Numero civico</label>
                <input className="input-ui" id="street_number" name="street_number" value={formData.street_number} onChange={handleChange} placeholder="21" />
                {getError("street_number")}
              </div>
            </div>

        <button type="submit" className="btn-ui btn-ui-primary checkout-submit neon-btn" disabled={submitting}>
          {submitting ? "Invio in corso..." : "Conferma ordine"}
        </button>
          </form>

          <aside className="surface-card checkout-summary">
            <h2>Riepilogo ordine</h2>
            {cart.map((item) => (
              <div key={item.id} className="checkout-summary-item">
                <span>{item.name} x{item.quantity}</span>
                <strong>{formatPrice(item.discount_price * item.quantity)}</strong>
              </div>
            ))}

            <div className="checkout-summary-total">
              <span>Totale articoli</span>
              <strong>{formatPrice(totalPrice)}</strong>
            </div>
            <div className="checkout-summary-total">
              <span>Spedizione</span>
              <strong>{formatPrice(expeditionCost)}</strong>
            </div>
            <div className="checkout-summary-final">
              <span>Totale finale</span>
              <strong>{formatPrice(totalPrice + expeditionCost)}</strong>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
