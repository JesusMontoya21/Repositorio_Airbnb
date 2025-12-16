import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Cargar usuario al refrescar página (si hay token)
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      api.get("/user")
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    }
  }, []);

  //  Aquí se guarda el token
  const login = async (email, password) => {
    const response = await api.post("/login", { email, password });

    localStorage.setItem("token", response.data.token);

    setUser(response.data.user);

    return response;
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
