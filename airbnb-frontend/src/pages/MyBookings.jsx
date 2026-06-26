import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function MyBookings() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: bookings, isLoading: loadingBookings } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      const res = await api.get('/my-bookings');
      return res.data;
    },
  });

  const { data: experienceBookings, isLoading: loadingExperiences } = useQuery({
    queryKey: ['my-experience-bookings'],
    queryFn: async () => {
      const res = await api.get('/my-experience-bookings');
      return res.data;
    },
  });

  const { data: serviceBookings, isLoading: loadingServices } = useQuery({
    queryKey: ['my-service-bookings'],
    queryFn: async () => {
      const res = await api.get('/my-service-bookings');
      return res.data;
    },
  });

  const cancelPropertyMutation = useMutation({
    mutationFn: (id) => api.put(`/bookings/${id}/cancel`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      alert('Reserva cancelada exitosamente');
    },
  });

  const cancelExperienceMutation = useMutation({
    mutationFn: (id) => api.put(`/experience-bookings/${id}/cancel`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-experience-bookings'] });
      alert('Reserva de experiencia cancelada exitosamente');
    },
  });

  const cancelServiceMutation = useMutation({
    mutationFn: (id) => api.put(`/service-bookings/${id}/cancel`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-service-bookings'] });
      alert('Reserva de servicio cancelada exitosamente');
    },
  });

  const openConversationMutation = useMutation({
    mutationFn: async (bookingId) => {
      const res = await api.post(`/conversations/from-booking/${bookingId}`);
      return res.data;
    },
    onSuccess: (data) => {
      navigate(`/messages?conversation=${data.conversation_id}`);
    },
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      confirmed: 'bg-green-500',
      cancelled: 'bg-red-500',
      completed: 'bg-blue-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      cancelled: 'Cancelada',
      completed: 'Completada',
    };
    return texts[status] || status;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  const isLoading = loadingBookings || loadingExperiences || loadingServices;
  const hasBookings = (bookings?.length > 0) || (experienceBookings?.length > 0) || (serviceBookings?.length > 0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF385C]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Mis reservas</h1>

      {!hasBookings ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <div className="text-6xl mb-4">🗓️</div>
          <p className="text-gray-500 text-lg mb-4">No tienes reservas aún</p>
          <Link to="/" className="inline-block bg-[#FF385C] text-white px-6 py-3 rounded-lg hover:bg-[#E0314F] transition">
            Explorar propiedades
          </Link>
        </div>
      ) : (
        <div className="space-y-8">

          {/* Reservas de Hospedaje */}
          {bookings?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                🏠 Hospedaje
              </h2>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex gap-4">
                        {booking.property?.images?.[0] && (
                          <img src={booking.property.images[0].url} alt={booking.property.title}
                            className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Link to={`/property/${booking.property?.id}`}
                              className="text-xl font-semibold hover:text-[#FF385C] transition">
                              {booking.property?.title}
                            </Link>
                            <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(booking.status)}`}>
                              {getStatusText(booking.status)}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">{booking.property?.city}, {booking.property?.country}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Check-in:</span>
                              <p className="font-medium">{formatDate(booking.check_in)}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Check-out:</span>
                              <p className="font-medium">{formatDate(booking.check_out)}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Huéspedes:</span>
                              <p className="font-medium">{booking.guests}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 md:ml-6 text-right flex flex-col items-end">
                        <p className="text-gray-500 text-sm mb-1">Total</p>
                        <p className="text-2xl font-bold text-[#FF385C]">${parseFloat(booking.total_price).toFixed(2)} MXN</p>
                        {booking.status === 'pending' && (
                          <button onClick={() => window.confirm('¿Cancelar reserva?') && cancelPropertyMutation.mutate(booking.id)}
                            className="mt-2 text-red-500 hover:underline text-sm">
                            Cancelar reserva
                          </button>
                        )}
                        <button
                          onClick={() => openConversationMutation.mutate(booking.id)}
                          className="mt-2 text-[#FF385C] hover:underline text-sm"
                        >
                          Abrir chat con anfitrión
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reservas de Experiencias */}
          {experienceBookings?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                🎈 Experiencias
              </h2>
              <div className="space-y-4">
                {experienceBookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex gap-4">
                        {booking.experience?.image && (
                          <img src={booking.experience.image} alt={booking.experience.title}
                            className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Link to={`/experiences/${booking.experience?.id}`}
                              className="text-xl font-semibold hover:text-[#FF385C] transition">
                              {booking.experience?.title}
                            </Link>
                            <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(booking.status)}`}>
                              {getStatusText(booking.status)}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">{booking.experience?.location}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Fecha:</span>
                              <p className="font-medium">{formatDate(booking.date)}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Personas:</span>
                              <p className="font-medium">{booking.guests}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 md:ml-6 text-right flex flex-col items-end">
                        <p className="text-gray-500 text-sm mb-1">Total</p>
                        <p className="text-2xl font-bold text-[#FF385C]">${parseFloat(booking.total_price).toFixed(2)} MXN</p>
                        {booking.status === 'pending' && (
                          <button onClick={() => window.confirm('¿Cancelar reserva?') && cancelExperienceMutation.mutate(booking.id)}
                            className="mt-2 text-red-500 hover:underline text-sm">
                            Cancelar reserva
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reservas de Servicios */}
          {serviceBookings?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                🛎️ Servicios
              </h2>
              <div className="space-y-4">
                {serviceBookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex gap-4">
                        {booking.service?.image && (
                          <img src={booking.service.image} alt={booking.service.title}
                            className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Link to={`/services/${booking.service?.id}`}
                              className="text-xl font-semibold hover:text-[#FF385C] transition">
                              {booking.service?.title}
                            </Link>
                            <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(booking.status)}`}>
                              {getStatusText(booking.status)}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">{booking.service?.location}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Fecha:</span>
                              <p className="font-medium">{formatDate(booking.date)}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Personas:</span>
                              <p className="font-medium">{booking.guests}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 md:ml-6 text-right flex flex-col items-end">
                        <p className="text-gray-500 text-sm mb-1">Total</p>
                        <p className="text-2xl font-bold text-[#FF385C]">${parseFloat(booking.total_price).toFixed(2)} MXN</p>
                        {booking.status === 'pending' && (
                          <button onClick={() => window.confirm('¿Cancelar reserva?') && cancelServiceMutation.mutate(booking.id)}
                            className="mt-2 text-red-500 hover:underline text-sm">
                            Cancelar reserva
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}