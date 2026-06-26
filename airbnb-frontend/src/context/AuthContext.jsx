import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    const token = localStorage.getItem("token");

    if (token) {
      api.get("/user")
        .then((res) => {
          // Prevent stale bootstrap requests from overriding a newer login token.
          if (isActive && localStorage.getItem("token") === token) {
            setUser(res.data);
          }
        })
        .catch(() => {
          if (isActive && localStorage.getItem("token") === token) {
            localStorage.removeItem("token");
            setUser(null);
          }
        })
        .finally(() => {
          if (isActive) {
            setLoading(false);
          }
        });
    } else {
      setLoading(false);
    }

    return () => {
      isActive = false;
    };
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/login", { email, password });
    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);
    return response;
  };

  const register = async (name, email, password, password_confirmation) => {
    const response = await api.post("/register", {
      name,
      email,
      password,
      password_confirmation,
    });
    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);
    return response;
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {}
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);