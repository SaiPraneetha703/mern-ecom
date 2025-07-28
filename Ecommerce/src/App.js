import './App.css';
import { useState } from 'react';
import { Routes, Route } from 'react-router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import { useEffect } from 'react'; 

// Components & Pages
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CartPage from './pages/CartPage';
import CategoriesPage from './pages/CategoriesPage';
import MultipleProductPage from './pages/MultipleProductPage';
import ProductSellingPage from './pages/ProductSellingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/loginPage';
import CheckoutConfirmation from './pages/CheckoutConfirmation';
import PaymentSuccess from './pages/PaymentSucess';
import OrderHistoryPage from './pages/OrderHistoryPage';


function App() {
const [searchQuery, setSearchQuery] = useState("");
const [productCount, setProductCount] = useState(0); 

  const [productList, setProductList] = useState(["Bag", "Sandals"]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  const [isAuthenticated, setIsAuthenticated] = useState(false);



  return (
    <div className="App">
      {/*  Navbar shows product count */}
      <Navbar productCount={productCount} isAuthenticated={isAuthenticated} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      {/*  Routing */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />

        {/*  Product Flow */}
        <Route path="products">
          <Route
            index
            element={
              <CategoriesPage
                setSelectedCategory={setSelectedCategory}
                selectedCategory={selectedCategory}
              />
            }
          />
          <Route
            path=":category"
            element={
              <MultipleProductPage
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                setSelectedProduct={setSelectedProduct}
                selectedProduct={selectedProduct}
              />
            }
          />
          <Route path=":category/:productName" element={<ProductSellingPage setProductCount={setProductCount} setProductList={setProductList} />} />

        </Route>

        {/*  Cart & Checkout */}
        <Route
          path="/cartPage"
          element={
            <CartPage
              productList={productList}
              setProductCount={setProductCount}
              setProductList={setProductList}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/checkout-confirmation" element={<CheckoutConfirmation />} />
        <Route path="/order-history" element={<OrderHistoryPage />} />

      </Routes>

      {/* Global Toast Container */}
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}

export default App;
