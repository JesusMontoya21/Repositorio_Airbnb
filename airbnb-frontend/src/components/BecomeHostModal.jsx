import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BecomeHostModal({ isOpen, onClose }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNext = () => {
    if (selectedOption) {
      // Aquí puedes redirigir a la página correspondiente
      if (selectedOption === 'alojamiento') {
        navigate('/create-property');
      } else if (selectedOption === 'experiencia') {
        // navigate('/create-experience');
        console.log('Crear experiencia');
      } else if (selectedOption === 'servicio') {
        // navigate('/create-service');
        console.log('Crear servicio');
      }
      onClose();
    }
  };

  const options = [
    {
      id: 'alojamiento',
      title: 'Alojamiento',
      icon: '🏠'
    },
    {
      id: 'experiencia',
      title: 'Experiencia',
      icon: '🎈'
    },
    {
      id: 'servicio',
      title: 'Servicio',
      icon: '🛎️'
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-[920px] max-h-[90vh] overflow-y-auto shadow-2xl">
          
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5 flex items-center rounded-t-2xl">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Contenido */}
          <div className="p-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-12 text-center">
              ¿Qué quieres ofrecer?
            </h2>

            {/* Opciones en grid */}
            <div className="grid grid-cols-3 gap-6 mb-12">
              {options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={`relative p-8 rounded-2xl border-2 transition-all hover:border-gray-900 hover:shadow-lg ${
                    selectedOption === option.id
                      ? 'border-gray-900 bg-gray-50 shadow-md'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {/* Icono grande */}
                  <div className="flex flex-col items-center justify-center h-48">
                    <div className="text-8xl mb-6">
                      {option.icon}
                    </div>
                    <h3 className="text-xl font-medium text-gray-900">
                      {option.title}
                    </h3>
                  </div>

                  {/* Checkmark cuando está seleccionado */}
                  {selectedOption === option.id && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Botón Siguiente */}
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                disabled={!selectedOption}
                className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                  selectedOption
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}