import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Favorites() {
  const queryClient = useQueryClient();

  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const res = await api.get('/favorites');
      return res.data;
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (propertyId) => api.post(`/favorites/${propertyId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF385C]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Mis favoritos</h1>

      {!favorites || favorites.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <div className="text-6xl mb-4">❤️</div>
          <p className="text-gray-500 text-lg mb-4">No tienes propiedades favoritas aún</p>
          <Link to="/" className="inline-block bg-[#FF385C] text-white px-6 py-3 rounded-lg hover:bg-[#E0314F] transition">
            Explorar propiedades
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((favorite) => (
            <div key={favorite.id} className="group cursor-pointer">
              <div className="relative h-48 rounded-xl overflow-hidden mb-3">
                <Link to={`/property/${favorite.property?.id}`}>
                  <img
                    src={favorite.property?.images?.[0]?.url || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400'}
                    alt={favorite.property?.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </Link>
                <button
                  onClick={() => toggleMutation.mutate(favorite.property?.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition">
                  <span className="text-[#FF385C] text-lg">❤️</span>
                </button>
              </div>
              <Link to={`/property/${favorite.property?.id}`}>
                <h3 className="font-semibold text-gray-900 line-clamp-1">{favorite.property?.title}</h3>
                <p className="text-gray-500 text-sm">{favorite.property?.city}, {favorite.property?.country}</p>
                <p className="text-sm mt-1">
                  <span className="font-semibold">${favorite.property?.price_per_night} MXN</span>
                  <span className="text-gray-500"> noche</span>
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}