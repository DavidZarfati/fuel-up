import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "cart";

// carica dal localStorage
function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  // ✅ carrello iniziale dal localStorage
  const [cart, setCart] = useState(() => loadCart());

  // ✅ salva su localStorage quando cambia
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch { }
  }, [cart]);

  // sync tra schede (quando cambia localStorage in un’altra tab)
  useEffect(() => {
    function onStorage(e) {
      if (e.key === STORAGE_KEY) {
        try {
          setCart(e.newValue ? JSON.parse(e.newValue) : []);
        } catch {
          setCart([]);
        }
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // 👉 aggiunge al carrello (o aumenta qty)
  function addToCart(product) {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);

      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity ?? 1) + 1 }
            : item
        );
      }

      return [...prevCart, { ...product, quantity: 1 }];
    });

    // alert(`${product.name} aggiunto al carrello 🛒`);
  }

  // 👉 aumenta qty di un prodotto (se vuoi un tasto +)
  function increaseQuantity(productId) {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: (item.quantity ?? 1) + 1 }
          : item
      )
    );
  }

  // 👉 diminuisce qty (se arriva a 0 lo elimina)
  function decreaseQuantity(productId) {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: (item.quantity ?? 1) - 1 }
            : item
        )
        .filter((item) => (item.quantity ?? 1) > 0)
    );
  }

  // rimuove dal carrello
  function removeFromCart(productId) {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  }

  // svuota tutto
  function clearCart() {
    setCart([]);
  }

  // totali
  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + (item.quantity ?? 1), 0),
    [cart]
  );

  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => {
      const priceToSum = (Number(item.discount_price) > 0 && Number(item.discount_price) < Number(item.price))
        ? Number(item.discount_price)
        : Number(item.price);
      return sum + priceToSum * (item.quantity ?? 1);
    }, 0),
    [cart]
  );

  const totalWeight = useMemo(() => {
    return cart
      .reduce((sum, item) => sum + (item.weight_kg ?? 0) * (item.quantity ?? 1), 0);
  }, [cart]);

  const expeditionCost = useMemo(() => {
    if (totalPrice >= 100) return 0;
    return (3 + 0.15 * totalWeight);
  }, [totalPrice, totalWeight]);

  const value = {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
    totalWeight,
    expeditionCost
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// hook custom
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve essere usato dentro <CartProvider>");
  return ctx;
}
