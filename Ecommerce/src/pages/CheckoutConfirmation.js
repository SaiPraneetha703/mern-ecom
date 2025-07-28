import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CheckoutConfirmation() {
  const navigate = useNavigate();
  const [instantBuyProduct, setInstantBuyProduct] = useState(null);
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: ""
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    const product = JSON.parse(localStorage.getItem("instantBuy"));
    setInstantBuyProduct(product);

    const lastUsed = localStorage.getItem("lastAddress");
    if (lastUsed) {
      try {
        setAddress(JSON.parse(lastUsed));
      } catch {
        localStorage.removeItem("lastAddress");
      }
    }
  }, []);

  const handleConfirmOrder = () => {
    const requiredFields = ["fullName", "phone", "street", "city", "state", "pincode"];
    const isComplete = requiredFields.every(field => address[field]?.trim());

    if (!isComplete) {
      alert("Please fill in all address fields.");
      return;
    }

    const formattedAddress = `
${address.fullName}
${address.phone}
${address.street}, ${address.city}, ${address.state} - ${address.pincode}`.trim();

    const previousOrders = JSON.parse(localStorage.getItem("orders")) || [];

    const newOrder = {
      product: instantBuyProduct,
      date: new Date().toLocaleString(),
      status: "Confirmed",
      address: formattedAddress,
      id: Date.now() + Math.random()
    };

    localStorage.setItem("orders", JSON.stringify([...previousOrders, newOrder]));
    localStorage.setItem("lastAddress", JSON.stringify(address));
    localStorage.removeItem("instantBuy");
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>✅ Thank you for your purchase!</h1>
        <p>Your order has been placed successfully.</p>
        <button
          onClick={() => navigate("/order-history")}
          style={{
            marginTop: "2rem",
            padding: "0.6rem 2rem",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          View Orders
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center", maxWidth: "600px", margin: "auto" }}>
      <h2>🧾 Checkout</h2>

      {instantBuyProduct && (
        <div style={{
          marginTop: "1rem", padding: "1rem", border: "1px solid #ccc",
          borderRadius: "8px", background: "#f9f9f9", textAlign: "left"
        }}>
          <h3>{instantBuyProduct.name}</h3>
          <img src={instantBuyProduct.image} alt={instantBuyProduct.name}
            style={{ width: "100%", maxHeight: "200px", objectFit: "contain" }} />
          <p><strong>Price:</strong> ₹{instantBuyProduct.price}</p>
          <p><strong>Brand:</strong> {instantBuyProduct.brand}</p>
        </div>
      )}

      {/* Address Form */}
      <div style={{ marginTop: "2rem", textAlign: "left" }}>
        <h4>🏠 Shipping Details</h4>
        <input type="text" placeholder="Full Name" value={address.fullName}
          onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
          style={{ width: "100%", padding: "0.6rem", marginBottom: "0.8rem" }} />
        <input type="tel" placeholder="Phone Number" value={address.phone}
          onChange={(e) => setAddress({ ...address, phone: e.target.value })}
          style={{ width: "100%", padding: "0.6rem", marginBottom: "0.8rem" }} />
        <input type="text" placeholder="Street Address" value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
          style={{ width: "100%", padding: "0.6rem", marginBottom: "0.8rem" }} />
        <input type="text" placeholder="City" value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
          style={{ width: "100%", padding: "0.6rem", marginBottom: "0.8rem" }} />
        <input type="text" placeholder="State" value={address.state}
          onChange={(e) => setAddress({ ...address, state: e.target.value })}
          style={{ width: "100%", padding: "0.6rem", marginBottom: "0.8rem" }} />
        <input type="text" placeholder="Pincode" value={address.pincode}
          onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
          style={{ width: "100%", padding: "0.6rem", marginBottom: "0.8rem" }} />
      </div>

      <button onClick={handleConfirmOrder}
        style={{
          marginTop: "2rem", padding: "0.7rem 2rem", backgroundColor: "#2ecc71",
          color: "#fff", border: "none", borderRadius: "5px", fontSize: "1rem", cursor: "pointer"
        }}>
        ✅ Confirm Order
      </button>
    </div>
  );
}

export default CheckoutConfirmation;
