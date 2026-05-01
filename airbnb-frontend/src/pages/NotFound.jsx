import { Link, useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      
      {/* Logo */}
      <Link to="/" className="mb-12">
        <span className="text-3xl font-bold text-[#FF385C]">airbnb</span>
      </Link>

      {/* Ilustración */}
      <div className="relative mb-8">
        <div className="text-[180px] font-extrabold text-gray-100 select-none leading-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-8xl">🏠</span>
        </div>
      </div>

      {/* Texto */}
      <h1 className="text-3xl font-bold text-gray-900 mb-3 text-center">
        Parece que esta página no existe
      </h1>
      <p className="text-gray-500 text-lg mb-8 text-center max-w-md">
        El enlace que seguiste puede estar roto, o la página puede haber sido eliminada.
      </p>

      {/* Botones */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate(-1)}
          className="px-8 py-3 border-2 border-gray-900 text-gray-900 font-semibold rounded-xl hover:bg-gray-50 transition">
          Volver atrás
        </button>
        <Link to="/"
          className="px-8 py-3 bg-[#FF385C] text-white font-semibold rounded-xl hover:bg-[#E0314F] transition text-center">
          Ir al inicio
        </Link>
      </div>

      {/* Links útiles */}
      <div className="mt-12 text-center">
        <p className="text-gray-500 mb-4">O explora estas páginas:</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/" className="text-[#FF385C] hover:underline font-medium">Alojamientos</Link>
          <Link to="/experiences" className="text-[#FF385C] hover:underline font-medium">Experiencias</Link>
          <Link to="/services" className="text-[#FF385C] hover:underline font-medium">Servicios</Link>
          <Link to="/my-bookings" className="text-[#FF385C] hover:underline font-medium">Mis reservas</Link>
        </div>
      </div>

    </div>
  );
}