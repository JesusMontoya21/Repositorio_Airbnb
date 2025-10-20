import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Header from "./Components/Header";
import PrivateRoute from "./Components/PrivateRoute";
import Experiences from "./pages/Experiences";

function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<PrivateRoute>
          <Home /></PrivateRoute>} />
        <Route path="/home" element={<h2>Alojamientos</h2>}/>
        <Route path="/experiencias" element={<Experiences />} />
        <Route path="/servicios" element={<h2>Servicios</h2>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
    </Router>
  );
}

export default App;