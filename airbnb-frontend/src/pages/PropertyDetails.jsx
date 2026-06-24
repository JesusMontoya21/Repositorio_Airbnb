import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function PropertyDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [bookingError, setBookingError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const res = await api.get(`/properties/${id}`);
      return res.data;
    },
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      const res = await api.get(`/properties/${id}/reviews`);
      return res.data;
    },
  });

  const { data: availability } = useQuery({
    queryKey: ['propertyAvailability', id],
    queryFn: async () => {
      const res = await api.get(`/properties/${id}/availability`);
      return res.data;
    },
    enabled: !!id,
  });

  const { data: quote, error: quoteError } = useQuery({
    queryKey: ['propertyQuote', id, checkIn, checkOut, guests],
    queryFn: async () => {
      const res = await api.post(`/properties/${id}/quote`, {
        check_in: checkIn,
        check_out: checkOut,
        guests,
      });
      return res.data;
    },
    enabled: !!id && !!checkIn && !!checkOut,
    retry: false,
  });

  const overlapsBlockedRange = (start, end) => {
    const blocked = availability?.blocked_ranges || [];
    return blocked.some((range) => start < range.check_out && end > range.check_in);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingError('');
    if (!user) { navigate('/login'); return; }
    if (!checkIn || !checkOut) { setBookingError('Selecciona las fechas de entrada y salida'); return; }
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    if (nights <= 0) { setBookingError('La fecha de salida debe ser posterior a la de entrada'); return; }
    if (overlapsBlockedRange(checkIn, checkOut)) {
      setBookingError('Las fechas seleccionadas están ocupadas. Elige otras fechas.');
      return;
    }
    if (!quote?.available) {
      setBookingError('No se pudo confirmar la disponibilidad actual. Intenta con otras fechas.');
      return;
    }
    setBookingLoading(true);
    try {
      await api.post('/bookings', {
        property_id: property.id,
        check_in: checkIn,
        check_out: checkOut,
        guests,
      });
      alert('¡Reserva creada exitosamente!');
      navigate('/my-bookings');
    } catch (error) {
      setBookingError(error.response?.data?.message || 'Error al crear la reserva');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewLoading(true);
    try {
      await api.post(`/properties/${id}/reviews`, { rating, comment });
      setComment('');
      setRating(5);
      setShowReviewForm(false);
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
      queryClient.invalidateQueries({ queryKey: ['property', id] });
      alert('¡Reseña enviada exitosamente!');
    } catch (error) {
      setReviewError(error.response?.data?.message || 'Error al enviar la reseña');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta reseña?')) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
      queryClient.invalidateQueries({ queryKey: ['property', id] });
    } catch (error) {
      alert('Error al eliminar la reseña');
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
        <button onClick={() => navigate('/')} className="bg-[#FF385C] text-white px-6 py-2 rounded-lg hover:bg-[#E0314F] transition">
          Volver al inicio
        </button>
      </div>
    );
  }

  const nights = checkIn && checkOut
    ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
    : 0;
  const blockedRanges = availability?.blocked_ranges || [];
  const selectedDatesBlocked = checkIn && checkOut ? overlapsBlockedRange(checkIn, checkOut) : false;

  const StarRating = ({ value, onChange }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange && onChange(star)}
          className={`text-3xl transition-colors ${star <= value ? 'text-yellow-400' : 'text-gray-300'} ${onChange ? 'hover:text-yellow-400 cursor-pointer' : 'cursor-default'}`}>
          ★
        </button>
      ))}
    </div>
  );

  const placeOffers = [
    { icon: '📶', label: 'Wifi' },
    { icon: '🍳', label: 'Cocina' },
    { icon: '🧺', label: 'Lavadora' },
    { icon: '🚗', label: 'Estacionamiento' },
    { icon: '🛁', label: 'Baño privado' },
    { icon: '🧼', label: 'Limpieza incluida' },
  ];

  const spaceHighlights = [
    {
      title: 'Habitación',
      description: `${property.bedrooms} ${property.bedrooms === 1 ? 'habitación privada' : 'habitaciones privadas'} para descansar cómodamente.`
    },
    {
      title: 'Baño',
      description: `${property.bathrooms} ${property.bathrooms === 1 ? 'baño' : 'baños'} con todos los servicios esenciales.`
    },
    {
      title: 'Zona común',
      description: 'Espacio pensado para relajarte, trabajar o recibir a tus huéspedes con comodidad.'
    },
  ];

  const mapQuery = encodeURIComponent(`${property.address || property.city}, ${property.city}, ${property.country}`);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
      <div className="flex items-center space-x-4 mb-6">
        {property.average_rating > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">⭐</span>
            <span className="font-semibold">{Number(property.average_rating).toFixed(1)}</span>
            <span className="text-gray-500">({reviews?.length || 0} reseñas)</span>
          </div>
        )}
        <span className="text-gray-600">{property.city}, {property.country}</span>
      </div>

      {/* Galería */}
      <div className="grid grid-cols-2 gap-2 mb-8 rounded-2xl overflow-hidden">
        {property.images?.length > 0 ? (
          property.images.slice(0, 5).map((img, idx) => (
            <div key={img.id} className={idx === 0 ? 'col-span-2' : ''}>
              <img src={img.url} alt={`${property.title} ${idx + 1}`}
                className="w-full object-cover" style={{ height: idx === 0 ? '400px' : '200px' }} />
            </div>
          ))
        ) : (
          <div className="col-span-2 h-96 bg-gray-200 flex items-center justify-center rounded-2xl">
            <span className="text-6xl">🏠</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info principal */}
        <div className="lg:col-span-2">
          <div className="border-b pb-6 mb-6">
            <h2 className="text-2xl font-semibold mb-2">Alojamiento en {property.city}</h2>
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
            <h3 className="text-xl font-semibold mb-4">Dónde vas a estar</h3>
            <div className="grid gap-4 md:grid-cols-3">
              {spaceHighlights.map((item) => (
                <div key={item.title} className="rounded-2xl border border-gray-200 p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-b pb-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Lo que ofrece este lugar</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {placeOffers.map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-gray-200 p-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-b pb-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Ubicación</h3>
            <div className="bg-gray-50 rounded-2xl p-6 mb-4 border border-gray-200">
              <p className="text-gray-900 font-semibold mb-1">{property.address}</p>
              <p className="text-gray-600 text-sm mb-4">{property.city}, {property.country}</p>
              <div className="overflow-hidden rounded-xl border border-gray-300 shadow-sm">
                <iframe
                  title={`Mapa de ${property.title}`}
                  className="h-96 w-full"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${mapQuery}&z=16&output=embed`}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <a href={`https://maps.google.com/?q=${mapQuery}`} target="_blank" rel="noopener noreferrer"
                className="flex-1 border border-gray-900 text-gray-900 px-4 py-3 rounded-lg font-semibold hover:bg-gray-50 transition text-center">
                Abrir en Maps
              </a>
              <a href={`https://www.google.com/search?q=${mapQuery}`} target="_blank" rel="noopener noreferrer"
                className="flex-1 bg-gray-900 text-white px-4 py-3 rounded-lg font-semibold hover:bg-black transition text-center">
                Buscar en zona
              </a>
            </div>
          </div>

          {/* Reseñas */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                ⭐ {property.average_rating > 0 ? Number(property.average_rating).toFixed(1) : 'Sin calificaciones'} · {reviews?.length || 0} reseñas
              </h3>
              {user && (
                <button onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-[#FF385C] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#E0314F] transition">
                  {showReviewForm ? 'Cancelar' : 'Escribir reseña'}
                </button>
              )}
            </div>

            {/* Formulario de reseña */}
            {showReviewForm && user && (
              <form onSubmit={handleReview} className="bg-gray-50 rounded-xl p-6 mb-6">
                <h4 className="text-lg font-semibold mb-4">Tu reseña</h4>
                {reviewError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                    {reviewError}
                  </div>
                )}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Calificación</label>
                  <StarRating value={rating} onChange={setRating} />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comentario</label>
                  <textarea value={comment} onChange={(e) => setComment(e.target.value)}
                    rows={4} placeholder="Comparte tu experiencia..."
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-gray-900 resize-none"
                    required minLength={10} />
                </div>
                <button type="submit" disabled={reviewLoading}
                  className="bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-black transition disabled:opacity-50">
                  {reviewLoading ? 'Enviando...' : 'Publicar reseña'}
                </button>
              </form>
            )}

            {/* Lista de reseñas */}
            {reviewsLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF385C]"></div>
              </div>
            ) : reviews?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No hay reseñas aún. ¡Sé el primero en escribir una!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {review.user?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{review.user?.name}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      {user?.id === review.user_id && (
                        <button onClick={() => handleDeleteReview(review.id)}
                          className="text-red-500 text-sm hover:underline">
                          Eliminar
                        </button>
                      )}
                    </div>
                    <StarRating value={review.rating} />
                    <p className="text-gray-700 mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
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
                    <input type="date" value={checkIn} onChange={(e) => {
                      const nextCheckIn = e.target.value;
                      setCheckIn(nextCheckIn);
                      if (checkOut && nextCheckIn && nextCheckIn >= checkOut) {
                        setCheckOut('');
                      }
                    }}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full text-sm focus:outline-none" required />
                  </div>
                  <div className="p-3">
                    <label className="block text-xs font-semibold mb-1">SALIDA</label>
                    <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split('T')[0]}
                      className="w-full text-sm focus:outline-none" required />
                  </div>
                </div>
                <div className="border-t p-3">
                  <label className="block text-xs font-semibold mb-1">HUÉSPEDES</label>
                  <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full text-sm focus:outline-none">
                    {[...Array(property.guests)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'huésped' : 'huéspedes'}</option>
                    ))}
                  </select>
                </div>
              </div>

              {blockedRanges.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                  <p className="font-semibold mb-1">Fechas ocupadas</p>
                  <ul className="space-y-1 max-h-28 overflow-auto">
                    {blockedRanges.slice(0, 6).map((range) => (
                      <li key={`${range.check_in}-${range.check_out}`}>
                        {range.check_in} al {range.check_out}
                      </li>
                    ))}
                    {blockedRanges.length > 6 && <li>...y {blockedRanges.length - 6} periodos más</li>}
                  </ul>
                </div>
              )}

              {selectedDatesBlocked && (
                <p className="text-sm text-red-600">
                  Las fechas seleccionadas se traslapan con una reserva existente.
                </p>
              )}

              {quoteError && !selectedDatesBlocked && (
                <p className="text-sm text-red-600">
                  {quoteError.response?.data?.message || 'No se pudo calcular el precio para esas fechas.'}
                </p>
              )}

              <button type="submit" disabled={bookingLoading || selectedDatesBlocked || (!!checkIn && !!checkOut && !quote?.available)}
                className="w-full bg-gradient-to-r from-[#E61E4D] to-[#E31C5F] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50">
                {bookingLoading ? 'Reservando...' : 'Reservar'}
              </button>
            </form>

            {nights > 0 && (
              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    ${quote?.base_price_per_night ?? property.price_per_night} x {nights} noches
                  </span>
                  <span>${quote?.subtotal ?? property.price_per_night * nights} MXN</span>
                </div>
                {quote?.nightly_breakdown?.some((night) => night.source !== 'base') && (
                  <div className="text-xs text-gray-600">
                    Precio dinámico aplicado por temporada en fechas seleccionadas.
                  </div>
                )}
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${quote?.total_price ?? property.price_per_night * nights} MXN</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}