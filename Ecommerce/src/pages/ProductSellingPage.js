import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { products } from "../data/MultiProductData";
import { toast } from "react-toastify";
import { FaCreditCard, FaMobileAlt, FaMoneyBillAlt } from "react-icons/fa";

function ProductSellingPage({ setProductCount, setProductList }) {
  const { productName } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ name: "", rating: 0, comment: "" });

  const [paymentMethod, setPaymentMethod] = useState("");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");

  const isValidUpi = (upi) => /^[\w.-]{2,256}@[a-zA-Z]{2,64}$/.test(upi);
  const isValidCardNumber = (num) => /^\d{16}$/.test(num);
  const isValidCVV = (cvv) => /^\d{3}$/.test(cvv);

  const product = productName
    ? Object.values(products).flat().find((p) => p.name?.toLowerCase() === productName.toLowerCase())
    : null;

  useEffect(() => {
    if (product) {
      const saved = JSON.parse(localStorage.getItem(`reviews_${product.name}`)) || [];
      setReviews(saved);
    } else {
      const timer = setTimeout(() => navigate("/products"), 2500);
      return () => clearTimeout(timer);
    }
  }, [product, navigate]);

  const handleAddToCart = () => {
    const stored = JSON.parse(localStorage.getItem("cartList") || "[]");
    const updatedList = [...stored, product];
    localStorage.setItem("cartList", JSON.stringify(updatedList));
    setProductList(updatedList.map((item) => item.name));
    setProductCount(updatedList.length);
    navigate("/cartPage");
  };

  const handleBuy = () => {
    if (!paymentMethod) {
      toast.error("❌ Please select a payment method.");
      return;
    }

    if (paymentMethod === "upi" && !isValidUpi(upiId)) {
      toast.error("❌ Invalid UPI ID (e.g., name@bank)");
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

    // Store product and payment info for use in checkout confirmation
    localStorage.setItem("instantBuy", JSON.stringify(product));
    localStorage.setItem("paymentMethod", paymentMethod);
    navigate("/checkout-confirmation");
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const userToken = localStorage.getItem("token");
    if (!userToken) {
      alert("You must be logged in to submit a review.");
      return;
    }
    const newRev = {
      name: newReview.name || "Anonymous",
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toLocaleDateString(),
    };
    const updatedReviews = [...reviews, newRev];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${product.name}`, JSON.stringify(updatedReviews));
    setNewReview({ name: "", rating: 0, comment: "" });
  };

  if (!product) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        ❌ Invalid product link.<br />
        Redirecting to products...
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h2>{product.name}</h2>
      <img
        src={product.image}
        alt={product.name}
        style={{ width: "100%", maxHeight: "300px", objectFit: "contain", marginBottom: "1rem" }}
      />
      <p>{product.description}</p>
      <p>Price: ₹{product.price}</p>
      <p>Brand: {product.brand}</p>
      <p>Rating: ⭐ {product.rating}</p>
      <p>Stock: {product.stock}</p>

      {/* Payment Selection */}
      <div style={{ marginTop: "2rem" }}>
        <h3>Select Payment Method:</h3>
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

      <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
        <button
          onClick={handleAddToCart}
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: "#3498db",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          🛒 Add to Cart
        </button>
        <button
          onClick={handleBuy}
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: "#2ecc71",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          💸 Buy Now
        </button>
      </div>

      {/* Review Section */}
      <div style={{ marginTop: "2rem" }}>
        <h3>📝 Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {reviews.map((rev, idx) => (
              <li key={idx} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "5px", marginBottom: "1rem" }}>
                <strong>{rev.name}</strong> ({rev.date})<br />
                <span>{"⭐".repeat(rev.rating)}</span>
                <p>{rev.comment}</p>
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={handleReviewSubmit}>
          <h4>Submit a Review:</h4>
          <input
            type="text"
            placeholder="Your Name"
            value={newReview.name}
            onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
            style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
          />
          <div style={{ marginBottom: "0.5rem" }}>
            <label style={{ fontWeight: "bold", marginRight: "0.5rem" }}>Rating:</label>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setNewReview({ ...newReview, rating: star })}
                style={{
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  color: star <= newReview.rating ? "#f1c40f" : "#ccc",
                  marginRight: "0.2rem",
                }}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            placeholder="Write your review..."
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            required
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem", height: "100px" }}
          />
          <button
            type="submit"
            style={{ padding: "0.6rem 1.2rem", backgroundColor: "#f39c12", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProductSellingPage;
