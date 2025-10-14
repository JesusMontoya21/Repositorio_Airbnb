import React, { useState } from "react";
import { Link, useNavigate, useLocation} from "react-router-dom";
import { FaSearch, FaGlobe, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import "./Header.css";

import avatarDefault from "../assets/images/user.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [user, setUser] = useState({
    avatar: avatarDefault,
    authenticated: true,
  });

  const location = useLocation();
  
  if (location.pathname === "/" || location.pathname === "/register") {  return null;}
return (
    <header className="header">
      {/* LOGO */}
      <div className="header__logo">
        <Link to="/home">
          <h2>Airbnb</h2>
        </Link>
      </div>

      {/* NAVEGACIÓN PRINCIPAL */}
      <nav className="header__nav">
        <Link to="/home" className="nav-item active">Alojamientos</Link>
        <Link to="/experiencias" className="nav-item">Experiencias</Link>
        <Link to="/servicios" className="nav-item">Servicios</Link>
      </nav>

      {/* MENÚ DE USUARIO */}
      <div className="header__right">
        <p className="host">Hazte anfitrión</p>
        <FaGlobe className="icon" />
        <div className="header__menu" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes className="icon" /> : <FaBars className="icon" />}
          {user.authenticated ? (
            <img src={user.avatar} alt="avatar" className="user-avatar" />
          ) : (
            <FaUserCircle className="icon" />
          )}
          
        </div>
      </div>

    </header>
  );
};

export default Header;
