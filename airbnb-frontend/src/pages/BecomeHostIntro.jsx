import { useNavigate } from 'react-router-dom';

export default function BecomeHostIntro() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-10 lg:px-20 py-6">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center"
            >
              <span className="text-2xl font-bold text-[#FF385C]">airbnb</span>
            </button>
            
            <button 
              onClick={() => navigate('/')}
              className="text-sm font-medium text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-full transition border border-gray-300"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-10 lg:px-20 py-24">
        <div className="grid lg:grid-cols-2 gap-28 items-center">
          {/* Lado izquierdo - Título */}
          <div>
            <h1 className="text-5xl lg:text-6xl font-semibold text-gray-900 leading-tight">
              Empezar a utilizar Airbnb es muy sencillo
            </h1>
          </div>

          {/* Lado derecho - Pasos */}
          <div>
            {/* Paso 1 */}
            <div className="flex items-start justify-between gap-8 py-10">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  1 Describe tu espacio
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  Agrega algunos datos básicos, como dónde está y cuántos huéspedes pueden quedarse.
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-pink-100 rounded-xl flex items-center justify-center">
                  <span className="text-4xl">🛏️</span>
                </div>
              </div>
            </div>

            {/* Línea divisoria */}
            <hr className="border-gray-200" />

            {/* Paso 2 */}
            <div className="flex items-start justify-between gap-8 py-10">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  2 Haz que destaque
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  Agrega al menos cinco fotos, un título y una descripción. Nosotros te ayudamos.
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-orange-100 rounded-xl flex items-center justify-center">
                  <span className="text-4xl">🖼️</span>
                </div>
              </div>
            </div>

            {/* Línea divisoria */}
            <hr className="border-gray-200" />

            {/* Paso 3 */}
            <div className="flex items-start justify-between gap-8 py-10">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  3 Terminar y publicar
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  Elige un precio inicial, verifica algunos detalles y publica tu anuncio.
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-4xl">🚪</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-7">
        <div className="max-w-[1440px] mx-auto px-10 lg:px-20 flex justify-end">
          <button
            onClick={() => navigate('/create-property')}
            className="bg-[#FF385C] text-white px-10 py-4 rounded-lg font-semibold text-base hover:bg-[#E31C5F] transition"
          >
            Empieza
          </button>
        </div>
      </div>
    </div>
  );
}