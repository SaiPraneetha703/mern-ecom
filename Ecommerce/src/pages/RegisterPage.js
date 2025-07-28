import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function RegisterPage() {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = event.target.username.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;
    const phone = event.target.phone.value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password, phone }),
      });

      if (response.ok) {
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          navigate('/login');
        }, 2500);
      } else {
        const errData = await response.json();
        alert('Registration failed: ' + (errData.message || "Please try again."));
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      {showToast && <div style={styles.toast}>✅ Registered successfully! Redirecting...</div>}
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.heading}>Create Account</h2>

        <label style={styles.label} htmlFor="username">Username</label>
        <input type="text" id="username" name="username" required style={styles.input} />

        <label style={styles.label} htmlFor="phone">Phone Number</label>
        <input type="text" id="phone" name="phone" required style={styles.input} />

        <label style={styles.label} htmlFor="password">Password</label>
        <input type="password" id="password" name="password" required style={styles.input} />

        <label style={styles.label} htmlFor="confirmPassword">Confirm Password</label>
        <input type="password" id="confirmPassword" name="confirmPassword" required style={styles.input} />

        <div style={{ textAlign: 'center' }}>
          <button type="submit" style={styles.button}>Register</button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundImage: 'url("/image.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: '8%',
    paddingRight: '20px',
  },
  toast: {
    position: 'fixed',
    top: '20px',
    backgroundColor: '#4BB543',
    color: '#fff',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    boxShadow: '0 0 10px rgba(0,0,0,0.2)',
    zIndex: 1000,
    animation: 'fadeInOut 2.5s',
  },
  form: {
    background: 'white',
    padding: '30px 30px',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  heading: {
    marginBottom: '20px',
    textAlign: 'center',
    color: '#333',
    fontFamily: 'Arial, sans-serif',
  },
  label: {
    display: 'block',
    margin: '12px 0 5px',
    color: '#555',
    fontWeight: 'bold',
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif',
  },
  input: {
    width: '90%',
    padding: '10px 12px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'Arial, sans-serif',
  },
  button: {
    width: '50%',
    marginTop: '20px',
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: 'Arial, sans-serif',
  },
};

export default RegisterPage;
