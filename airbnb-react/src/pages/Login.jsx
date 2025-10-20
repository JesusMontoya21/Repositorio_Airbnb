// src/Login.jsx
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/auth/login", {
        email,
        password,
      });
      alert(response.data.message);
      if(response.data.success){
        localStorage.setItem("token", response.data.token);
        navigate("/home");
      } else {
        alert("❌ Credenciales incorrectas");
      } 
    }catch (error) {
        console.error(error);
        if(error.response) {
        alert(`❌ ${error.response.data.message}`);
      } else {
        alert("❌ Error al conectar con el servidor");
      }
    }
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Iniciar Sesion</button>
        <p className="signup-text">
          ¿No tienes cuenta?{" "}
          <span className="signup-link" onClick={goToRegister}>
            Regístrate
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
