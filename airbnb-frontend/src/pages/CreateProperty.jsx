import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { propertiesAPI } from '../services/api';

export default function CreateProperty() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: 'apartment',
    guests: 1,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    price_per_night: '',
    country: '',
    city: '',
    address: '',
  });

  const mutation = useMutation({
    mutationFn: (data) => propertiesAPI.create(data),
    onSuccess: () => {
      alert('¡Propiedad creada exitosamente!');
      navigate('/my-properties');
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Error al crear la propiedad');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    mutation.mutate(formData);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Publicar nueva propiedad</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Título</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Ej: Hermoso departamento con vista al mar"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={5}
            placeholder="Describe tu propiedad..."
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tipo de propiedad</label>
            <select
              name="property_type"
              value={formData.property_type}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="apartment">Departamento</option>
              <option value="house">Casa</option>
              <option value="villa">Villa</option>
              <option value="cabin">Cabaña</option>
              <option value="studio">Estudio</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Precio por noche ($)</label>
            <input
              type="number"
              name="price_per_night"
              value={formData.price_per_night}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Huéspedes</label>
            <input
              type="number"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              required
              min="1"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Habitaciones</label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              required
              min="0"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Camas</label>
            <input
              type="number"
              name="beds"
              value={formData.beds}
              onChange={handleChange}
              required
              min="1"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Baños</label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              required
              min="1"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">País</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ciudad</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Dirección</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => navigate('/my-properties')}
            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
          >
            {mutation.isPending ? 'Creando...' : 'Crear propiedad'}
          </button>
        </div>
      </form>
    </div>
  );
}