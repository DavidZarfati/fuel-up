
import './App.css'
import DefaultLayout from './layouts/DefaultLayout';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import Productpagedetail from './pages/productpagedetail'

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

              <Route path="/" element={<HomePage />} />

              <Route path="/products" element={<ProductsPage />}>
                <Route path=":slug" element={<Productpagedetail />} />
              </Route>

              {/* <Route path="*" element={<NotFoundPage />} /> */}

            </Route>
          </Routes>
        </BrowserRouter>
      </GlobalProvider>

    </>
  );
}

export default App;