import React from 'react';
import { useNavigate } from 'react-router-dom';
import getCategoryData from '../data/categoriesData'; // ✅ Adjust path if needed

function Home() {
  const navigate = useNavigate();
  const categories = getCategoryData();

  const handleShopClick = () => {
    navigate('/products');
  };

  const featuredProducts = [
    {
      name: 'Smart Watch',
      price: '99',
      image: 'data:image/jpeg;base64,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',
    },
    {
      name: 'Denim Jacket',
      price: '59',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfbEY0oOa_cFf_eSmvRjuOxINqxibDHf_iyQ&s',
    },
    {
      name: 'Wireless Headphones',
      price: '129',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB9oYQGQLDBlkAukF3RxMjP2zcQ0SfW0gbsw&s',
    },
  ];

  return (
    <div>
      {/* HERO SECTION */}
      <div
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
            url("https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '2rem',
          fontFamily: 'Segoe UI, sans-serif',
        }}
      >
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
          Welcome to <span style={{ color: '#f9d342' }}>TrendCart</span>
        </h1>
        <p style={{ fontSize: '1.4rem', maxWidth: '700px', marginBottom: '2rem' }}>
          Fashion meets tech. Discover the latest clothing styles and gadgets in one place.
        </p>
        <button
          onClick={handleShopClick}
          style={{
            padding: '0.8rem 2rem',
            fontSize: '1.1rem',
            borderRadius: '30px',
            border: 'none',
            backgroundColor: '#f9d342',
            color: '#333',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          🛒 Shop Now
        </button>
      </div>

      {/* CATEGORY SECTION */}
      <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '2rem' }}>Shop by Category</h2>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
          }}
        >
          {categories.map((cat, index) => (
            <div
              key={index}
              style={{
                borderRadius: '15px',
                overflow: 'hidden',
                width: '250px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                cursor: 'pointer',
                transition: 'transform 0.3s',
              }}
              onClick={() => navigate(`/products/${cat.title}`)}
            >
              <img
                src={cat.image}
                alt={cat.title}
                style={{ width: '100%', height: '180px', objectFit: 'cover' }}
              />
              <div style={{ padding: '1rem', backgroundColor: '#f9f9f9' }}>
                <h3>{cat.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURED PRODUCTS SECTION */}
      <div
        style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          backgroundColor: '#f4f4f4',
        }}
      >
        <h2 style={{ marginBottom: '2rem' }}>Featured Products</h2>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
          }}
        >
          {featuredProducts.map((prod, index) => (
            <div
              key={index}
              style={{
                borderRadius: '15px',
                overflow: 'hidden',
                width: '220px',
                backgroundColor: '#fff',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                textAlign: 'left',
                transition: 'transform 0.3s',
              }}
            >
              <img
                src={prod.image}
                alt={prod.name}
                style={{ width: '100%', height: '160px', objectFit: 'cover' }}
              />
              <div style={{ padding: '1rem' }}>
                <h4>{prod.name}</h4>
                <p style={{ color: '#f9d342', fontWeight: 'bold' }}>
                  &#8377;{prod.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
