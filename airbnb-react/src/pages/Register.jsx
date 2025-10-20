// src/Register.jsx
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("❌ Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register", {
        nombre: name,
        email: email,
        password: password,
      });

      alert(`✅ ${response.data.message || response.data}`);

      // Limpiar formulario después de registrar
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      navigate("/");

    } catch (error) {
      if (error.response) {
        alert(`❌ Error: ${error.response.data.message || error.response.statusText}`);
      } else {
        alert("❌ No se pudo conectar con el servidor");
      }
      console.error(error);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleGoogle = () => {
    alert("Continuar con Google (pendiente integración OAuth)");
  };

  const handleFacebook = () => {
    alert("Continuar con Facebook (pendiente integración OAuth)");
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Registro de Usuario</h2>

        <input
          type="text"
          placeholder="Nombre completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">Registrarse</button>
        <button type="button" className="back-btn" onClick={handleBack}>
          Volver
        </button>

        <hr className="divider" />

        <button type="button" className="google-btn" onClick={handleGoogle}>
          Continuar con Google
        </button>
        <button type="button" className="facebook-btn" onClick={handleFacebook}>
          Continuar con Facebook
        </button>
      </form>
    </div>
  );
};

export default Register;