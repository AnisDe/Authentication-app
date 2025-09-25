import React, { useState } from 'react';
import { Link } from "react-router";
import axiosInstance from '../lib/axios';
import "./loginPage.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axiosInstance.post('/forgot', { email });
      setMessage('Check your email to reset your password.');
    } catch (err) {
      setMessage('Email not found or error occurred.');
    }
  };

  return (


 <div className="login-container">
      {/* Left section */}
      <div className="login-left">
        <h2>Welcome </h2>

          <form onSubmit={handleSubmit}>
      <input type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" required />
      
      <button type="submit">Send Reset Link</button>
      <p>{message}</p>
    </form>

        <div className="extra-links">
          <Link to="/login" >Login. </Link>
        
            Don’t have an account? <Link to="/register" >Sign up for free.</Link>
          
        </div>
      </div>

      {/* Right section */}
      <div className="login-right">
        <div className="promo">
          <h2>Authentication app</h2>
          <p>
           Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur veniam voluptatem magni, obcaecati aperiam mollitia quisquam distinctio explicabo itaque cumque excepturi nesciunt doloremque unde consequuntur omnis cum provident. Animi, cupiditate.
          </p>
          <button className="learn-btn">Learn More ›</button>
        </div>
      </div>
    </div>




  
  );
};

export default ForgotPasswordPage;
