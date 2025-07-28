import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductFromCategory } from "../data/MultiProductData"; // make sure path is correct

function MultipleProductPage({ setSelectedCategory, setSelectedProduct }) {
  const { category } = useParams();
  const navigate = useNavigate();
  const [productsToShow, setProductsToShow] = useState([]);

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);

      // ✅ Use local function instead of fetch
      const result = getProductFromCategory(category);
      setProductsToShow(result);
    }
  }, [category, setSelectedCategory]);

  const handleProductClick = (product) => {
    setSelectedProduct(product.name);
    navigate(`/products/${category}/${product.name}`);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem", fontSize: "2rem" }}>
        Category: <span style={{ textTransform: "capitalize" }}>{category || "(not set)"}</span>
      </h1>

      {productsToShow.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
          }}
        >
          {productsToShow.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                padding: "1rem",
                textAlign: "center",
                backgroundColor: "#fff",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <h3 style={{ marginBottom: "1rem" }}>{p.name}</h3>
              <img
                src={p.image || "https://placehold.co/300x200"}
                alt={p.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "contain",
                  marginBottom: "1rem",
                }}
              />
              <p>{p.description}</p>
              <p style={{ fontWeight: "bold", color: "#e67e22" }}>Price: ₹{p.price}</p>
              <p>Brand: {p.brand}</p>
              <p>
                  Rating: {"⭐".repeat(Math.round(p.rating))}{" "}
                  <span style={{ fontSize: "0.9rem", color: "#999" }}>({p.rating})</span>
                </p>

              <p>Stock: {p.stock}</p>
              <button
                onClick={() => handleProductClick(p)}
                style={{
                  marginTop: "1rem",
                  padding: "0.5rem 1.5rem",
                  backgroundColor: "#3498db",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                View
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
          No products found for this category.
        </p>
      )}
    </div>
  );
}

export default MultipleProductPage;
