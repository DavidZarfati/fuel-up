import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";


export default function CartPage() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
    totalWeight,
    expeditionCost
  } = useCart();
  //console.log(cart);
  //console.log(cart[0].weight_kg);
  //console.log(cart[0].quantity);
  // let totalWeight = 0;
  // for(let i in cart)
  // {
  //   totalWeight = cart[i].weight_kg * cart[i].quantity; 
  // }
  //console.log(totalWeight);
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;

  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
            <h4 className="mb-0">Carrello</h4>
            <span className="badge bg-secondary align-self-start align-self-sm-auto">
              Articoli: {totalItems}
            </span>
          </div>

          {cart.length === 0 ? (
            <p className="text-muted text-center mb-0">Il carrello è vuoto</p>
          ) : (
            <>
              <ul className="list-group list-group-flush mb-3">
                {cart.map((item) => (
                  <li key={item.id} className="list-group-item">
                    <div className="row align-items-center g-2">
                      {/* Sinistra: immagine + info */}
                      <div className="col-12 col-md-6">
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={`${backendBaseUrl}${item.image}`}
                            alt={item.name}
                            className="rounded flex-shrink-0"
                            style={{ width: 64, height: 64, objectFit: "cover" }}
                          />

                          <div className="min-w-0">
                            <div className="fw-semibold text-truncate">
                              {item.name}
                            </div>
                            <div className="text-muted small">
                              <span className="dz-prodotto-senza-sconto">€{Number(item.price).toFixed(2)}</span>
                              <span className="dz-prezzo-scontato"> €{Number(item.discount_price).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Centro: quantità */}
                      <div className="col-12 col-md-3">
                        <div className="d-flex justify-content-start justify-content-md-center align-items-center gap-2">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => decreaseQuantity(item.id)}
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>

                          <span className="fw-semibold">{item.quantity}</span>

                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => increaseQuantity(item.id)}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Destra: bottone rimuovi */}
                      <div className="col-12 col-md-3">
                        <div className="d-grid d-md-flex justify-content-md-end">
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Rimuovi
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <hr />

              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
                <h5 className="mb-0">
                  Totale: &euro;{Number(totalPrice).toFixed(2)}
                </h5>

                <h5>
                  Costi di spedizione: &euro;{expeditionCost.toFixed(2)}
                </h5>

                <div className="d-grid d-sm-flex gap-2">
                  <button className="btn btn-outline-danger" onClick={clearCart}>
                    Svuota carrello
                  </button>

                  <Link to="/checkout" className="btn btn-primary">
                    Checkout
                  </Link>

                </div>
              </div>
              {totalPrice < 100.00 ? <small>Gli ordini di &euro;100 o più hanno diritto alla spedizione gratuita</small> : <></>}
            </>
          )}
        </div>
      </div>
    </div>

  );
}
