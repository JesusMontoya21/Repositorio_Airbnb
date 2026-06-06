import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ isOpen, onClose }) {
  const [step, setStep] = useState('main');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleClose = () => {
    setStep('main');
    setEmail('');
    setPassword('');
    setError('');
    onClose();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-[568px] max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center rounded-t-2xl">
            <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-base font-semibold text-gray-900 flex-1 text-center mr-10">
              {step === 'main' ? 'Inicia sesión o regístrate' : 'Inicia sesión con email'}
            </h2>
          </div>

          <div className="p-6">
            {step === 'main' ? (
              <>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  ¡Te damos la bienvenida a Airbnb!
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setStep('email')}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">Continuar con un correo electrónico</span>
                  </button>
                  <button
                    onClick={() => { handleClose(); navigate('/register'); }}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-[#E61E4D] to-[#E31C5F] rounded-lg hover:opacity-90 transition-colors"
                  >
                    <span className="text-sm font-medium text-white">Crear una cuenta nueva</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Inicia sesión
                </h3>
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                    {error}
                  </div>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#E61E4D] to-[#E31C5F] text-white font-semibold py-3.5 rounded-lg transition-all disabled:opacity-50"
                  >
                    {loading ? 'Cargando...' : 'Iniciar sesión'}
                  </button>
                </form>
                <button
                  onClick={() => setStep('main')}
                  className="mt-4 text-sm text-gray-600 hover:underline"
                >
                  ← Volver
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}