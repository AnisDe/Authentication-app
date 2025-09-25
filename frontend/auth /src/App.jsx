import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import Navbar from "./navBar/navBar";
import { useAuth } from "./authentification/AuthContext";

import LoginPage from "./authentification/LoginPage";
import RegisterPage from "./authentification/RegisterPage";
import ForgotPasswordPage from "./authentification/ForgotPasswordPage";
import ResetPasswordPage from "./authentification/ResetPasswordPage";
import Logout from "./authentification/Logout";
import EditProfile from "./authentification/EditUser";
import ProtectedRoute from "./authentification/ProtectedRoute";
import PublicRoute from "./authentification/PublicRoute";

// Spinner for loading state
const LoadingSpinner = () => <p>Loading...</p>;

// Root redirect logic
const RootRedirect = () => {
  const { loggedIn, loading } = useAuth();
  if (loading) return <LoadingSpinner />;

  return loggedIn ? <Navigate to="/" replace /> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<RootRedirect />} />

        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />
        <Route
          path="/reset/:token"
          element={
            <PublicRoute>
              <ResetPasswordPage />
            </PublicRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        {/* Logout route */}
        <Route path="/logout" element={<Logout />} />

        {/* Catch-all: redirect unknown routes to root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
