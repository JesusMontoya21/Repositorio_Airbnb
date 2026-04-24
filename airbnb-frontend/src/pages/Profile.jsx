import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Profile() {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const dataToSend = {};
      if (formData.name !== user.name) dataToSend.name = formData.name;
      if (formData.email !== user.email) dataToSend.email = formData.email;
      if (formData.password) {
        dataToSend.password = formData.password;
        dataToSend.password_confirmation = formData.password_confirmation;
        dataToSend.current_password = formData.current_password;
      }

      const res = await api.put('/profile', dataToSend);
      setSuccess('Perfil actualizado correctamente');
      setFormData(prev => ({ ...prev, current_password: '', password: '', password_confirmation: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mi perfil</h1>

      {/* Avatar */}
      <div className="flex items-center gap-6 mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="w-20 h-20 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
          <p className="text-gray-500">{user?.email}</p>
          <p className="text-sm text-gray-400 mt-1">Miembro desde {new Date(user?.created_at).toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold mb-6">Información personal</h3>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-4">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-gray-900" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-gray-900" />
          </div>

          <hr className="my-6" />

          <h3 className="text-lg font-semibold">Cambiar contraseña</h3>
          <p className="text-sm text-gray-500">Deja en blanco si no quieres cambiarla</p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
            <input type="password" name="current_password" value={formData.current_password} onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-gray-900" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-gray-900" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar nueva contraseña</label>
            <input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-gray-900" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-[#FF385C] text-white py-3 rounded-xl font-semibold hover:bg-[#E0314F] transition disabled:opacity-50">
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  );
}