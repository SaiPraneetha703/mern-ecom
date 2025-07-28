import React, { useEffect, useState } from "react";

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(allOrders.reverse());
  }, []);
 const handleCancelOrder = (id) => {
    const updatedOrders = orders.map((order) =>
      order.id === id ? { ...order, status: "Cancelled" } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };
  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ textAlign: "center" }}>📦 Your Orders</h2>

      {orders.length === 0 ? (
        <p style={{ textAlign: "center" }}>You haven’t placed any orders yet.</p>
      ) : (
        <div style={{ display: "grid", gap: "1.5rem", maxWidth: "800px", margin: "auto" }}>
         {orders.map((order) => {
  if (!order.product) return null; // 👈 safely skip broken data

  return (
    <div
      key={order.id}
      style={{
        border: "1px solid #ddd",
        padding: "1rem",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        position: "relative",
      }}
    >
      <h3>{order.product.name}</h3>
      <img
        src={order.product.image}
        alt={order.product.name}
        style={{ width: "100%", maxHeight: "180px", objectFit: "contain" }}
      />
      <p><strong>Price:</strong> ₹{order.product.price}</p>
      <p><strong>Brand:</strong> {order.product.brand}</p>
      <p><strong>Date:</strong> {order.date}</p>
      <p><strong>Status:</strong> <span style={{ color: order.status === "Cancelled" ? "red" : "green" }}>{order.status}</span></p>
      {order.address && <p><strong>Shipping Address:</strong> {order.address}</p>}
      {order.status === "Confirmed" && (
        <button
          onClick={() => handleCancelOrder(order.id)}
          style={{
            marginTop: "1rem",
            padding: "0.4rem 1rem",
            backgroundColor: "#e74c3c",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ❌ Cancel Order
        </button>
      )}
    </div>
  );
})}

        </div>
      )}
    </div>
  );
}

export default OrderHistoryPage;