import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import LanguageModal from './LanguageModal';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleOpenLogin = () => {
    setIsMenuOpen(false);
    setShowLoginModal(true);
  };

  const handleOpenHost = () => {
    setIsMenuOpen(false);
    navigate('/anuncio-alojamiento');
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = [
    { label: 'Alojamientos', icon: '🏠', path: '/' },
    { label: 'Experiencias', icon: '🎈', path: '/experiences', isNew: true },
    { label: 'Servicios', icon: '🛎️', path: '/services', isNew: true },
  ];

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex justify-between items-center h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <span className="text-xl font-bold text-[#FF385C]">airbnb</span>
            </Link>

            {/* Categorías centrales */}
            <div className="flex items-end gap-8 absolute left-1/2 -translate-x-1/2">
              {categories.map((cat) => {
                const isActive = location.pathname === cat.path;
                return (
                  <Link key={cat.label} to={cat.path}
                    className={`relative flex flex-col items-center gap-1 pb-2 border-b-2 transition-all duration-200 ${
                      isActive ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                    }`}>
                    {cat.isNew && (
                      <span className="absolute -top-3 -right-5 bg-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        NUEVO
                      </span>
                    )}
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-xs font-medium whitespace-nowrap">{cat.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Menú derecho */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <button onClick={handleOpenHost}
                    className="hidden lg:block text-sm font-medium text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-full transition">
                    Conviértete en anfitrión
                  </button>

                  <button onClick={() => setShowLanguageModal(true)} className="p-3 hover:bg-gray-100 rounded-full transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="9" strokeWidth="1.5"/>
                      <path d="M12 3c2 0 3.5 4 3.5 9s-1.5 9-3.5 9-3.5-4-3.5-9 1.5-9 3.5-9z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      <path d="M3 12h18" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </button>

                  <div className="relative group">
                    <button className="flex items-center gap-3 p-2 pl-3 pr-2 border border-gray-300 rounded-full hover:shadow-md transition">
                      <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                      <div className="w-7 h-7 bg-gray-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                    </button>

                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <Link to="/profile" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                        Mi perfil
                      </Link>
                      <Link to="/my-properties" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                        Mis propiedades
                      </Link>
                      <Link to="/my-bookings" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                        Mis reservas
                      </Link>
                      <Link to="/favorites" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                        Mis favoritos
                      </Link>
                      <button onClick={handleOpenHost}
                        className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 lg:hidden">
                        Publicar propiedad
                      </button>
                      <hr className="my-2" />
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <button onClick={handleOpenHost}
                    className="hidden lg:block text-sm font-medium text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-full transition">
                    Conviértete en anfitrión
                  </button>

                  <button onClick={() => setShowLanguageModal(true)} className="p-3 hover:bg-gray-100 rounded-full transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="9" strokeWidth="1.5"/>
                      <path d="M12 3c2 0 3.5 4 3.5 9s-1.5 9-3.5 9-3.5-4-3.5-9 1.5-9 3.5-9z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      <path d="M3 12h18" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </button>

                  <div className="relative" ref={menuRef}>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="p-3 border border-gray-300 rounded-full hover:shadow-md transition">
                      <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>

                    {isMenuOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50">
                        <div className="py-2">
                          <button onClick={() => setIsMenuOpen(false)}
                            className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition">
                            Centro de ayuda
                          </button>
                          <button onClick={handleOpenHost}
                            className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition">
                            <p className="font-semibold text-gray-900">Conviértete en anfitrión</p>
                            <p className="text-xs text-gray-500">Es fácil comenzar a hospedar y ganar un dinero extra.</p>
                          </button>
                          <button onClick={() => setIsMenuOpen(false)}
                            className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition">
                            Invita a un anfitrión
                          </button>
                          <button onClick={() => setIsMenuOpen(false)}
                            className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition">
                            Tarjetas de regalo
                          </button>
                        </div>
                        <hr className="my-2 border-gray-200" />
                        <div className="py-2">
                          <button onClick={handleOpenLogin}
                            className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition">
                            Inicia sesión o regístrate
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <LanguageModal isOpen={showLanguageModal} onClose={() => setShowLanguageModal(false)} />
    </>
  );
}