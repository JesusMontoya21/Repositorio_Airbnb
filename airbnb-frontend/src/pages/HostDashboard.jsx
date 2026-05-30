import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function HostDashboard() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['host-dashboard'],
    queryFn: async () => {
      const res = await api.get('/host/dashboard');
      return res.data;
    },
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF385C]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de anfitrión</h1>
          <p className="text-gray-500 mt-1">Bienvenido a tu panel de control</p>
        </div>
        <Link to="/create-property"
          className="bg-[#FF385C] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#E0314F] transition">
          + Nueva propiedad
        </Link>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">🏠</span>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Total</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{dashboard?.total_properties || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Propiedades publicadas</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">📅</span>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Total</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{dashboard?.total_bookings || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Reservaciones recibidas</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">💰</span>
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">Ingresos</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${Number(dashboard?.total_revenue || 0).toLocaleString('es-MX')}
          </p>
          <p className="text-sm text-gray-500 mt-1">MXN generados</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">⭐</span>
            <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">Promedio</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {dashboard?.average_rating > 0 ? Number(dashboard.average_rating).toFixed(1) : 'N/A'}
          </p>
          <p className="text-sm text-gray-500 mt-1">Rating promedio</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Mis propiedades */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Mis propiedades</h2>
            <Link to="/my-properties" className="text-sm text-[#FF385C] hover:underline">Ver todas →</Link>
          </div>

          {!dashboard?.properties || dashboard.properties.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">🏠</div>
              <p className="text-gray-500">No tienes propiedades aún</p>
              <Link to="/create-property" className="mt-3 inline-block text-[#FF385C] hover:underline text-sm">
                Crear tu primera propiedad
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {dashboard.properties.slice(0, 4).map((property) => (
                <div key={property.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    {property.images?.[0] ? (
                      <img src={property.images[0].url} alt={property.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-2xl">🏠</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm line-clamp-1">{property.title}</p>
                    <p className="text-xs text-gray-500">{property.city}, {property.country}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-[#FF385C]">${property.price_per_night} MXN/noche</span>
                      {property.average_rating > 0 && (
                        <span className="text-xs text-gray-500">⭐ {Number(property.average_rating).toFixed(1)}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-gray-500">
                      {property.bookings?.length || 0} reservas
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reservaciones recientes */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Reservaciones recientes</h2>
          </div>

          {!dashboard?.recent_bookings || dashboard.recent_bookings.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">📅</div>
              <p className="text-gray-500">No tienes reservaciones aún</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dashboard.recent_bookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm line-clamp-1">{booking.property?.title}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(booking.check_in)} → {formatDate(booking.check_out)}
                    </p>
                    <p className="text-xs font-semibold text-[#FF385C] mt-1">
                      ${parseFloat(booking.total_price).toLocaleString('es-MX')} MXN
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ml-2 ${getStatusColor(booking.status)}`}>
                    {getStatusText(booking.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}