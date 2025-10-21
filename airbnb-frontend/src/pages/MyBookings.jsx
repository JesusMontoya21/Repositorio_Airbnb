import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { bookingsAPI } from '../services/api';

export default function MyBookings() {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => bookingsAPI.getMyBookings().then(res => res.data),
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
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Mis reservas</h1>

      {bookings?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 text-lg mb-4">No tienes reservas aún</p>
          <Link
            to="/"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition"
          >
            Explorar propiedades
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings?.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Link
                      to={`/property/${booking.property?.id}`}
                      className="text-xl font-semibold hover:text-primary transition"
                    >
                      {booking.property?.title}
                    </Link>
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {getStatusText(booking.status)}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-3">
                    {booking.property?.city}, {booking.property?.country}
                  </p>

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

                <div className="mt-4 md:mt-0 md:ml-6 text-right">
                  <p className="text-gray-500 text-sm mb-1">Total pagado</p>
                  <p className="text-2xl font-bold text-primary">
                    ${parseFloat(booking.total_price).toFixed(2)}
                  </p>
                  <Link
                    to={`/property/${booking.property?.id}`}
                    className="inline-block mt-3 text-primary hover:underline text-sm"
                  >
                    Ver propiedad →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}