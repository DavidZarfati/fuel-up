import { createContext, useContext, useEffect, useState } from "react";

const FavouritesContext = createContext(null);
const STORAGE_KEY = "favourites";

// carica dal localStorage
function loadFavourites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getProductKey(product) {
  return product?.id ?? product?.product_id ?? product?.slug;
}


export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState(() => loadFavourites());

  // salva su localStorage quando cambia
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    } catch { }
  }, [favourites]);

  // sync tra schede
  useEffect(() => {
    function onStorage(e) {
      if (e.key === STORAGE_KEY) {
        try {
          setFavourites(e.newValue ? JSON.parse(e.newValue) : []);
        } catch {
          setFavourites([]);
        }
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // aggiungi ai preferiti
  function addToFavourites(product) {
    const key = getProductKey(product);

    setFavourites((prevFavourites) => {
      const existing = prevFavourites.find(
        (item) => getProductKey(item) === key
      );
      if (existing) {
        return prevFavourites;
      }
      return [...prevFavourites, product];
    });
  }


  // rimuovi dai preferiti
  function removeFromFavourites(product) {
    const key = getProductKey(product);

    setFavourites((prevFavourites) =>
      prevFavourites.filter(
        (item) => getProductKey(item) !== key
      )
    );
  }


  // svuota tutti i preferiti
  function clearFavourites() {
    setFavourites([]);
  }


  // verifica se un prodotto è nei preferiti
  function isFavourite(product) {
    const key = typeof product === "object"
      ? getProductKey(product)
      : product;

    return favourites.some(
      (item) => getProductKey(item) === key
    );
  }


  // toggle preferito
  function toggleFavourite(product) {
    if (isFavourite(product)) {
      removeFromFavourites(product);
    } else {
      addToFavourites(product);
    }
  }


  const value = {
    favourites,
    addToFavourites,
    removeFromFavourites,
    clearFavourites,
    isFavourite,
    toggleFavourite,
  };

  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  );
}

// hook custom
export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error("useFavourites deve essere usato dentro <FavouritesProvider>");
  return ctx;
}