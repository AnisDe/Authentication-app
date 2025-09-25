// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { loggedIn, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // Optionally add a spinner

  return loggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
