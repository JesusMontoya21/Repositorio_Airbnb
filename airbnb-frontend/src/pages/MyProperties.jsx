import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export default function MyProperties() {
  const queryClient = useQueryClient();

  const { data: properties, isLoading } = useQuery({
    queryKey: ['my-properties'],
    queryFn: async () => {
      const res = await api.get('/my-properties');
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/properties/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-properties'] });
      alert('Propiedad eliminada exitosamente');
    },
    onError: () => {
      alert('Error al eliminar la propiedad');
    },
  });

  const handleDelete = (id, title) => {
    if (window.confirm(`¿Estás seguro de eliminar "${title}"?`)) {
      deleteMutation.mutate(id);
    }
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mis propiedades</h1>
        <Link to="/create-property" className="bg-[#FF385C] text-white px-6 py-3 rounded-lg hover:bg-[#E0314F] transition">
          + Nueva propiedad
        </Link>
      </div>

      {!properties || properties.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="text-6xl mb-4">🏠</div>
          <p className="text-gray-500 text-lg mb-4">No tienes propiedades publicadas</p>
          <Link to="/create-property" className="inline-block bg-[#FF385C] text-white px-6 py-3 rounded-lg hover:bg-[#E0314F] transition">
            Publicar tu primera propiedad
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative h-48 bg-gray-200">
                {property.images?.[0] ? (
                  <img src={property.images[0].url} alt={property.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-4xl">🏠</div>
                )}
                <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium ${property.is_active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                  {property.is_active ? 'Activa' : 'Inactiva'}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{property.city}, {property.country}</p>
                <p className="text-lg font-bold text-[#FF385C] mb-4">
                  ${property.price_per_night}
                  <span className="text-sm font-normal text-gray-600"> / noche</span>
                </p>
                <div className="flex space-x-2">
                  <Link to={`/property/${property.id}`}
                    className="flex-1 text-center border border-[#FF385C] text-[#FF385C] px-4 py-2 rounded-lg hover:bg-[#FF385C] hover:text-white transition">
                    Ver
                  </Link>
                  <Link to={`/host/properties/${property.id}/edit`}
                    className="flex-1 text-center border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
                    Editar
                  </Link>
                  <button onClick={() => handleDelete(property.id, property.title)}
                    disabled={deleteMutation.isPending}
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition disabled:opacity-50">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}