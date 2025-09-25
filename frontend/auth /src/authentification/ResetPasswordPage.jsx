import { useState } from 'react';
import { useParams , useNavigate } from 'react-router';
import axiosInstance from '../lib/axios';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axiosInstance.post(`reset/${token}`, form);
      setMessage('Password reset successful.');
      navigate('/login'); 
    } catch (err) {
      setMessage('Error resetting password or invalid token.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="password" type="password" onChange={handleChange} placeholder="New Password" required />
      <input name="confirm" type="password" onChange={handleChange} placeholder="Confirm Password" required />
      <button type="submit">Reset Password</button>
      <p>{message}</p>
    </form>
  );
};

export default ResetPasswordPage;
