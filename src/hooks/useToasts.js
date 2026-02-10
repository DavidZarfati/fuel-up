import { useEffect, useState } from "react";

export function useToasts() {
  const [toast, setToast] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const [favToast, setFavToast] = useState(null);
  const [showFavToast, setShowFavToast] = useState(false);

  useEffect(() => {
    if (toast && showToast) {
      const timer = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast, showToast]);

  useEffect(() => {
    if (favToast && showFavToast) {
      const timer = setTimeout(() => setShowFavToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [favToast, showFavToast]);

  function fireCartToast(payload) {
    setToast(payload);
    setShowToast(true);
  }

  function fireFavToast(payload) {
    setFavToast(payload);
    setShowFavToast(true);
  }

  return {
    toast,
    showToast,
    setShowToast,
    fireCartToast,

    favToast,
    showFavToast,
    setShowFavToast,
    fireFavToast,
  };
}
