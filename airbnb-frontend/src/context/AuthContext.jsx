import { createContext, useContext, useState, useEffect } from 'react';
import api, { getCSRFToken } from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Se ejecuta al cargar la app para saber si ya hay sesión
  useEffect(() => {
    getUser().finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    await getCSRFToken(); //Crear XSRF-TOKEN y laravel_session
    await api.post('/login', { email, password });
    return getUser(); //Obtenemos el Usuario
  }

  async function getUser() {
    try {
      const res = await api.get('/api/user');
      setUser(res.data);
      return res.data;
    } catch (err) {
      setUser(null);
      return null;
    }
  }

  async function register(name, email, password, password_confirmation) {
    await getCSRFToken();
    await api.post('/register', { name, email, password, password_confirmation });
    return getUser();
  }

  async function logout() {
    await api.post('/logout');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
