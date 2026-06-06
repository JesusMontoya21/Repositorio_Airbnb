import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ServiceDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const { data: service, isLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      const res = await api.get(`/services/${id}`);
      return res.data;
    },
  });

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingError('');
    if (!user) { navigate('/login'); return; }
    if (!date) { setBookingError('Selecciona una fecha'); return; }
    setBookingLoading(true);
    try {
      await api.post('/service-bookings', {
        service_id: service.id,
        date,
        guests,
        total_price: service.price * guests,
      });
      alert('¡Reservación creada exitosamente! Revisa tu correo para la confirmación.');
      navigate('/my-bookings');
    } catch (error) {
      setBookingError(error.response?.data?.message || 'Error al crear la reservación');
    } finally {
      setBookingLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF385C]"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="text-6xl mb-4">🛎️</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Servicio no encontrado</h3>
        <button onClick={() => navigate('/services')} className="bg-[#FF385C] text-white px-6 py-2 rounded-lg hover:bg-[#E0314F] transition">
          Volver a Servicios
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate('/services')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a Servicios
      </button>

      <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
        <img src={service.image} alt={service.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800'; }} />
        <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-semibold">
          {service.category}
        </div>
        {service.rating > 0 && (
          <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <span className="text-yellow-500">⭐</span>
            {Number(service.rating).toFixed(2)}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.title}</h1>
          <p className="text-gray-600 mb-6">{service.location}</p>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-700">
              <span>📍</span>
              <span>{service.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span>🏷️</span>
              <span>{service.category}</span>
            </div>
          </div>

          <div className="border-t pt-6 mb-6">
            <h2 className="text-xl font-semibold mb-3">Descripción</h2>
            <p className="text-gray-700 leading-relaxed">{service.description || 'Sin descripción disponible.'}</p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="border rounded-2xl shadow-lg p-6 sticky top-20">
            <div className="mb-4">
              <span className="text-2xl font-bold">Desde ${service.price} MXN</span>
              <span className="text-gray-600 text-sm block">por participante</span>
            </div>

            {service.rating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-500">⭐</span>
                <span className="font-semibold">{Number(service.rating).toFixed(2)}</span>
              </div>
            )}

            {bookingError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
                {bookingError}
              </div>
            )}

            <form onSubmit={handleBooking} className="space-y-4">
              <div className="border rounded-xl overflow-hidden">
                <div className="p-3">
                  <label className="block text-xs font-semibold mb-1">FECHA</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full text-sm focus:outline-none" required />
                </div>
                <div className="border-t p-3">
                  <label className="block text-xs font-semibold mb-1">PERSONAS</label>
                  <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full text-sm focus:outline-none">
                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'persona' : 'personas'}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" disabled={bookingLoading}
                className="w-full bg-gradient-to-r from-[#E61E4D] to-[#E31C5F] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50">
                {bookingLoading ? 'Contratando...' : 'Contratar servicio'}
              </button>
            </form>

            {date && (
              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span>${service.price} x {guests} {guests === 1 ? 'persona' : 'personas'}</span>
                  <span>${service.price * guests} MXN</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${service.price * guests} MXN</span>
                </div>
              </div>
            )}

            <p className="text-center text-sm text-gray-500 mt-3">No se hará ningún cargo por ahora</p>
          </div>
        </div>
      </div>
    </div>
  );
}