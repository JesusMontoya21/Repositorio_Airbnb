import React, { useState } from 'react';

export default function LoginModal({ isOpen, onClose }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('México (+52)');

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop oscuro */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-[568px] max-h-[90vh] overflow-y-auto shadow-2xl">
          
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center rounded-t-2xl">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-base font-semibold text-gray-900 flex-1 text-center mr-10">
              Inicia sesión o regístrate
            </h2>
          </div>

          {/* Contenido */}
          <div className="p-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              ¡Te damos la bienvenida a Airbnb!
            </h3>

            {/* Selector de país */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                País/Región
              </label>
              <select 
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option>México (+52)</option>
                <option>Estados Unidos (+1)</option>
                <option>España (+34)</option>
                <option>Colombia (+57)</option>
                <option>Argentina (+54)</option>
              </select>
            </div>

            {/* Input de teléfono */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Número telefónico
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder=""
                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            {/* Texto legal */}
            <p className="text-xs text-gray-600 mb-4">
              Te vamos a confirmar el número por teléfono o mensaje de texto. Sujeto a tarifas estándar para mensajes y datos.{' '}
              <a href="#" className="font-semibold underline hover:text-gray-900">
                Política de privacidad
              </a>
            </p>

            {/* Botón Continuar */}
            <button className="w-full bg-gradient-to-r from-[#E61E4D] to-[#E31C5F] hover:from-[#D70466] hover:to-[#BD1E59] text-white font-semibold py-3.5 rounded-lg transition-all mb-4">
              Continuar
            </button>

            {/* Separador */}
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-xs text-gray-500">o</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Botones de redes sociales */}
            <div className="space-y-3">
              {/* Google */}
              <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-medium text-gray-900">Continuar con Google</span>
              </button>

              {/* Apple */}
              <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span className="text-sm font-medium text-gray-900">Continuar con Apple</span>
              </button>

              {/* Email */}
              <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">Continuar con un correo electrónico</span>
              </button>

              {/* Facebook */}
              <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-sm font-medium text-gray-900">Continuar con Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}