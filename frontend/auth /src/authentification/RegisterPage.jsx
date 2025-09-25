import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import "./loginPage.css";
import { useAuth } from './AuthContext';
import axiosInstance from '../lib/axios';
import { validatePassword } from '../utils/validation';

const RegisterPage = () => {
  const [form, setForm] = useState({ email: '', username: '', password: '', adminCode: '' });
  const [message, setMessage] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [resendMessage, setResendMessage] = useState('');
    const { loggedIn, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && loggedIn) {
      navigate('/forgot'); 
    }
  }, [loggedIn, loading, navigate]);
  

const handleChange = e => {
  const { name, value } = e.target;

  setForm(prevForm => ({ ...prevForm, [name]: value }));

  if (name === "password") {
    const errors = validatePassword(value);
    setPasswordErrors(errors);
  }
};

const handleSubmit = async e => {
  e.preventDefault();

  if (passwordErrors.length > 0) {
    setMessage("Fix password errors before submitting.");
    return;
  }

  try {
    const res = await axiosInstance.post('/register', form);
    setMessage(res.data.message); // ✅ use backend message
  } catch (err) {
    setMessage(err.response?.data?.message || "Registration failed.");
  }
};

  // 📧 Resend verification
  const handleResend = async () => {
    if (!form.email) {
      setResendMessage("Please enter your email first.");
      return;
    }
    try {
      const res = await axiosInstance.post('/resend-verification', { email: form.email });
      setResendMessage(res.data.message);
    } catch (err) {
      setResendMessage(err.response?.data?.message || "Error resending verification email.");
    }
  };

  return (
    <div className="login-container">
      {/* Left section */}
      <div className="login-left">
        <h2>Welcome</h2>

        <form onSubmit={handleSubmit}>
          <input name="email" type="email" onChange={handleChange} placeholder="Email" required />
          <input name="username" type="text" onChange={handleChange} placeholder="Username" required />
          <input name="password" type="password" onChange={handleChange} placeholder="Password" required />
          
          {/* 🔑 Show live password validation */}
          {passwordErrors.length > 0 && (
            <ul className="password-errors">
              {passwordErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}

          <input name="adminCode" type="text" onChange={handleChange} placeholder="Admin Code (optional)" />
          <button type="submit">Register</button>
          <p>{message}</p>
        </form>

        {/* 📧 Resend verification */}
        {message.includes("User registered successfully. Please check your email.") && (
          <div className="resend-section">
            <p>Didn’t get the email?</p>
            <button type="button" onClick={handleResend}>
              Resend Verification Email
            </button>
            {resendMessage && <p>{resendMessage}</p>}
          </div>
        )}

        <div className="extra-links">
          <Link to="/login">Login </Link>
          <Link to="/forgot">Forgot your password</Link>
        </div>
      </div>

      {/* Right section */}
      <div className="login-right">
        <div className="promo">
          <h2>Welcome</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur veniam voluptatem magni, obcaecati aperiam mollitia quisquam distinctio explicabo itaque cumque excepturi nesciunt doloremque unde consequuntur omnis cum provident. Animi, cupiditate.
          </p>
          <button className="learn-btn">Learn More ›</button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;