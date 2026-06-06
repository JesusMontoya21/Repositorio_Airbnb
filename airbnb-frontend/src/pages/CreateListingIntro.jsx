import { useNavigate } from 'react-router-dom';

export default function CreateListingIntro() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
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

          {/* Botón Salir */}
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Salir
          </button>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Lado izquierdo - Texto */}
            <div>
              <h1 className="text-5xl font-semibold text-gray-900 mb-8 leading-tight">
                Empezar a utilizar Airbnb es muy sencillo
              </h1>

              {/* Pasos */}
              <div className="space-y-8">
                {/* Paso 1 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <span className="text-2xl font-semibold text-gray-900">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Describe tu espacio
                    </h3>
                    <p className="text-gray-600">
                      Agrega algunos datos básicos, como dónde está y cuántos huéspedes pueden quedarse.
                    </p>
                  </div>
                </div>

                {/* Paso 2 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <span className="text-2xl font-semibold text-gray-900">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Haz que destaque
                    </h3>
                    <p className="text-gray-600">
                      Agrega al menos cinco fotos, un título y una descripción. Nosotros te ayudamos.
                    </p>
                  </div>
                </div>

                {/* Paso 3 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <span className="text-2xl font-semibold text-gray-900">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Terminar y publicar
                    </h3>
                    <p className="text-gray-600">
                      Elige un precio inicial, verifica algunos detalles y publica tu anuncio.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lado derecho - Ilustraciones */}
            <div className="space-y-12">
              {/* Ilustración Paso 1 */}
              <div className="flex justify-center">
                <div className="relative">
                  <svg width="200" height="150" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Maleta */}
                    <rect x="50" y="40" width="100" height="80" rx="8" fill="#FF5A5F" stroke="#E0314F" strokeWidth="3"/>
                    <rect x="90" y="30" width="20" height="15" rx="3" fill="#E0314F"/>
                    <circle cx="70" cy="80" r="4" fill="white"/>
                    <circle cx="130" cy="80" r="4" fill="white"/>
                    {/* Etiqueta */}
                    <rect x="140" y="60" width="40" height="30" rx="4" fill="white" stroke="#D1D5DB" strokeWidth="2"/>
                    <line x1="150" y1="70" x2="170" y2="70" stroke="#9CA3AF" strokeWidth="2"/>
                    <line x1="150" y1="80" x2="165" y2="80" stroke="#9CA3AF" strokeWidth="2"/>
                  </svg>
                </div>
              </div>

              {/* Ilustración Paso 2 */}
              <div className="flex justify-center">
                <div className="relative">
                  <svg width="200" height="150" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Marco de foto */}
                    <rect x="40" y="30" width="120" height="90" rx="8" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="3"/>
                    <rect x="50" y="40" width="100" height="70" fill="white"/>
                    {/* Imagen simple */}
                    <circle cx="100" cy="65" r="15" fill="#FBBF24"/>
                    <path d="M60 90 L80 70 L100 85 L120 65 L140 90" stroke="#F59E0B" strokeWidth="3" fill="none"/>
                  </svg>
                </div>
              </div>

              {/* Ilustración Paso 3 */}
              <div className="flex justify-center">
                <div className="relative">
                  <svg width="200" height="150" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Puerta */}
                    <rect x="60" y="20" width="80" height="110" rx="8" fill="#10B981" stroke="#059669" strokeWidth="3"/>
                    <circle cx="120" cy="75" r="5" fill="white"/>
                    {/* Planta */}
                    <ellipse cx="160" cy="120" rx="20" ry="10" fill="#6EE7B7"/>
                    <circle cx="160" cy="110" r="12" fill="#34D399"/>
                    <circle cx="155" cy="105" r="8" fill="#10B981"/>
                    <circle cx="165" cy="105" r="8" fill="#10B981"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer con botón */}
      <footer className="fixed bottom-0 w-full bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-end">
          <button
            onClick={() => navigate('/create-property')}
            className="px-8 py-3 bg-gradient-to-r from-[#E61E4D] to-[#E31C5F] hover:from-[#D70466] hover:to-[#BD1E59] text-white font-semibold rounded-lg transition-all shadow-lg"
          >
            Empieza
          </button>
        </div>
      </footer>
    </div>
  );
}