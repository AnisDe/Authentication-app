import React from "react";
import { Link, useNavigate } from "react-router";
import axiosInstance from "../lib/axios";
import { useAuth } from "../authentification/AuthContext";
import "./Navbar.css";
const Navbar = () => {
  const navigate = useNavigate();
  const { loggedIn, setLoggedIn, loading } = useAuth();

  console.log("loggedIn:", loggedIn, "loading:", loading);

  if (loading) return null;

  const handleLogout = async () => {
    try {
      await axiosInstance.delete("/logout", {
        withCredentials: true,
      });
      setLoggedIn(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (



    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/welcome" >
        <div className="logo">A</div>
        </Link>
        <ul className="nav-menu">
          <Link to="/welcome" >Welcome</Link>

        </ul>
      </div>

      <div className="navbar-right">


        {!loggedIn && (
          <span className="icon"><Link to="/login" >👤</Link></span>
        )}
        {loggedIn && (
          <>
          <span className="icon"><Link to="/edit-profile" >👤</Link></span>

          <button onClick={handleLogout} className="btn-outline">Logout</button>
</>
        )}
      </div>
    </nav>


  );
};



export default Navbar;



