import React, { useState } from "react";
import { Link, useNavigate, useLocation} from "react-router-dom";
import { FaSearch, FaGlobe, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import "./Header.css";
import logoAirbnb from "../assets/images/Airbnb_Logo.png";

import avatarDefault from "../assets/images/user.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [user, setUser] = useState({
    avatar: avatarDefault,
    authenticated: true,
  });

  const handleLogout = () => {
  localStorage.removeItem("token");
  setUser({
    avatar: avatarDefault,
    authenticated: false,
  });
  setMenuOpen(false);
  navigate("/");
};

  const location = useLocation();
  
  if (location.pathname === "/" || location.pathname === "/register") {  return null;}
return (
    <header className="header">
      {/* LOGO */}
      <div className="header__logo">
        <Link to="/home">
          <img src={logoAirbnb} alt="Airbnb Logo" className="logo-img" />
        </Link>
      </div>

      {/* NAVEGACIÓN PRINCIPAL */}
      <nav className="header__nav">
        <Link to="/home" className={`nav-item ${location.pathname === "/home" ? "active" : ""}`}>
        Alojamientos</Link>
        <Link to="/experiencias" className={`nav-item ${location.pathname === "/experiencias" ? "active" : ""}`}>
        Experiencias</Link>
        <Link to="/servicios" className={`nav-item ${location.pathname === "/servicios" ? "active" : ""}`}>
        Servicios</Link>
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

      {/* Menu Flotante */}
      {menuOpen && (
      <div className="dropdown-menu-airbnb">
        {user.authenticated ? (
          <>
            <Link to="/perfil" className="dropdown-item-airbnb">Perfil</Link>
            <Link to="/reservas" className="dropdown-item-airbnb">Mis reservas</Link>
            <button onClick={handleLogout} className="dropdown-item-airbnb logout-btn-airbnb">
              Cerrar sesión
            </button>
          </>
          ) : (
          <>
            <Link to="/login" className="dropdown-item-airbnb">Iniciar sesión</Link>
            <Link to="/register" className="dropdown-item-airbnb">Registrarse</Link>
          </>
          )}
        </div>
        )}
      </div>
      </div>

    </header>
  );
};

export default Header;
