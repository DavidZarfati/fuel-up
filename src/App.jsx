
import './App.css'
import DefaultLayout from './layouts/DefaultLayout';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GlobalProvider } from './context/GlobalContext';


function App() {
  const nameApp = "FuelUp";
  return (
    <>
      <GlobalProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<DefaultLayout nameApp={nameApp} />}>
              <Route element={<HomePage />} path="/" />
              <Route element={<ProductsPage />} path="/products" />
              {/* qui da aggiungere ruota del ProductDetailPage e altre */}
              
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </GlobalProvider>
    </>
  );
}

export default App;