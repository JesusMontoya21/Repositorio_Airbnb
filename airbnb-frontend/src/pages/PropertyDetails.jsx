import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { propertiesAPI, bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function PropertyDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [bookingError, setBookingError] = useState('');

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertiesAPI.getOne(id).then(res => res.data),
  });

  const bookingMutation = useMutation({
    mutationFn: (bookingData) => bookingsAPI.create(bookingData),
    onSuccess: () => {
      alert('¡Reserva creada exitosamente!');
      navigate('/my-bookings');
    },
    onError: (error) => {
      setBookingError(error.response?.data?.message || 'Error al crear la reserva');
    },
  });

  const handleBooking = (e) => {
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

    const totalPrice = nights * property.price_per_night;

    bookingMutation.mutate({
      property_id: property.id,
      check_in: checkIn,
      check_out: checkOut,
      guests,
      total_price: totalPrice,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Propiedad no encontrada</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Título */}
      <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
      <div className="flex items-center space-x-4 mb-6">
        {property.average_rating && (
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">⭐</span>
            <span className="font-semibold">{property.average_rating.toFixed(1)}</span>
            <span className="text-gray-600 ml-1">({property.total_reviews} reseñas)</span>
          </div>
        )}
        <span className="text-gray-600">
          {property.city}, {property.country}
        </span>
      </div>

      {/* Galería de imágenes */}
      <div className="grid grid-cols-2 gap-2 mb-8 rounded-lg overflow-hidden">
        {property.images?.length > 0 ? (
          property.images.slice(0, 5).map((img, idx) => (
            <div
              key={img.id}
              className={idx === 0 ? 'col-span-2 row-span-2' : ''}
            >
              <img
                src={img.url}
                alt={`${property.title} ${idx + 1}`}
                className="w-full h-full object-cover"
                style={{ height: idx === 0 ? '400px' : '200px' }}
              />
            </div>
          ))
        ) : (
          <div className="col-span-2 h-96 bg-gray-200 flex items-center justify-center">
            <span className="text-6xl">🏠</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Información principal */}
        <div className="lg:col-span-2">
          <div className="border-b pb-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">
              {property.property_type} alojado por {property.user?.name}
            </h2>
            <div className="flex space-x-4 text-gray-600">
              <span>{property.guests} huéspedes</span>
              <span>·</span>
              <span>{property.bedrooms} habitaciones</span>
              <span>·</span>
              <span>{property.beds} camas</span>
              <span>·</span>
              <span>{property.bathrooms} baños</span>
            </div>
          </div>

          <div className="border-b pb-6 mb-6">
            <h3 className="text-xl font-semibold mb-3">Descripción</h3>
            <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
          </div>

          {property.amenities?.length > 0 && (
            <div className="border-b pb-6 mb-6">
              <h3 className="text-xl font-semibold mb-3">Servicios</h3>
              <div className="grid grid-cols-2 gap-3">
                {property.amenities.map((amenity) => (
                  <div key={amenity.id} className="flex items-center space-x-2">
                    <span className="text-2xl">{amenity.icon}</span>
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reseñas */}
          {property.reviews?.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Reseñas</h3>
              <div className="space-y-4">
                {property.reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{review.user?.name}</span>
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">⭐</span>
                        <span>{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Card de reserva */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg shadow-lg p-6 sticky top-20">
            <div className="mb-4">
              <span className="text-2xl font-bold">${property.price_per_night}</span>
              <span className="text-gray-600"> / noche</span>
            </div>

            {bookingError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
                {bookingError}
              </div>
            )}

            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Check-out</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Huéspedes</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  {[...Array(property.guests)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'huésped' : 'huéspedes'}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={bookingMutation.isPending}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
              >
                {bookingMutation.isPending ? 'Reservando...' : 'Reservar'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}