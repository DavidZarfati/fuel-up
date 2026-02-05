
import './App.css'
import DefaultLayout from './layouts/DefaultLayout';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import Productpagedetail from './pages/productpagedetail'

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GlobalProvider } from './context/GlobalContext';
import { CartProvider } from './context/CartContext';
import CartPage from './pages/CartPage';


function App() {
  const nameApp = "FuelUp";
  return (
    <>
      <GlobalProvider>
  <CartProvider>

    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout nameApp={nameApp} />}>

          <Route path="/" element={<HomePage />} />

          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<Productpagedetail />} />
          <Route path="/shopping-cart" element={<CartPage />} />

        </Route>
      </Routes>
    </BrowserRouter>

  </CartProvider>
</GlobalProvider>


    </>
  );
}

export default App;