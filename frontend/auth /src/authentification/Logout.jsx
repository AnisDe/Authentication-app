import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import axiosInstance from '../lib/axios';

const Logout = () => {
  const navigate = useNavigate();
 useEffect(() => {
const performLogout = async () => {
      try {
        await axiosInstance.delete('/logout', { withCredentials: true });
                navigate('/login');

        console.log('Logged out successfully');
      } catch (error) {
        console.error('Logout failed:', error);
      } finally {
        navigate('/login');
      }
    };
    performLogout();
  });

}

export default Logout;