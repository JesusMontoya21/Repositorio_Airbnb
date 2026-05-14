import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export default function ExperienceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: experience, isLoading } = useQuery({
    queryKey: ['experience', id],
    queryFn: async () => {
      const res = await api.get(`/experiences/${id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF385C]"></div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="text-6xl mb-4">🎈</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Experiencia no encontrada</h3>
        <button onClick={() => navigate('/experiences')} className="bg-[#FF385C] text-white px-6 py-2 rounded-lg hover:bg-[#E0314F] transition">
          Volver a Experiencias
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Botón volver */}
      <button onClick={() => navigate('/experiences')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a Experiencias
      </button>

      {/* Imagen principal */}
      <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
        <img src={experience.image} alt={experience.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800'; }} />
        <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-semibold">
          {experience.category}
        </div>
        {experience.rating > 0 && (
          <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <span className="text-yellow-500">⭐</span>
            {Number(experience.rating).toFixed(2)}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info principal */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{experience.title}</h1>
          <p className="text-gray-600 mb-6">{experience.location} · {experience.city}</p>

          <div className="flex flex-wrap gap-4 mb-6">
            {experience.duration && (
              <div className="flex items-center gap-2 text-gray-700">
                <span>⏱️</span>
                <span>{experience.duration}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-700">
              <span>📍</span>
              <span>{experience.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span>🏷️</span>
              <span>{experience.category}</span>
            </div>
          </div>

          <div className="border-t pt-6 mb-6">
            <h2 className="text-xl font-semibold mb-3">Descripción</h2>
            <p className="text-gray-700 leading-relaxed">{experience.description || 'Sin descripción disponible.'}</p>
          </div>
        </div>

        {/* Card de reserva */}
        <div className="lg:col-span-1">
          <div className="border rounded-2xl shadow-lg p-6 sticky top-20">
            <div className="mb-4">
              <span className="text-2xl font-bold">Desde ${experience.price} MXN</span>
              <span className="text-gray-600 text-sm block">por persona</span>
            </div>

            {experience.rating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-500">⭐</span>
                <span className="font-semibold">{Number(experience.rating).toFixed(2)}</span>
              </div>
            )}

            <button className="w-full bg-gradient-to-r from-[#E61E4D] to-[#E31C5F] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition">
              Reservar experiencia
            </button>

            <p className="text-center text-sm text-gray-500 mt-3">No se hará ningún cargo por ahora</p>
          </div>
        </div>
      </div>
    </div>
  );
}