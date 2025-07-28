import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCreditCard, FaMobileAlt, FaMoneyBillAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

function CartPage({ productList, setProductList, setProductCount }) {
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(localStorage.getItem("paymentMethod") || "");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cartList") || "[]");
    setCartItems(stored);
    const quantityMap = {};
    stored.forEach((item) => {
      quantityMap[item.name] = 1;
    });
    setQuantities(quantityMap);
  }, []);

  const handleQuantityChange = (name, type) => {
    setQuantities((prev) => {
      const updated = { ...prev };
      if (type === "inc") updated[name]++;
      else if (type === "dec" && updated[name] > 1) updated[name]--;
      return updated;
    });
  };

  const handleRemoveItem = (name) => {
    const updatedCart = cartItems.filter((item) => item.name !== name);
    localStorage.setItem("cartList", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    const newQuantities = { ...quantities };
    delete newQuantities[name];
    setQuantities(newQuantities);
    setProductList(updatedCart.map((item) => item.name));
    setProductCount(updatedCart.length);
    toast.info(`❌ Removed ${name} from cart`);
  };

  const handleApplyCoupon = () => {
    if (coupon === "SAVE10") {
      setDiscount(10);
      toast.success("🎉 Coupon Applied: 10% OFF");
    } else {
      setDiscount(0);
      toast.error("❌ Invalid Coupon Code");
    }
  };

  const isValidUpi = (upi) => /^[\w.-]{2,256}@[a-zA-Z]{2,64}$/.test(upi);
  const isValidCardNumber = (num) => /^\d{16}$/.test(num);
  const isValidCVV = (cvv) => /^\d{3}$/.test(cvv);
  
  const handleCheckout = () => {
    if (!paymentMethod) {
      toast.error("❌ Please select a payment method.");
      return;
    }

    if (paymentMethod === "card") {
      if (!isValidCardNumber(cardNumber)) {
        toast.error("❌ Invalid card number (must be 16 digits)");
        return;
      }
      if (!isValidCVV(cvv)) {
        toast.error("❌ Invalid CVV (must be 3 digits)");
        return;
      }
    }

    if (paymentMethod === "upi") {
      if (!isValidUpi(upiId)) {
        toast.error("❌ Invalid UPI ID (e.g., name@bank)");
        return;
      }
    }
    //  Track all cart items as orders
    const previousOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const newOrders = cartItems.map((item) => ({
      product: item,
      date: new Date().toLocaleString(),
      status: "Confirmed",
      id: Date.now() + Math.random(), // unique order ID
      }));
    localStorage.setItem("orders", JSON.stringify([...previousOrders, ...newOrders]));


    localStorage.setItem("paymentMethod", paymentMethod);
    localStorage.removeItem("cartList");
    setCartItems([]);
    setProductList([]);
    setProductCount(0);
    toast.success("✅ Order placed successfully!");
    navigate("/checkout-confirmation");
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * (quantities[item.name] || 1),
    0
  );
  const discountedPrice = totalPrice - (totalPrice * discount) / 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: "2rem" }}
    >
      <h1 style={{ textAlign: "center" }}>🛒 Your Cart</h1>

      {cartItems.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
             Your cart is empty.<br />
            <NavLink to="/products" style={{ color: "#3498db", textDecoration: "underline" }}>
              Start Shopping
            </NavLink>
        </p>

      ) : (
        <div style={{ maxWidth: "800px", margin: "auto" }}>
          {cartItems.map((item) => (
            <motion.div
              key={item.name}
              whileHover={{ scale: 1.02 }}
              style={{
                display: "flex",
                marginBottom: "1.5rem",
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "1rem",
                background: "#fff",
                alignItems: "center",
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "contain",
                  marginRight: "1rem",
                }}
              />
              <div style={{ flex: 1 }}>
                <h3>{item.name}</h3>
                <p>Price: ₹{item.price}</p>
                <div>
                  <button onClick={() => handleQuantityChange(item.name, "dec")}>-</button>
                  <span style={{ margin: "0 10px" }}>{quantities[item.name]}</span>
                  <button onClick={() => handleQuantityChange(item.name, "inc")}>+</button>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.name)}
                  style={{
                    marginTop: "0.5rem",
                    background: "red",
                    color: "white",
                    border: "none",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  ❌ Remove
                </button>
              </div>
            </motion.div>
          ))}

          {/* Coupon Section */}
          <div style={{ marginTop: "1rem", marginBottom: "1.5rem" }}>
            <input
              type="text"
              placeholder="Enter coupon (e.g. SAVE10)"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              style={{ padding: "0.5rem", width: "200px", marginRight: "1rem" }}
            />
            <button
              onClick={handleApplyCoupon}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#2980b9",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Apply Coupon
            </button>
          </div>

          {/* Price Summary */}
          <div style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
            <p>Total: ₹{totalPrice.toFixed(2)}</p>
            {discount > 0 && <p>Discount: {discount}%</p>}
            <p style={{ fontWeight: "bold" }}>Final Total: ₹{discountedPrice.toFixed(2)}</p>
          </div>

          {/* Payment Section */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3>Payment Method:</h3>
            <label>
              <input
                type="radio"
                name="payment"
                value="upi"
                checked={paymentMethod === "upi"}
                onChange={() => setPaymentMethod("upi")}
              />
              <FaMobileAlt style={{ marginLeft: "0.5rem" }} /> UPI
            </label>
            <label style={{ marginLeft: "1rem" }}>
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              <FaCreditCard style={{ marginLeft: "0.5rem" }} /> Card
            </label>
            <label style={{ marginLeft: "1rem" }}>
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              <FaMoneyBillAlt style={{ marginLeft: "0.5rem" }} /> Cash on Delivery
            </label>

            {/* UPI Fields */}
            {paymentMethod === "upi" && (
              <div style={{ marginTop: "1rem" }}>
                <input
                  type="text"
                  placeholder="Enter UPI ID"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  style={{ padding: "0.5rem", width: "300px" }}
                />
              </div>
            )}

            {/* Card Fields */}
            {paymentMethod === "card" && (
              <div style={{ marginTop: "1rem" }}>
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  style={{ padding: "0.5rem", width: "300px" }}
                />
                <br />
                <input
                  type="password"
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  style={{ padding: "0.5rem", width: "100px", marginTop: "0.5rem" }}
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={() => navigate("/products")}
              style={{
                background: "#7f8c8d",
                color: "#fff",
                padding: "0.7rem 1.5rem",
                border: "none",
                borderRadius: "5px",
              }}
            >
              🔙 Continue Shopping
            </button>

            <button
              onClick={handleCheckout}
              style={{
                background: "#27ae60",
                color: "#fff",
                padding: "0.7rem 1.5rem",
                border: "none",
                borderRadius: "5px",
              }}
            >
              ✅ Checkout
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default CartPage;
