import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function HostDashboard() {
  const [activeTab, setActiveTab] = useState('today');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-200 sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <svg className="h-8 w-auto" viewBox="0 0 1600 500" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <style>{`.airbnb-red{fill:none;stroke:#FF5A5F;stroke-width:50;stroke-linecap:round;stroke-linejoin:round;}`}</style>
                </defs>
                <path className="airbnb-red" d="M300 450c-120 0-240-180-240-300 0-66 54-120 120-120s120 54 120 120c0-66 54-120 120-120s120 54 120 120c0 120-120 300-240 300z M300 348a108 108 0 1 1 0-216 108 108 0 0 1 0 216z"/>
                <path className="airbnb-red" d="M600 375h-75v-100c0-20 15-35 35-35h40V125h-40c-60 0-95 35-95 90v160h-75V125h75v50c25-30 60-50 115-50h40c60 0 95 35 95 90v160h-75z"/>
                <path className="airbnb-red" d="M850 375c-70 0-120-50-120-125s50-125 120-125c70 0 120 50 120 125s-50 125-120 125zm0-180c-25 0-45 20-45 55s20 55 45 55c25 0 45-20 45-55s-20-55-45-55z"/>
                <path className="airbnb-red" d="M1025 375c-70 0-120-50-120-125s50-125 120-125c70 0 120 50 120 125s-50 125-120 125zm0-180c-25 0-45 20-45 55s20 55 45 55c25 0 45-20 45-55s-20-55-45-55z"/>
                <path className="airbnb-red" d="M1200 375c-70 0-120-50-120-125s50-125 120-125c70 0 120 50 120 125s-50 125-120 125zm0-180c-25 0-45 20-45 55s20 55 45 55c25 0 45-20 45-55s-20-55-45-55z"/>
                <path className="airbnb-red" d="M1375 375V125h75v250z"/>
              </svg>
            </Link>

            {/* Menú central */}
            <div className="hidden md:flex items-center space-x-8">
              <button className="text-base font-medium text-gray-900 px-4 py-2 rounded-full hover:bg-gray-100 transition border-2 border-gray-900">
                Hoy
              </button>
              <button className="text-base font-normal text-gray-700 px-4 py-2 rounded-full hover:bg-gray-100 transition">
                Calendario
              </button>
              <button className="text-base font-normal text-gray-700 px-4 py-2 rounded-full hover:bg-gray-100 transition">
                Anuncios
              </button>
              <button className="text-base font-normal text-gray-700 px-4 py-2 rounded-full hover:bg-gray-100 transition">
                Mensajes
              </button>
            </div>

            {/* Menú derecho */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/')}
                className="text-sm font-medium text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-full transition"
              >
                Usar como huésped
              </button>
              
              <button className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-semibold">
                M
              </button>
              
              <button className="p-2 hover:bg-gray-100 rounded-full transition">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Pestañas */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-full bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab('today')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'today'
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Hoy
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Próximas
            </button>
          </div>
        </div>

        {/* Estado vacío */}
        <div className="flex flex-col items-center justify-center py-20">
          {/* Icono del libro */}
          <div className="mb-8">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Libro abierto */}
              <path d="M20 30C20 26.6863 22.6863 24 26 24H50C53.3137 24 56 26.6863 56 30V90C56 93.3137 53.3137 96 50 96H26C22.6863 96 20 93.3137 20 90V30Z" fill="#E8E8E8"/>
              <path d="M64 30C64 26.6863 66.6863 24 70 24H94C97.3137 24 100 26.6863 100 30V90C100 93.3137 97.3137 96 94 96H70C66.6863 96 64 93.3137 64 90V30Z" fill="#D4D4D4"/>
              
              {/* Líneas del libro */}
              <line x1="28" y1="35" x2="48" y2="35" stroke="#B8B8B8" strokeWidth="2" strokeLinecap="round"/>
              <line x1="28" y1="45" x2="48" y2="45" stroke="#B8B8B8" strokeWidth="2" strokeLinecap="round"/>
              <line x1="28" y1="55" x2="48" y2="55" stroke="#B8B8B8" strokeWidth="2" strokeLinecap="round"/>
              
              <line x1="72" y1="35" x2="92" y2="35" stroke="#A0A0A0" strokeWidth="2" strokeLinecap="round"/>
              <line x1="72" y1="45" x2="92" y2="45" stroke="#A0A0A0" strokeWidth="2" strokeLinecap="round"/>
              <line x1="72" y1="55" x2="92" y2="55" stroke="#A0A0A0" strokeWidth="2" strokeLinecap="round"/>
              
              {/* Marcador */}
              <rect x="56" y="30" width="8" height="40" fill="#E91E63" rx="1"/>
            </svg>
          </div>

          {/* Texto */}
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">
            No tienes ninguna reservación
          </h2>
        </div>
      </div>
    </div>
  );
}