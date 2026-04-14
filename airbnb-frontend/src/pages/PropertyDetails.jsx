import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function PropertyDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [bookingError, setBookingError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const res = await api.get(`/properties/${id}`);
      return res.data;
    },
  });

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingError('');

    if (!user) {
      navigate('/login');
      return;
    }

    if (!checkIn || !checkOut) {
      setBookingError('Selecciona las fechas de entrada y salida');
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      setBookingError('La fecha de salida debe ser posterior a la de entrada');
      return;
    }

    setBookingLoading(true);
    try {
      await api.post('/bookings', {
        property_id: property.id,
        check_in: checkIn,
        check_out: checkOut,
        guests,
        total_price: nights * property.price_per_night,
      });
      alert('¡Reserva creada exitosamente!');
      navigate('/my-bookings');
    } catch (error) {
      setBookingError(error.response?.data?.message || 'Error al crear la reserva');
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

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="text-6xl mb-4">🏠</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Propiedad no encontrada</h3>
        <p className="text-gray-500 mb-4">La propiedad que buscas no existe o fue eliminada</p>
        <button onClick={() => navigate('/')} className="bg-[#FF385C] text-white px-6 py-2 rounded-lg hover:bg-[#E0314F] transition">
          Volver al inicio
        </button>
      </div>
    );
  }

  const nights = checkIn && checkOut
    ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Título */}
      <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
      <div className="flex items-center space-x-4 mb-6">
        {property.average_rating > 0 && (
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">⭐</span>
            <span className="font-semibold">{Number(property.average_rating).toFixed(1)}</span>
          </div>
        )}
        <span className="text-gray-600">{property.city}, {property.country}</span>
      </div>

      {/* Galería de imágenes */}
      <div className="grid grid-cols-2 gap-2 mb-8 rounded-2xl overflow-hidden">
        {property.images?.length > 0 ? (
          property.images.slice(0, 5).map((img, idx) => (
            <div key={img.id} className={idx === 0 ? 'col-span-2' : ''}>
              <img
                src={img.url}
                alt={`${property.title} ${idx + 1}`}
                className="w-full object-cover"
                style={{ height: idx === 0 ? '400px' : '200px' }}
              />
            </div>
          ))
        ) : (
          <div className="col-span-2 h-96 bg-gray-200 flex items-center justify-center rounded-2xl">
            <span className="text-6xl">🏠</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Información principal */}
        <div className="lg:col-span-2">
          <div className="border-b pb-6 mb-6">
            <h2 className="text-2xl font-semibold mb-2">
              Alojamiento en {property.city}
            </h2>
            <div className="flex flex-wrap gap-2 text-gray-600">
              <span>{property.guests} huéspedes</span>
              <span>·</span>
              <span>{property.bedrooms} habitaciones</span>
              <span>·</span>
              <span>{property.bathrooms} baños</span>
            </div>
          </div>

          <div className="border-b pb-6 mb-6">
            <h3 className="text-xl font-semibold mb-3">Descripción</h3>
            <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
          </div>

          <div className="border-b pb-6 mb-6">
            <h3 className="text-xl font-semibold mb-3">Ubicación</h3>
            <p className="text-gray-700">{property.address}</p>
            <p className="text-gray-500">{property.city}, {property.country}</p>
          </div>
        </div>

        {/* Card de reserva */}
        <div className="lg:col-span-1">
          <div className="border rounded-2xl shadow-lg p-6 sticky top-20">
            <div className="mb-4">
              <span className="text-2xl font-bold">${property.price_per_night} MXN</span>
              <span className="text-gray-600"> / noche</span>
            </div>

            {bookingError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
                {bookingError}
              </div>
            )}

            <form onSubmit={handleBooking} className="space-y-4">
              <div className="border rounded-xl overflow-hidden">
                <div className="grid grid-cols-2 divide-x">
                  <div className="p-3">
                    <label className="block text-xs font-semibold mb-1">LLEGADA</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full text-sm focus:outline-none"
                      required
                    />
                  </div>
                  <div className="p-3">
                    <label className="block text-xs font-semibold mb-1">SALIDA</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split('T')[0]}
                      className="w-full text-sm focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="border-t p-3">
                  <label className="block text-xs font-semibold mb-1">HUÉSPEDES</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full text-sm focus:outline-none"
                  >
                    {[...Array(property.guests)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'huésped' : 'huéspedes'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full bg-gradient-to-r from-[#E61E4D] to-[#E31C5F] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {bookingLoading ? 'Reservando...' : 'Reservar'}
              </button>
            </form>

            {nights > 0 && (
              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span>${property.price_per_night} x {nights} noches</span>
                  <span>${property.price_per_night * nights} MXN</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${property.price_per_night * nights} MXN</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}