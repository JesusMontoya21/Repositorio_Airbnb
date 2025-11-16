import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import BecomeHostModal from './BecomeHostModal';
import LanguageModal from './LanguageModal';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHostMode, setIsHostMode] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleToggleHost = () => {
    setIsHostMode(!isHostMode);
    if (!isHostMode) {
      navigate('/create-property');
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-[#FF385C]">airbnb</span>
            </Link>

          {/* ----- CAMBIO 1: MENÚ CENTRAL ACTUALIZADO ----- */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="font-medium text-gray-700 hover:text-rose-500">
              Inicio
            </Link>
            <Link to="/explorar" className="font-medium text-gray-700 hover:text-rose-500">
              Explorar
            </Link>
            <Link to="/servicios" className="font-medium text-gray-700 hover:text-rose-500">
              Servicios
            </Link>
            <Link to="/favoritos" className="font-medium text-gray-700 hover:text-rose-500">
              Favoritos
            </Link>
          </div>

          {/* Menu derecho */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* ----- CAMBIO 2: ENLACE DE SERVICIOS CON ESTILO AÑADIDO ----- */}
                <Link
                  to="/servicios"
                  className="hidden lg:block text-sm font-semibold text-rose-500 border-2 border-rose-500 px-4 py-2 rounded-full transition-all duration-300 hover:bg-rose-500 hover:text-white"
                >
                  Servicios
                </Link>

                <button
                  onClick={handleToggleHost}
                  className="hidden lg:block text-sm font-medium text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-full transition"
                >
                  {isHostMode ? "Salir de modo anfitrión" : "Modo anfitrión"}
                </button>
                
                {/* El resto de tu menú para usuario logueado sigue igual */}
                <div className="relative group">
                   {/* ... tu botón de menú y dropdown ... */}
                </div>
              </>
            ) : (
              <>
                {/* Menú para usuario NO logueado sigue igual */}
                {/* ... tu código para el visitante ... */}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
  
}