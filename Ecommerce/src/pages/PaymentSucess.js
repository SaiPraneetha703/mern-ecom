import React from "react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

function PaymentSuccess() {
  const method = localStorage.getItem("paymentMethod");

  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FaCheckCircle size={100} color="#27ae60" />
      </motion.div>
      <h1 style={{ marginTop: "1rem", color: "#27ae60" }}>Payment Successful!</h1>
      <p style={{ marginTop: "1rem", fontSize: "1.2rem" }}>
        Your order has been placed using <strong>{method}</strong>. 🎉
      </p>
    </div>
  );
}

export default PaymentSuccess;
