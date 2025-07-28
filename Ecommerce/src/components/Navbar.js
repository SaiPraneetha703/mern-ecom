import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { findProductPath } from "../utils/findProducrRoute";
import { toast } from "react-toastify";

function Navbar({ productCount }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      const path = findProductPath(searchInput.trim());
      if (path) {
        navigate(path);
      } else {
        toast.error("❌ Product not found.");
      }
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <img src="/logo512.png" alt="TrendCart Logo" width={20} height={20} />
      </div>

      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/cartPage">Cart</NavLink>
        <NavLink to="/order-history">Orders</NavLink>

        {isLoggedIn ? (
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </div>

      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={handleSearch}
        className="search-bar"
      />

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
    </nav>
  );
}

export default Navbar;
