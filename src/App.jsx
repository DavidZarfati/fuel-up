import './App.css'
import DefaultLayout from './layouts/DefaultLayout';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SearchPage from './pages/SearchPage';
import FavouritePage from './pages/FavouritePage';
import ThankYouPage from "./pages/ThankYouPage";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GlobalProvider } from './context/GlobalContext';
import { CartProvider } from './context/CartContext';
import { FavouritesProvider } from './context/FavouritesContext';
import CartPage from './pages/CartPage';
import CheckoutPage from "./pages/CheckoutPage";



function App() {
  const nameApp = "FuelUp";
  return (
    <>
      <GlobalProvider>
        <CartProvider>
          <FavouritesProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<DefaultLayout nameApp={nameApp} />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:slug" element={<ProductDetailPage />} />
                  <Route path="/products/favourites" element={<FavouritePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/shopping-cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/thank-you" element={<ThankYouPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </FavouritesProvider>
        </CartProvider>
      </GlobalProvider>
    </>
  );
}

export default App;