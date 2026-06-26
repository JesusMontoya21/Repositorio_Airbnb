import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

const DEFAULT_AMENITIES = [
  'wifi',
  'tv',
  'kitchen',
  'washer',
  'parking',
  'ac',
  'workspace',
  'pool',
  'jacuzzi',
  'bbq',
  'smoke_detector',
  'first_aid',
];

const AMENITY_LABELS = {
  wifi: 'Wifi',
  tv: 'TV',
  kitchen: 'Cocina',
  washer: 'Lavadora',
  parking: 'Estacionamiento',
  ac: 'Aire acondicionado',
  workspace: 'Espacio de trabajo',
  pool: 'Alberca',
  jacuzzi: 'Jacuzzi',
  bbq: 'Parrilla',
  smoke_detector: 'Detector de humo',
  first_aid: 'Botiquin',
};

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [newRule, setNewRule] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [blockForm, setBlockForm] = useState({ start_date: '', end_date: '', reason: '' });

  const { data: property, isLoading } = useQuery({
    queryKey: ['host-property', id],
    queryFn: async () => {
      const res = await api.get(`/host/properties/${id}`);
      return res.data;
    },
  });

  const { data: availability } = useQuery({
    queryKey: ['host-property-availability', id],
    queryFn: async () => {
      const res = await api.get(`/host/properties/${id}/availability`);
      return res.data;
    },
  });

  const [form, setForm] = useState(null);

  useEffect(() => {
    if (!property) return;

    setForm((prev) => {
      if (prev) return prev;

      return {
        title: property.title || '',
        description: property.description || '',
        city: property.city || '',
        country: property.country || 'Mexico',
        address: property.address || '',
        price_per_night: Number(property.price_per_night) || 1,
        guests: Number(property.guests) || 1,
        bedrooms: Number(property.bedrooms) || 0,
        bathrooms: Number(property.bathrooms) || 0.5,
        type: property.type || 'apartment',
        cancellation_policy: property.cancellation_policy || 'flexible',
        booking_preference: property.booking_preference || 'approve_first',
        guest_preference: property.guest_preference || 'any_guest',
        is_active: !!property.is_active,
        amenities: Array.isArray(property.amenities) ? property.amenities : [],
        house_rules: Array.isArray(property.house_rules) ? property.house_rules : [],
        images: (property.images || []).map((img) => img.url),
      };
    });
  }, [property]);

  const saveMutation = useMutation({
    mutationFn: (payload) => api.put(`/properties/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-properties'] });
      queryClient.invalidateQueries({ queryKey: ['host-property', id] });
      alert('Anuncio actualizado correctamente.');
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'No se pudo actualizar el anuncio.');
    },
  });

  const addBlockMutation = useMutation({
    mutationFn: (payload) => api.post(`/host/properties/${id}/availability-blocks`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host-property-availability', id] });
      setBlockForm({ start_date: '', end_date: '', reason: '' });
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'No se pudo crear el bloqueo de calendario.');
    },
  });

  const removeBlockMutation = useMutation({
    mutationFn: (blockId) => api.delete(`/host/properties/${id}/availability-blocks/${blockId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host-property-availability', id] });
    },
  });

  const knownAmenities = useMemo(() => {
    if (!form) return DEFAULT_AMENITIES;
    return Array.from(new Set([...DEFAULT_AMENITIES, ...form.amenities]));
  }, [form]);

  if (isLoading || !form) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF385C]" />
      </div>
    );
  }

  const updateField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const toggleAmenity = (amenity) => {
    setForm((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists ? prev.amenities.filter((a) => a !== amenity) : [...prev.amenities, amenity],
      };
    });
  };

  const addRule = () => {
    const trimmed = newRule.trim();
    if (!trimmed) return;
    setForm((prev) => ({ ...prev, house_rules: [...prev.house_rules, trimmed] }));
    setNewRule('');
  };

  const removeRule = (index) => {
    setForm((prev) => ({
      ...prev,
      house_rules: prev.house_rules.filter((_, i) => i !== index),
    }));
  };

  const addImage = () => {
    const trimmed = imageInput.trim();
    if (!trimmed) return;
    if (!/^https?:\/\//.test(trimmed)) {
      alert('La URL de imagen debe comenzar con http:// o https://');
      return;
    }
    setForm((prev) => ({ ...prev, images: [...prev.images, trimmed] }));
    setImageInput('');
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const saveListing = () => {
    saveMutation.mutate({
      ...form,
      price_per_night: Number(form.price_per_night),
      guests: Number(form.guests),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
    });
  };

  const submitBlock = () => {
    if (!blockForm.start_date || !blockForm.end_date) {
      alert('Selecciona fecha de inicio y fin para bloquear.');
      return;
    }

    addBlockMutation.mutate(blockForm);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-2">Anfitrion / Editar anuncio</p>
          <h1 className="text-3xl font-bold text-gray-900">Editar: {form.title}</h1>
        </div>
        <div className="flex gap-3">
          <Link to="/my-properties" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Volver
          </Link>
          <button
            onClick={saveListing}
            disabled={saveMutation.isPending}
            className="px-4 py-2 rounded-lg bg-[#FF385C] text-white hover:bg-[#E0314F] disabled:opacity-50"
          >
            {saveMutation.isPending ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-xl font-semibold">Informacion del anuncio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="border rounded-lg px-3 py-2" value={form.title} onChange={(e) => updateField('title', e.target.value)} placeholder="Titulo" />
              <select className="border rounded-lg px-3 py-2" value={form.type} onChange={(e) => updateField('type', e.target.value)}>
                <option value="apartment">Departamento</option>
                <option value="house">Casa</option>
                <option value="cabin">Cabana</option>
                <option value="hotel">Hotel</option>
                <option value="tiny_home">Minicasa</option>
              </select>
              <input className="border rounded-lg px-3 py-2" value={form.city} onChange={(e) => updateField('city', e.target.value)} placeholder="Ciudad" />
              <input className="border rounded-lg px-3 py-2" value={form.country} onChange={(e) => updateField('country', e.target.value)} placeholder="Pais" />
              <input className="border rounded-lg px-3 py-2 md:col-span-2" value={form.address} onChange={(e) => updateField('address', e.target.value)} placeholder="Direccion" />
              <textarea className="border rounded-lg px-3 py-2 md:col-span-2 min-h-[120px]" value={form.description} onChange={(e) => updateField('description', e.target.value)} placeholder="Descripcion" />
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-xl font-semibold">Capacidad y precio</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <input type="number" min="1" className="border rounded-lg px-3 py-2" value={form.price_per_night} onChange={(e) => updateField('price_per_night', e.target.value)} placeholder="Precio" />
              <input type="number" min="1" className="border rounded-lg px-3 py-2" value={form.guests} onChange={(e) => updateField('guests', e.target.value)} placeholder="Huespedes" />
              <input type="number" min="0" className="border rounded-lg px-3 py-2" value={form.bedrooms} onChange={(e) => updateField('bedrooms', e.target.value)} placeholder="Habitaciones" />
              <input type="number" min="0.5" step="0.5" className="border rounded-lg px-3 py-2" value={form.bathrooms} onChange={(e) => updateField('bathrooms', e.target.value)} placeholder="Banos" />
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-xl font-semibold">Amenidades</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {knownAmenities.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`border rounded-xl px-3 py-2 text-left transition ${
                    form.amenities.includes(amenity)
                      ? 'border-gray-900 bg-gray-100'
                      : 'border-gray-300 hover:border-gray-700'
                  }`}
                >
                  {AMENITY_LABELS[amenity] || amenity}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-xl font-semibold">Reglas de la casa</h2>
            <div className="flex gap-2">
              <input className="flex-1 border rounded-lg px-3 py-2" value={newRule} onChange={(e) => setNewRule(e.target.value)} placeholder="Ej. No fumar dentro del alojamiento" />
              <button onClick={addRule} className="px-4 py-2 rounded-lg bg-gray-900 text-white">Agregar</button>
            </div>
            <div className="space-y-2">
              {form.house_rules.map((rule, index) => (
                <div key={`${rule}-${index}`} className="flex justify-between items-center border rounded-lg px-3 py-2">
                  <span>{rule}</span>
                  <button onClick={() => removeRule(index)} className="text-red-500">Eliminar</button>
                </div>
              ))}
              {form.house_rules.length === 0 && <p className="text-gray-500 text-sm">Aun no agregas reglas.</p>}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-xl font-semibold">Fotos del anuncio</h2>
            <div className="flex gap-2">
              <input className="flex-1 border rounded-lg px-3 py-2" value={imageInput} onChange={(e) => setImageInput(e.target.value)} placeholder="https://..." />
              <button onClick={addImage} className="px-4 py-2 rounded-lg bg-gray-900 text-white">Agregar</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {form.images.map((url, index) => (
                <div key={`${url}-${index}`} className="relative border rounded-xl overflow-hidden">
                  <img src={url} alt={`Imagen ${index + 1}`} className="h-28 w-full object-cover" />
                  <button onClick={() => removeImage(index)} className="absolute top-2 right-2 bg-white text-xs rounded px-2 py-1">Quitar</button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-xl font-semibold">Politicas</h2>
            <label className="block text-sm font-medium text-gray-700">Politica de cancelacion</label>
            <select className="w-full border rounded-lg px-3 py-2" value={form.cancellation_policy} onChange={(e) => updateField('cancellation_policy', e.target.value)}>
              <option value="flexible">Flexible</option>
              <option value="moderate">Moderada</option>
              <option value="strict">Estricta</option>
            </select>

            <label className="block text-sm font-medium text-gray-700">Reservacion</label>
            <select className="w-full border rounded-lg px-3 py-2" value={form.booking_preference} onChange={(e) => updateField('booking_preference', e.target.value)}>
              <option value="approve_first">Apruebo manualmente</option>
              <option value="instant_book">Reservacion inmediata</option>
            </select>

            <label className="block text-sm font-medium text-gray-700">Tipo de huesped</label>
            <select className="w-full border rounded-lg px-3 py-2" value={form.guest_preference} onChange={(e) => updateField('guest_preference', e.target.value)}>
              <option value="any_guest">Cualquier huesped</option>
              <option value="experienced_guest">Solo huesped con experiencia</option>
            </select>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_active} onChange={(e) => updateField('is_active', e.target.checked)} />
              Publicar anuncio (activo)
            </label>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-xl font-semibold">Calendario de disponibilidad</h2>
            <p className="text-sm text-gray-600">Bloquea periodos cuando no quieras recibir reservas.</p>

            <div className="space-y-2">
              <input type="date" className="w-full border rounded-lg px-3 py-2" value={blockForm.start_date} onChange={(e) => setBlockForm((prev) => ({ ...prev, start_date: e.target.value }))} />
              <input type="date" className="w-full border rounded-lg px-3 py-2" value={blockForm.end_date} onChange={(e) => setBlockForm((prev) => ({ ...prev, end_date: e.target.value }))} />
              <input className="w-full border rounded-lg px-3 py-2" value={blockForm.reason} onChange={(e) => setBlockForm((prev) => ({ ...prev, reason: e.target.value }))} placeholder="Motivo (opcional)" />
              <button onClick={submitBlock} disabled={addBlockMutation.isPending} className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white disabled:opacity-50">
                {addBlockMutation.isPending ? 'Bloqueando...' : 'Agregar bloqueo'}
              </button>
            </div>

            <div className="space-y-2 pt-2 border-t">
              <p className="text-sm font-semibold">Bloqueos manuales</p>
              {(availability?.manual_blocks || []).map((block) => (
                <div key={block.id} className="text-sm border rounded-lg px-3 py-2 flex justify-between items-center">
                  <div>
                    <p>{block.start_date} a {block.end_date}</p>
                    {block.reason && <p className="text-gray-500">{block.reason}</p>}
                  </div>
                  <button onClick={() => removeBlockMutation.mutate(block.id)} className="text-red-500">Quitar</button>
                </div>
              ))}
              {(!availability?.manual_blocks || availability.manual_blocks.length === 0) && (
                <p className="text-sm text-gray-500">No hay bloqueos manuales.</p>
              )}
            </div>

            <div className="space-y-2 pt-2 border-t">
              <p className="text-sm font-semibold">Fechas reservadas</p>
              {(availability?.booked_ranges || []).map((booking) => (
                <div key={`booking-${booking.id}`} className="text-sm border rounded-lg px-3 py-2">
                  {booking.start_date} a {booking.end_date}
                </div>
              ))}
              {(!availability?.booked_ranges || availability.booked_ranges.length === 0) && (
                <p className="text-sm text-gray-500">Aun no hay reservas.</p>
              )}
            </div>
          </section>

          <button
            onClick={() => navigate(`/property/${id}`)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            Ver anuncio publico
          </button>
        </div>
      </div>
    </div>
  );
}
