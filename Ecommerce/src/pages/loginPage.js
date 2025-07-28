import { useNavigate, NavLink } from "react-router-dom";
import { useState } from "react";

function LoginPage({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  async function handleSubmit(event) {
    event.preventDefault();

    const phone = event.target.phone.value;
    const password = event.target.password.value;

    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();
      console.log("✅ Backend response:", data);

      if (response.status === 401) {
        setError("❌ Unauthorized. Please check your credentials.");
        return;
      }

      if (response.ok && data.token) {
        console.log("✅ Token received:", data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.userData));

        // ✅ Safe call
        if (typeof setIsAuthenticated === "function") {
          setIsAuthenticated(true);
        } else {
          console.warn("⚠️ setIsAuthenticated is not a function");
        }

        navigate("/");
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("❌ Network/login error:", error.message);
      setError("Login failed due to network error.");
    }
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.heading}>Login</h2>

        <div style={styles.inlineField}>
          <label htmlFor="phone" style={styles.inlineLabel}>Phone:</label>
          <input type="text" id="phone" name="phone" required style={styles.inlineInput} />
        </div>

        <div style={styles.inlineField}>
          <label htmlFor="password" style={styles.inlineLabel}>Password:</label>
          <input type="password" id="password" name="password" required style={styles.inlineInput} />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <div style={{ textAlign: 'center' }}>
          <button type="submit" style={styles.button}>Login</button>
        </div>

        <p style={styles.linkText}>
          Don't have an account? <NavLink to="/register" style={styles.link}>Register here</NavLink>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundImage: 'url("/login.jpeg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: '60px',
    padding: '40px 20px',
  },
  form: {
    background: 'white',
    padding: '2px',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    width: '30%',
    maxWidth: '400px',
  },
  heading: {
    marginBottom: '20px',
    textAlign: 'center',
    color: '#333',
    fontFamily: 'Arial, sans-serif',
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontSize: '13px',
    textAlign: 'center',
    marginBottom: '10px',
  },
  linkText: {
    textAlign: 'center',
    fontSize: '14px',
    marginTop: '15px',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
  inlineField: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px',
  },
  inlineLabel: {
    width: '80px',
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#555',
  },
  inlineInput: {
    flex: 1,
    padding: '10px 8px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '14px',
  },
};

export default LoginPage;
