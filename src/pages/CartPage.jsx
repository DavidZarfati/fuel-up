import { useCart } from "../context/CartContext";

export default function CartPage() {

  const { cart } = useCart();

  return (
    <div>
      <h1>Carrello</h1>

      {cart.length === 0 ? (
        <p>Il carrello è vuoto</p>
      ) : (
        cart.map(item => (
          <div key={item.id}>
            <h3>{item.name}</h3>
            <p>Quantità: {item.quantity}</p>
          </div>
        ))
      )}

    </div>
  );
}