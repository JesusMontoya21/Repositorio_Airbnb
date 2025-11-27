import { useState, useCallback } from 'react';

// Datos para el paso 1 (Tipo de servicio)
const serviceTypeOptions = [
  { 
    id: 'catering', 
    label: 'Catering',
    emoji: '🍱'
  },
  { 
    id: 'chef', 
    label: 'Chef',
    emoji: '👨‍🍳'
  },
  { 
    id: 'prepared_meals', 
    label: 'Comidas preparadas',
    emoji: '🍽️'
  },
  { 
    id: 'personal_training', 
    label: 'Entrenamiento personal',
    emoji: '💪'
  },
  { 
    id: 'photography', 
    label: 'Fotografía',
    emoji: '📸'
  },
  { 
    id: 'makeup', 
    label: 'Maquillaje',
    emoji: '💄'
  },
  { 
    id: 'massage', 
    label: 'Masaje',
    emoji: '💆'
  },
  { 
    id: 'hairstyling', 
    label: 'Peinado',
    emoji: '💇'
  },
  { 
    id: 'spa_treatments', 
    label: 'Tratamientos de spa',
    emoji: '🧖'
  },
  { 
    id: 'nails', 
    label: 'Uñas',
    emoji: '💅'
  },
];

// Componente para la opción de tipo de servicio
const ServiceTypeOption = ({ id, label, emoji, isSelected, onSelect }) => (
  <button
    onClick={() => onSelect(id)}
    className={`
      flex flex-col items-center justify-center p-6 
      w-full h-[140px]
      border-2 rounded-xl transition duration-200
      ${isSelected 
        ? 'border-gray-900 bg-gray-50 shadow-sm' 
        : 'border-gray-300 hover:border-gray-900 hover:bg-gray-50'
      }
    `}
  >
    <div className='text-5xl mb-3'>
      {emoji}
    </div>
    <span className="text-base font-medium text-gray-900 text-center">
      {label}
    </span>
  </button>
);

// Componente principal del flujo de creación de servicios
export default function CreateService() {
  const [currentStep, setCurrentStep] = useState(1);
  const [devMode, setDevMode] = useState(true); // Modo desarrollo
  
  // Estados para los modales del paso 5
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [showHighlightModal, setShowHighlightModal] = useState(false);
  
  // Estados para los modales del paso 8
  const [showServiceAreaModal, setShowServiceAreaModal] = useState(false);
  const [showMeetingPointModal, setShowMeetingPointModal] = useState(false);

  // Estados para modales de descuentos
  const [showEarlyBirdModal, setShowEarlyBirdModal] = useState(false);
  const [showAdvanceBookingModal, setShowAdvanceBookingModal] = useState(false);
  const [showGroupDiscountModal, setShowGroupDiscountModal] = useState(false);

  // Estado para modal de horario comercial
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingScheduleIndex, setEditingScheduleIndex] = useState(0);
  
  // Estado para almacenar los datos del formulario
  const [serviceData, setServiceData] = useState({
    serviceType: null,
    location: '',
    yearsOfExperience: 10,
    experience: '',
    title: '',
    highlight: '',
    onlineProfiles: [], // Array de perfiles { type: 'facebook', url: '' }
    // Dirección residencial
    country: 'México',
    address: '',
    apartment: '',
    zone: '',
    postalCode: '',
    city: '',
    state: '',
    // Ubicación del servicio
    serviceLocationType: null, // 'go_to_guests' o 'guests_come'
    serviceArea: '',
    meetingPoint: '',
    // Fotos
    photos: [],
    // Título y subtítulo del servicio
    serviceTitle: '',
    serviceSubtitle: '',
    // Ofertas
    offers: [],
    // Oferta temporal (mientras se crea)
    tempOffer: {
      title: '',
      description: '',
      price: '',
      priceType: 'per_guest', // 'per_guest' o 'fixed'
      minPrice: '', // Precio mínimo por reservación
      duration: '30', // Duración en minutos (default: 30)
      groupSize: '',
      photo: '', // URL de la foto seleccionada
      maxParticipants: 1, // Número máximo de participantes
      // Descuentos
      earlyBirdDiscount: '', // Descuento por tiempo limitado
      advanceBookingDiscount: false, // Descuento por reservación anticipada (20% fijo)
      groupDiscount: {
        minGuests: '',
        percentage: ''
      },
      // Horarios
      schedule: [
        {
          days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
          startTime: '9:00 a.m.',
          endTime: '5:00 p.m.'
        }
      ]
    },
    
    // Detalles del servicio (Paso 6 de 6)
    offersAlcohol: null, // Si ofrece alcohol o no
  });

  // Funciones memoizadas para actualizar el estado
  const updateServiceData = useCallback((updates) => {
    setServiceData(prev => ({ ...prev, ...updates }));
  }, []);

  // Función para generar opciones de tiempo en incrementos de 15 minutos
  const generateTimeOptions = () => {
    const times = [];
    const periods = ['a.m.', 'p.m.'];
    
    periods.forEach(period => {
      for (let hour = 12; hour <= 12; hour++) {
        times.push(`${hour}:00 ${period}`);
        times.push(`${hour}:15 ${period}`);
        times.push(`${hour}:30 ${period}`);
        times.push(`${hour}:45 ${period}`);
      }
      for (let hour = 1; hour < 12; hour++) {
        times.push(`${hour}:00 ${period}`);
        times.push(`${hour}:15 ${period}`);
        times.push(`${hour}:30 ${period}`);
        times.push(`${hour}:45 ${period}`);
      }
    });
    
    return times;
  };

  // Lógica para deshabilitar el botón "Siguiente"
  const isNextDisabled = useCallback(() => {
    switch (currentStep) {
      case 1:
        return !serviceData.serviceType;
      case 2:
        return !serviceData.location || serviceData.location.trim() === '';
      case 5:
        return !serviceData.experience && !serviceData.title;
      case 7:
        return !serviceData.address || !serviceData.postalCode || !serviceData.city || !serviceData.state;
      case 8:
        return !serviceData.serviceLocationType || 
               (serviceData.serviceLocationType === 'go_to_guests' && !serviceData.serviceArea) ||
               (serviceData.serviceLocationType === 'guests_come' && !serviceData.meetingPoint);
      case 9:
        return serviceData.photos.length < 5;
      case 10:
        return !serviceData.serviceTitle || serviceData.serviceTitle.trim() === '';
      case 14:
        return !serviceData.tempOffer.title || serviceData.tempOffer.title.trim() === '';
      case 16:
        return !serviceData.tempOffer.photo;
      case 19:
        return !serviceData.tempOffer.price || serviceData.tempOffer.price <= 0;
      case 24:
        return serviceData.offers.length === 0;
      case 25:
        return serviceData.offersAlcohol === null;
      default:
        return false;
    }
  }, [currentStep, serviceData]);

  // Lógica de navegación
  const nextStep = () => {
    if (isNextDisabled()) {
        return;
    }

    // Si estamos en el paso 23, guardar la oferta temporal al array de ofertas
    if (currentStep === 23) {
      // Agregar la oferta completa al array
      updateServiceData({
        offers: [...serviceData.offers, { ...serviceData.tempOffer }]
      });
    }

    if (currentStep < 27) {
      setCurrentStep(prev => prev + 1);
    } else {
      console.log('Servicio finalizado:', serviceData);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Cálculo de progreso para la barra
  const progress = Math.round((currentStep / 13) * 100);

  // Renderizado del contenido del paso actual
  const renderStep = (step) => {
    switch (step) {
      case 1:
        return (
          <div className="max-w-6xl mx-auto px-4 md:px-10 py-12">
            <h1 className="text-4xl md:text-5xl font-semibold mb-12 text-gray-900 text-center">
              ¿Qué servicio vas a ofrecer?
            </h1>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 max-w-5xl mx-auto">
              {serviceTypeOptions.map((option) => (
                <ServiceTypeOption
                  key={option.id}
                  id={option.id}
                  label={option.label}
                  emoji={option.emoji}
                  isSelected={serviceData.serviceType === option.id}
                  onSelect={(id) => updateServiceData({ serviceType: id })}
                />
              ))}
            </div>
          </div>
        );

      // Paso 2: ¿Dónde ofrecerás tu servicio?
      case 2:
        const selectedServiceOption = serviceTypeOptions.find(opt => opt.id === serviceData.serviceType);
        
        return (
          <div className="max-w-7xl mx-auto px-4 md:px-10 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Columna izquierda - Pregunta e input */}
              <div>
                <h1 className="text-4xl md:text-5xl font-semibold mb-12 text-gray-900">
                  ¿Dónde ofrecerás tu servicio?
                </h1>
                
                <div className="relative">
                  {/* Ícono de ubicación */}
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  
                  {/* Input de ciudad */}
                  <input
                    type="text"
                    value={serviceData.location}
                    onChange={(e) => updateServiceData({ location: e.target.value })}
                    placeholder="Ingresa una ciudad"
                    className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 transition"
                  />
                </div>
              </div>

              {/* Columna derecha - Tarjeta con servicio seleccionado */}
              <div className="flex items-center justify-center lg:justify-end">
                <div className="bg-white rounded-2xl shadow-lg p-8 w-64 flex flex-col items-center">
                  <div className="text-7xl mb-4">
                    {selectedServiceOption?.emoji}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedServiceOption?.label}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        );

      // Paso 3: Crea un anuncio - Introducción
      case 3:
        const selectedService = serviceTypeOptions.find(opt => opt.id === serviceData.serviceType);
        
        return (
          <div className="max-w-7xl mx-auto px-4 md:px-10 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Columna izquierda - Título y descripción */}
              <div>
                <h1 className="text-5xl md:text-6xl font-semibold mb-6 text-gray-900">
                  Crea un anuncio
                </h1>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  Háblanos de ti y del servicio que ofreces. Revisaremos tu anuncio para confirmar que cumple con nuestros requisitos.
                </p>
              </div>

              {/* Columna derecha - Tarjeta resumen */}
              <div className="flex items-center justify-center lg:justify-end">
                <div className="bg-white rounded-2xl shadow-lg p-8 w-72 flex flex-col items-center">
                  <div className="text-7xl mb-6">
                    {selectedService?.emoji}
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    {selectedService?.label}
                  </h2>
                  <p className="text-lg text-gray-500">
                    {serviceData.location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      // Paso 4: ¿Cuántos años has sido [servicio]? - Nuevo layout wizard
      case 4:
        const serviceLabel = serviceTypeOptions.find(opt => opt.id === serviceData.serviceType)?.label?.toLowerCase() || 'profesional';
        
        return (
          <div className={`fixed inset-0 bg-white flex ${devMode ? 'left-20' : 'left-0'}`} style={devMode ? { left: '5rem', width: 'calc(100% - 5rem)' } : {}}>
            {/* Sidebar negro izquierdo */}
            <div className="w-20 bg-black flex flex-col items-center py-6 gap-4">
              {/* Logo Airbnb */}
              <div className="mb-8">
                <svg className="h-8 w-8 text-white" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M16 1c-1.3 0-2.5.5-3.5 1.4-1 .9-1.7 2.1-2.2 3.4-.5 1.3-.8 2.7-.9 4.1-.1 1.4.1 2.9.5 4.3.4 1.4 1 2.7 1.8 3.9.8 1.2 1.8 2.3 3 3.1 1.2.9 2.5 1.5 3.9 1.9 1.4.4 2.9.5 4.3.3 1.4-.2 2.8-.6 4-1.3 1.2-.7 2.3-1.6 3.2-2.7.9-1.1 1.5-2.4 1.9-3.7.4-1.4.5-2.8.3-4.2-.2-1.4-.7-2.8-1.4-4C30.2 5.7 29.3 4.6 28.2 3.7c-1.1-.9-2.4-1.5-3.8-1.9C23 1.4 21.5 1.2 20.1 1.3c-1.4.1-2.8.5-4 1.2-1.2.7-2.3 1.6-3.1 2.8-.8 1.1-1.4 2.4-1.7 3.8-.3 1.4-.3 2.8 0 4.2.3 1.4.9 2.7 1.7 3.8.8 1.1 1.9 2.1 3.1 2.8 1.2.7 2.6 1.1 4 1.2h.2c1.3 0 2.5-.4 3.5-1.2 1-.8 1.8-1.9 2.3-3.2.5-1.3.7-2.6.6-4-.1-1.4-.5-2.7-1.2-3.9-.7-1.2-1.6-2.2-2.8-2.9-1.1-.7-2.4-1.1-3.7-1.2z"/>
                </svg>
              </div>

              {/* Íconos de navegación - 6 pasos */}
              {[1, 2, 3, 4, 5, 6].map((icon) => (
                <div 
                  key={icon}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition ${
                    icon === 1 
                      ? 'border-white bg-white' 
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {icon === 1 && (
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                  {icon === 2 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                  {icon === 3 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                  {icon === 4 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {icon === 5 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  )}
                  {icon === 6 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
              ))}

              {/* Botón salir en la parte inferior */}
              <div className="mt-auto">
                <button className="w-12 h-12 rounded-full border-2 border-gray-700 hover:border-gray-500 flex items-center justify-center transition">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <header className="h-20 border-b border-gray-200 flex items-center justify-between px-10">
                <div className="flex-1"></div>
                <div className="text-center">
                  <span className="text-sm font-semibold text-gray-900">Acerca de ti</span>
                  <span className="text-sm text-gray-500 ml-2">Paso 1 de 6</span>
                </div>
                <div className="flex-1 flex justify-end">
                  <button className="text-sm font-semibold text-gray-900 hover:underline">
                    Guardar y salir
                  </button>
                </div>
              </header>

              {/* Contenido centrado */}
              <div className="flex-1 flex items-center justify-center px-10">
                <div className="max-w-2xl w-full text-center">
                  <h1 className="text-4xl md:text-5xl font-semibold mb-12 text-gray-900">
                    ¿Cuántos años has sido {serviceLabel}?
                  </h1>

                  {/* Counter */}
                  <div className="flex items-center justify-center gap-8">
                    <button
                      onClick={() => {
                        if (serviceData.yearsOfExperience > 0) {
                          updateServiceData({ yearsOfExperience: serviceData.yearsOfExperience - 1 });
                        }
                      }}
                      className="w-12 h-12 rounded-full border-2 border-gray-300 hover:border-gray-900 flex items-center justify-center transition"
                    >
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>

                    <div className="text-8xl font-bold text-gray-900 min-w-[200px]">
                      {serviceData.yearsOfExperience}
                    </div>

                    <button
                      onClick={() => updateServiceData({ yearsOfExperience: serviceData.yearsOfExperience + 1 })}
                      className="w-12 h-12 rounded-full border-2 border-gray-300 hover:border-gray-900 flex items-center justify-center transition"
                    >
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <footer className="h-20 border-t border-gray-200 flex items-center justify-end px-10">
                <button
                  onClick={nextStep}
                  className="bg-gray-900 hover:bg-black text-white font-semibold py-3 px-8 rounded-lg transition"
                >
                  Siguiente
                </button>
              </footer>
            </div>
          </div>
        );

      // Paso 5: Comparte tus cualificaciones
      case 5:
        return (
          <div className={`fixed inset-0 bg-white flex ${devMode ? 'left-20' : 'left-0'}`} style={devMode ? { left: '5rem', width: 'calc(100% - 5rem)' } : {}}>
            {/* Sidebar negro izquierdo - mismo del paso 4 */}
            <div className="w-20 bg-black flex flex-col items-center py-6 gap-4">
              <div className="mb-8">
                <svg className="h-8 w-8 text-white" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M16 1c-1.3 0-2.5.5-3.5 1.4-1 .9-1.7 2.1-2.2 3.4-.5 1.3-.8 2.7-.9 4.1-.1 1.4.1 2.9.5 4.3.4 1.4 1 2.7 1.8 3.9.8 1.2 1.8 2.3 3 3.1 1.2.9 2.5 1.5 3.9 1.9 1.4.4 2.9.5 4.3.3 1.4-.2 2.8-.6 4-1.3 1.2-.7 2.3-1.6 3.2-2.7.9-1.1 1.5-2.4 1.9-3.7.4-1.4.5-2.8.3-4.2-.2-1.4-.7-2.8-1.4-4C30.2 5.7 29.3 4.6 28.2 3.7c-1.1-.9-2.4-1.5-3.8-1.9C23 1.4 21.5 1.2 20.1 1.3c-1.4.1-2.8.5-4 1.2-1.2.7-2.3 1.6-3.1 2.8-.8 1.1-1.4 2.4-1.7 3.8-.3 1.4-.3 2.8 0 4.2.3 1.4.9 2.7 1.7 3.8.8 1.1 1.9 2.1 3.1 2.8 1.2.7 2.6 1.1 4 1.2h.2c1.3 0 2.5-.4 3.5-1.2 1-.8 1.8-1.9 2.3-3.2.5-1.3.7-2.6.6-4-.1-1.4-.5-2.7-1.2-3.9-.7-1.2-1.6-2.2-2.8-2.9-1.1-.7-2.4-1.1-3.7-1.2z"/>
                </svg>
              </div>

              {[1, 2, 3, 4, 5, 6].map((icon) => (
                <div 
                  key={icon}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition ${
                    icon === 1 
                      ? 'border-white bg-white' 
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {icon === 1 && (
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
              ))}

              <div className="mt-auto">
                <button className="w-12 h-12 rounded-full border-2 border-gray-700 hover:border-gray-500 flex items-center justify-center transition">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <header className="h-20 border-b border-gray-200 flex items-center px-10">
                <button 
                  onClick={prevStep}
                  className="absolute left-24 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex-1 text-center">
                  <span className="text-sm font-semibold text-gray-900">Acerca de ti</span>
                  <span className="text-sm text-gray-500 ml-2">Paso 1 de 6</span>
                </div>
                
                <button className="text-sm font-semibold text-gray-900 hover:underline">
                  Guardar y salir
                </button>
              </header>

              {/* Contenido centrado */}
              <div className="flex-1 flex items-center justify-center px-10 overflow-y-auto">
                <div className="max-w-2xl w-full py-12">
                  {/* Avatar */}
                  <div className="flex justify-center mb-8">
                    <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center text-white text-3xl font-semibold">
                      M
                    </div>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-semibold mb-4 text-gray-900 text-center">
                    Comparte tus cualificaciones
                  </h1>
                  
                  <p className="text-lg text-gray-600 text-center mb-12">
                    Ayuda a los participantes a conocerte mejor
                  </p>

                  {/* Opciones */}
                  <div className="space-y-4">
                    {/* Experiencia */}
                    <button
                      onClick={() => setShowExperienceModal(true)}
                      className="w-full flex items-center justify-between p-6 bg-gray-50 hover:bg-gray-100 rounded-xl transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-200">
                          {serviceData.experience ? (
                            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          )}
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-gray-900">Experiencia</div>
                          <div className="text-sm text-gray-500">
                            {serviceData.experience || 'Agrega tu trabajo más destacado'}
                          </div>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Título */}
                    <button
                      onClick={() => setShowTitleModal(true)}
                      className="w-full flex items-center justify-between p-6 bg-gray-50 hover:bg-gray-100 rounded-xl transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-200">
                          {serviceData.title ? (
                            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          )}
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-gray-900">Título</div>
                          <div className="text-sm text-gray-500">
                            {serviceData.title || 'Agrega tu título o capacitación'}
                          </div>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Punto destacado */}
                    <button
                      onClick={() => setShowHighlightModal(true)}
                      className="w-full flex items-center justify-between p-6 bg-gray-50 hover:bg-gray-100 rounded-xl transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-200">
                          {serviceData.highlight ? (
                            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          )}
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-gray-900">
                            Punto destacado de tu trayectoria <span className="text-gray-400">(opcional)</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {serviceData.highlight || 'Agrega cualquier reconocimiento o aparición en medios'}
                          </div>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <footer className="h-20 border-t border-gray-200 flex items-center justify-between px-10">
                <button className="text-sm font-semibold text-gray-900 hover:underline">
                  Ver consejos
                </button>
                <button
                  onClick={nextStep}
                  disabled={isNextDisabled()}
                  className={`font-semibold py-3 px-8 rounded-lg transition ${
                    isNextDisabled()
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-black'
                  }`}
                >
                  Siguiente
                </button>
              </footer>
            </div>

            {/* Modal Experiencia */}
            {showExperienceModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl w-full max-w-md">
                  <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Agrega tu trabajo más destacado
                    </h2>
                    <button
                      onClick={() => setShowExperienceModal(false)}
                      className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <textarea
                      value={serviceData.experience}
                      onChange={(e) => {
                        if (e.target.value.length <= 90) {
                          updateServiceData({ experience: e.target.value });
                        }
                      }}
                      placeholder="Fui el segundo chef de Gingham, un restaurante de alta cocina de San Diego."
                      className="w-full h-32 p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:border-gray-900 transition"
                    />
                    <div className="text-sm text-gray-500 mt-2">
                      {serviceData.experience.length}/90 disponibles
                    </div>
                  </div>
                  
                  <div className="p-6 border-t border-gray-200 flex justify-between">
                    <button
                      onClick={() => setShowExperienceModal(false)}
                      className="font-semibold text-gray-900 hover:underline"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => setShowExperienceModal(false)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 px-6 rounded-lg transition"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Título */}
            {showTitleModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl w-full max-w-md">
                  <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Agrega tu título o capacitación
                    </h2>
                    <button
                      onClick={() => setShowTitleModal(false)}
                      className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <textarea
                      value={serviceData.title}
                      onChange={(e) => {
                        if (e.target.value.length <= 80) {
                          updateServiceData({ title: e.target.value });
                        }
                      }}
                      placeholder="Tengo un diploma en cocina y repostería de Le Cordon Bleu."
                      className="w-full h-32 p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:border-gray-900 transition"
                    />
                    <div className="text-sm text-gray-500 mt-2">
                      {serviceData.title.length}/80 disponibles
                    </div>
                  </div>
                  
                  <div className="p-6 border-t border-gray-200 flex justify-between">
                    <button
                      onClick={() => setShowTitleModal(false)}
                      className="font-semibold text-gray-900 hover:underline"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => setShowTitleModal(false)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 px-6 rounded-lg transition"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Punto destacado */}
            {showHighlightModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl w-full max-w-md">
                  <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Agrega cualquier reconocimiento o aparición en medios
                    </h2>
                    <button
                      onClick={() => setShowHighlightModal(false)}
                      className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <textarea
                      value={serviceData.highlight}
                      onChange={(e) => {
                        if (e.target.value.length <= 80) {
                          updateServiceData({ highlight: e.target.value });
                        }
                      }}
                      placeholder="Participé en Chopped y fui finalista."
                      className="w-full h-32 p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:border-gray-900 transition"
                    />
                    <div className="text-sm text-gray-500 mt-2">
                      {serviceData.highlight.length}/80 disponibles
                    </div>
                  </div>
                  
                  <div className="p-6 border-t border-gray-200 flex justify-between">
                    <button
                      onClick={() => setShowHighlightModal(false)}
                      className="font-semibold text-gray-900 hover:underline"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => setShowHighlightModal(false)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 px-6 rounded-lg transition"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      // Paso 6: Agrega tus perfiles en línea
      case 6:
        return (
          <div className={`fixed inset-0 bg-white flex ${devMode ? 'left-20' : 'left-0'}`} style={devMode ? { left: '5rem', width: 'calc(100% - 5rem)' } : {}}>
            {/* Sidebar negro izquierdo */}
            <div className="w-20 bg-black flex flex-col items-center py-6 gap-4">
              <div className="mb-8">
                <svg className="h-8 w-8 text-white" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M16 1c-1.3 0-2.5.5-3.5 1.4-1 .9-1.7 2.1-2.2 3.4-.5 1.3-.8 2.7-.9 4.1-.1 1.4.1 2.9.5 4.3.4 1.4 1 2.7 1.8 3.9.8 1.2 1.8 2.3 3 3.1 1.2.9 2.5 1.5 3.9 1.9 1.4.4 2.9.5 4.3.3 1.4-.2 2.8-.6 4-1.3 1.2-.7 2.3-1.6 3.2-2.7.9-1.1 1.5-2.4 1.9-3.7.4-1.4.5-2.8.3-4.2-.2-1.4-.7-2.8-1.4-4C30.2 5.7 29.3 4.6 28.2 3.7c-1.1-.9-2.4-1.5-3.8-1.9C23 1.4 21.5 1.2 20.1 1.3c-1.4.1-2.8.5-4 1.2-1.2.7-2.3 1.6-3.1 2.8-.8 1.1-1.4 2.4-1.7 3.8-.3 1.4-.3 2.8 0 4.2.3 1.4.9 2.7 1.7 3.8.8 1.1 1.9 2.1 3.1 2.8 1.2.7 2.6 1.1 4 1.2h.2c1.3 0 2.5-.4 3.5-1.2 1-.8 1.8-1.9 2.3-3.2.5-1.3.7-2.6.6-4-.1-1.4-.5-2.7-1.2-3.9-.7-1.2-1.6-2.2-2.8-2.9-1.1-.7-2.4-1.1-3.7-1.2z"/>
                </svg>
              </div>

              {[1, 2, 3, 4, 5, 6].map((icon) => (
                <div 
                  key={icon}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition ${
                    icon === 1 
                      ? 'border-white bg-white' 
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {icon === 1 && (
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      M
                    </div>
                  )}
                </div>
              ))}

              <div className="mt-auto">
                <button className="w-12 h-12 rounded-full border-2 border-gray-700 hover:border-gray-500 flex items-center justify-center transition">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <header className="h-20 border-b border-gray-200 flex items-center px-10">
                <button 
                  onClick={prevStep}
                  className="absolute left-24 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex-1 text-center">
                  <span className="text-sm font-semibold text-gray-900">Acerca de ti</span>
                  <span className="text-sm text-gray-500 ml-2">Paso 1 de 6</span>
                </div>
                
                <button className="text-sm font-semibold text-gray-900 hover:underline">
                  Guardar y salir
                </button>
              </header>

              {/* Contenido centrado */}
              <div className="flex-1 flex items-center justify-center px-10">
                <div className="max-w-2xl w-full text-center">
                  <h1 className="text-4xl md:text-5xl font-semibold mb-6 text-gray-900">
                    Agrega tus perfiles en línea
                  </h1>
                  
                  <p className="text-lg text-gray-600 mb-12 max-w-xl mx-auto">
                    Para ayudarnos a confirmar tus habilidades, puedes agregar enlaces a tus evaluaciones, artículos de prensa en los que aparezcas y tu sitio web. No se mostrarán a los huéspedes.
                  </p>

                  {/* Iconos de redes sociales */}
                  <div className="flex justify-center gap-6 mb-8">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center">
                      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </div>
                    
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center">
                      <svg className="w-10 h-10" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </div>
                    
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center">
                      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="#FF1A1A">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                      </svg>
                    </div>
                  </div>

                  {/* Botón Agrega un perfil */}
                  <button className="bg-gray-900 hover:bg-black text-white font-semibold py-3 px-8 rounded-lg transition">
                    Agrega un perfil
                  </button>
                </div>
              </div>

              {/* Footer */}
              <footer className="h-20 border-t border-gray-200 flex items-center justify-between px-10">
                <button 
                  onClick={nextStep}
                  className="text-sm font-semibold text-gray-900 hover:underline"
                >
                  Omitir
                </button>
                <button
                  onClick={nextStep}
                  className="bg-gray-900 hover:bg-black text-white font-semibold py-3 px-8 rounded-lg transition"
                >
                  Siguiente
                </button>
              </footer>
            </div>
          </div>
        );

      // Paso 7: Dirección residencial
      case 7:
        return (
          <div className={`fixed inset-0 bg-white flex ${devMode ? 'left-20' : 'left-0'}`} style={devMode ? { left: '5rem', width: 'calc(100% - 5rem)' } : {}}>
            {/* Sidebar negro izquierdo */}
            <div className="w-20 bg-black flex flex-col items-center py-6 gap-4">
              <div className="mb-8">
                <svg className="h-8 w-8 text-white" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M16 1c-1.3 0-2.5.5-3.5 1.4-1 .9-1.7 2.1-2.2 3.4-.5 1.3-.8 2.7-.9 4.1-.1 1.4.1 2.9.5 4.3.4 1.4 1 2.7 1.8 3.9.8 1.2 1.8 2.3 3 3.1 1.2.9 2.5 1.5 3.9 1.9 1.4.4 2.9.5 4.3.3 1.4-.2 2.8-.6 4-1.3 1.2-.7 2.3-1.6 3.2-2.7.9-1.1 1.5-2.4 1.9-3.7.4-1.4.5-2.8.3-4.2-.2-1.4-.7-2.8-1.4-4C30.2 5.7 29.3 4.6 28.2 3.7c-1.1-.9-2.4-1.5-3.8-1.9C23 1.4 21.5 1.2 20.1 1.3c-1.4.1-2.8.5-4 1.2-1.2.7-2.3 1.6-3.1 2.8-.8 1.1-1.4 2.4-1.7 3.8-.3 1.4-.3 2.8 0 4.2.3 1.4.9 2.7 1.7 3.8.8 1.1 1.9 2.1 3.1 2.8 1.2.7 2.6 1.1 4 1.2h.2c1.3 0 2.5-.4 3.5-1.2 1-.8 1.8-1.9 2.3-3.2.5-1.3.7-2.6.6-4-.1-1.4-.5-2.7-1.2-3.9-.7-1.2-1.6-2.2-2.8-2.9-1.1-.7-2.4-1.1-3.7-1.2z"/>
                </svg>
              </div>

              {[1, 2, 3, 4, 5, 6].map((icon) => (
                <div 
                  key={icon}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition ${
                    icon === 1 
                      ? 'border-white bg-white' 
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {icon === 1 && (
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      M
                    </div>
                  )}
                </div>
              ))}

              <div className="mt-auto">
                <button className="w-12 h-12 rounded-full border-2 border-gray-700 hover:border-gray-500 flex items-center justify-center transition">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <header className="h-20 border-b border-gray-200 flex items-center px-10">
                <button 
                  onClick={prevStep}
                  className="absolute left-24 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex-1 text-center">
                  <span className="text-sm font-semibold text-gray-900">Acerca de ti</span>
                  <span className="text-sm text-gray-500 ml-2">Paso 1 de 6</span>
                </div>
                
                <button className="text-sm font-semibold text-gray-900 hover:underline">
                  Guardar y salir
                </button>
              </header>

              {/* Contenido centrado */}
              <div className="flex-1 flex items-center justify-center px-10 overflow-y-auto">
                <div className="max-w-2xl w-full py-12">
                  <h1 className="text-4xl md:text-5xl font-semibold mb-2 text-gray-900">
                    sobre ti
                  </h1>
                  
                  <div className="mt-12">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                      ¿Cuál es tu dirección residencial?
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Los huéspedes no verán esta información.
                    </p>

                    <div className="space-y-4">
                      {/* País o región */}
                      <div>
                        <label className="block text-xs text-gray-600 mb-2">País o región</label>
                        <select
                          value={serviceData.country}
                          onChange={(e) => updateServiceData({ country: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition"
                        >
                          <option value="México">México</option>
                          <option value="Estados Unidos">Estados Unidos</option>
                          <option value="Canadá">Canadá</option>
                          <option value="España">España</option>
                        </select>
                      </div>

                      {/* Dirección */}
                      <div>
                        <label className="block text-xs text-gray-600 mb-2">Dirección</label>
                        <input
                          type="text"
                          value={serviceData.address}
                          onChange={(e) => updateServiceData({ address: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition"
                        />
                      </div>

                      {/* Departamento, puerta, etc. */}
                      <div>
                        <label className="block text-xs text-gray-600 mb-2">Departamento, puerta, etc. (si procede)</label>
                        <input
                          type="text"
                          value={serviceData.apartment}
                          onChange={(e) => updateServiceData({ apartment: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition"
                        />
                      </div>

                      {/* Zona */}
                      <div>
                        <label className="block text-xs text-gray-600 mb-2">Zona (si corresponde)</label>
                        <input
                          type="text"
                          value={serviceData.zone}
                          onChange={(e) => updateServiceData({ zone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition"
                        />
                      </div>

                      {/* Código postal */}
                      <div>
                        <label className="block text-xs text-gray-600 mb-2">Código postal</label>
                        <input
                          type="text"
                          value={serviceData.postalCode}
                          onChange={(e) => updateServiceData({ postalCode: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition"
                        />
                      </div>

                      {/* Ciudad / municipio */}
                      <div>
                        <label className="block text-xs text-gray-600 mb-2">Ciudad / municipio</label>
                        <input
                          type="text"
                          value={serviceData.city}
                          onChange={(e) => updateServiceData({ city: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition"
                        />
                      </div>

                      {/* Estado */}
                      <div>
                        <label className="block text-xs text-gray-600 mb-2">Estado</label>
                        <input
                          type="text"
                          value={serviceData.state}
                          onChange={(e) => updateServiceData({ state: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <footer className="h-20 border-t border-gray-200 flex items-center justify-end px-10">
                <button
                  onClick={nextStep}
                  disabled={isNextDisabled()}
                  className={`font-semibold py-3 px-8 rounded-lg transition ${
                    isNextDisabled()
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-black'
                  }`}
                >
                  Siguiente
                </button>
              </footer>
            </div>
          </div>
        );

      // Paso 8: ¿Dónde ofreces tu servicio?
      case 8:
        return (
          <div className={`fixed inset-0 bg-white flex ${devMode ? 'left-20' : 'left-0'}`} style={devMode ? { left: '5rem', width: 'calc(100% - 5rem)' } : {}}>
            {/* Sidebar negro izquierdo */}
            <div className="w-20 bg-black flex flex-col items-center py-6 gap-4">
              <div className="mb-8">
                <svg className="h-8 w-8 text-white" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M16 1c-1.3 0-2.5.5-3.5 1.4-1 .9-1.7 2.1-2.2 3.4-.5 1.3-.8 2.7-.9 4.1-.1 1.4.1 2.9.5 4.3.4 1.4 1 2.7 1.8 3.9.8 1.2 1.8 2.3 3 3.1 1.2.9 2.5 1.5 3.9 1.9 1.4.4 2.9.5 4.3.3 1.4-.2 2.8-.6 4-1.3 1.2-.7 2.3-1.6 3.2-2.7.9-1.1 1.5-2.4 1.9-3.7.4-1.4.5-2.8.3-4.2-.2-1.4-.7-2.8-1.4-4C30.2 5.7 29.3 4.6 28.2 3.7c-1.1-.9-2.4-1.5-3.8-1.9C23 1.4 21.5 1.2 20.1 1.3c-1.4.1-2.8.5-4 1.2-1.2.7-2.3 1.6-3.1 2.8-.8 1.1-1.4 2.4-1.7 3.8-.3 1.4-.3 2.8 0 4.2.3 1.4.9 2.7 1.7 3.8.8 1.1 1.9 2.1 3.1 2.8 1.2.7 2.6 1.1 4 1.2h.2c1.3 0 2.5-.4 3.5-1.2 1-.8 1.8-1.9 2.3-3.2.5-1.3.7-2.6.6-4-.1-1.4-.5-2.7-1.2-3.9-.7-1.2-1.6-2.2-2.8-2.9-1.1-.7-2.4-1.1-3.7-1.2z"/>
                </svg>
              </div>

              {[1, 2, 3, 4, 5, 6].map((icon) => (
                <div 
                  key={icon}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition ${
                    icon === 1 
                      ? 'border-gray-700 hover:border-gray-500'
                      : icon === 2
                      ? 'border-white bg-white'
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {icon === 1 && (
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      M
                    </div>
                  )}
                  {icon === 2 && (
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </div>
              ))}

              <div className="mt-auto">
                <button className="w-12 h-12 rounded-full border-2 border-gray-700 hover:border-gray-500 flex items-center justify-center transition">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <header className="h-20 border-b border-gray-200 flex items-center px-10">
                <button 
                  onClick={prevStep}
                  className="absolute left-24 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex-1 text-center">
                  <span className="text-sm font-semibold text-gray-900">Ubicación</span>
                  <span className="text-sm text-gray-500 ml-2">Paso 2 de 6</span>
                </div>
                
                <button className="text-sm font-semibold text-gray-900 hover:underline">
                  Guardar y salir
                </button>
              </header>

              {/* Contenido centrado */}
              <div className="flex-1 flex items-center justify-center px-10">
                <div className="max-w-2xl w-full">
                  <h1 className="text-4xl md:text-5xl font-semibold mb-6 text-gray-900 text-center">
                    ¿Dónde ofreces tu servicio?
                  </h1>
                  
                  <p className="text-lg text-gray-600 text-center mb-12">
                    Elige una opción o ambas.
                  </p>

                  {/* Opciones */}
                  <div className="space-y-4">
                    {/* Opción 1: Tú vas a donde están los participantes */}
                    <button
                      onClick={() => setShowServiceAreaModal(true)}
                      className={`w-full p-6 border-2 rounded-xl transition text-left ${
                        serviceData.serviceLocationType === 'go_to_guests'
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-300 hover:border-gray-900'
                      }`}
                    >
                      <div className="font-semibold text-gray-900 mb-1">
                        Tú vas a donde están los participantes
                      </div>
                      <div className="text-sm text-gray-600">
                        {serviceData.serviceArea || 'Establece tu área de servicio'}
                      </div>
                    </button>

                    {/* Opción 2: Los participantes van a donde estás tú */}
                    <button
                      onClick={() => setShowMeetingPointModal(true)}
                      className={`w-full p-6 border-2 rounded-xl transition text-left ${
                        serviceData.serviceLocationType === 'guests_come'
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-300 hover:border-gray-900'
                      }`}
                    >
                      <div className="font-semibold text-gray-900 mb-1">
                        Los participantes van a donde estás tú
                      </div>
                      <div className="text-sm text-gray-600">
                        {serviceData.meetingPoint || 'Agrega un punto de encuentro'}
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <footer className="h-20 border-t border-gray-200 flex items-center justify-end px-10">
                <button
                  onClick={nextStep}
                  disabled={isNextDisabled()}
                  className={`font-semibold py-3 px-8 rounded-lg transition ${
                    isNextDisabled()
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-black'
                  }`}
                >
                  Siguiente
                </button>
              </footer>
            </div>

            {/* Modal: Establece tu área de servicio */}
            {showServiceAreaModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl w-full max-w-md">
                  <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Establece tu área de servicio
                    </h2>
                    <button
                      onClick={() => setShowServiceAreaModal(false)}
                      className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-sm text-gray-600 mb-4">
                      Ingresa la dirección de tu empresa o el punto de partida y, a continuación, establece el tiempo máximo de conducción.
                    </p>

                    {/* Input de búsqueda */}
                    <div className="relative mb-4">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        value={serviceData.serviceArea}
                        onChange={(e) => updateServiceData({ serviceArea: e.target.value, serviceLocationType: 'go_to_guests' })}
                        placeholder="Indica tu punto de partida"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition"
                      />
                    </div>

                    {/* Botón de ubicación actual */}
                    <button className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900">
                        Quiero usar mi ubicación actual
                      </span>
                    </button>
                  </div>
                  
                  <div className="p-6 border-t border-gray-200 flex justify-end">
                    <button
                      onClick={() => setShowServiceAreaModal(false)}
                      className="bg-gray-900 hover:bg-black text-white font-semibold py-2 px-6 rounded-lg transition"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal: ¿Dónde te reunirás con los participantes? */}
            {showMeetingPointModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl w-full max-w-md">
                  <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                      ¿Dónde te reunirás con los participantes?
                    </h2>
                    <button
                      onClick={() => setShowMeetingPointModal(false)}
                      className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-sm text-gray-600 mb-4">
                      Esta dirección se mostrará a los huéspedes en tu anuncio.
                    </p>

                    {/* Input de búsqueda */}
                    <div className="relative mb-4">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        value={serviceData.meetingPoint}
                        onChange={(e) => updateServiceData({ meetingPoint: e.target.value, serviceLocationType: 'guests_come' })}
                        placeholder="Ingresa una dirección"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition"
                      />
                    </div>

                    {/* Botón de ubicación actual */}
                    <button className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900">
                        Quiero usar mi ubicación actual
                      </span>
                    </button>
                  </div>
                  
                  <div className="p-6 border-t border-gray-200 flex justify-end">
                    <button
                      onClick={() => setShowMeetingPointModal(false)}
                      className="bg-gray-900 hover:bg-black text-white font-semibold py-2 px-6 rounded-lg transition"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      // Paso 9: Fotos
      case 9:
        const handlePhotoUpload = (e) => {
          const files = Array.from(e.target.files);
          const newPhotos = files.map(file => URL.createObjectURL(file));
          updateServiceData({ photos: [...serviceData.photos, ...newPhotos] });
        };

        const removePhoto = (index) => {
          const newPhotos = serviceData.photos.filter((_, i) => i !== index);
          updateServiceData({ photos: newPhotos });
        };

        return (
          <div className={`fixed inset-0 bg-white flex ${devMode ? 'left-20' : 'left-0'}`} style={devMode ? { left: '5rem', width: 'calc(100% - 5rem)' } : {}}>
            {/* Sidebar negro izquierdo */}
            <div className="w-20 bg-black flex flex-col items-center py-6 gap-4">
              <div className="mb-8">
                <svg className="h-8 w-8 text-white" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M16 1c-1.3 0-2.5.5-3.5 1.4-1 .9-1.7 2.1-2.2 3.4-.5 1.3-.8 2.7-.9 4.1-.1 1.4.1 2.9.5 4.3.4 1.4 1 2.7 1.8 3.9.8 1.2 1.8 2.3 3 3.1 1.2.9 2.5 1.5 3.9 1.9 1.4.4 2.9.5 4.3.3 1.4-.2 2.8-.6 4-1.3 1.2-.7 2.3-1.6 3.2-2.7.9-1.1 1.5-2.4 1.9-3.7.4-1.4.5-2.8.3-4.2-.2-1.4-.7-2.8-1.4-4C30.2 5.7 29.3 4.6 28.2 3.7c-1.1-.9-2.4-1.5-3.8-1.9C23 1.4 21.5 1.2 20.1 1.3c-1.4.1-2.8.5-4 1.2-1.2.7-2.3 1.6-3.1 2.8-.8 1.1-1.4 2.4-1.7 3.8-.3 1.4-.3 2.8 0 4.2.3 1.4.9 2.7 1.7 3.8.8 1.1 1.9 2.1 3.1 2.8 1.2.7 2.6 1.1 4 1.2h.2c1.3 0 2.5-.4 3.5-1.2 1-.8 1.8-1.9 2.3-3.2.5-1.3.7-2.6.6-4-.1-1.4-.5-2.7-1.2-3.9-.7-1.2-1.6-2.2-2.8-2.9-1.1-.7-2.4-1.1-3.7-1.2z"/>
                </svg>
              </div>

              {[1, 2, 3, 4, 5, 6].map((icon) => (
                <div 
                  key={icon}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition ${
                    icon === 3
                      ? 'border-white bg-white'
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {icon === 1 && (
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      M
                    </div>
                  )}
                  {icon === 2 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 3 && (
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </div>
              ))}

              <div className="mt-auto">
                <button className="w-12 h-12 rounded-full border-2 border-gray-700 hover:border-gray-500 flex items-center justify-center transition">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <header className="h-20 border-b border-gray-200 flex items-center px-10">
                <button 
                  onClick={prevStep}
                  className="absolute left-24 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex-1 text-center">
                  <span className="text-sm font-semibold text-gray-900">Fotos</span>
                  <span className="text-sm text-gray-500 ml-2">Paso 3 de 6</span>
                </div>
                
                <button className="text-sm font-semibold text-gray-900 hover:underline">
                  Guardar y salir
                </button>
              </header>

              {/* Contenido centrado con scroll */}
              <div className="flex-1 overflow-y-auto px-10">
                <div className="max-w-2xl mx-auto py-12 text-center">
                  <h1 className="text-4xl md:text-5xl font-semibold mb-4 text-gray-900">
                    Agrega fotos que destaquen tus habilidades
                  </h1>
                  
                  <p className="text-lg text-gray-600 mb-12">
                    Agrega al menos 5 fotos.
                  </p>

                  {/* Grid de fotos */}
                  {serviceData.photos.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      {serviceData.photos.map((photo, index) => (
                        <div key={index} className="relative aspect-[4/3] rounded-xl overflow-hidden group">
                          <img 
                            src={photo} 
                            alt={`Foto ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => removePhoto(index)}
                            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                          >
                            <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Fotos de ejemplo cuando no hay fotos */}
                  {serviceData.photos.length === 0 && (
                    <div className="flex justify-center gap-4 mb-8">
                      <div className="w-48 h-36 rounded-xl overflow-hidden shadow-lg transform -rotate-3">
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                          <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                      </div>
                      <div className="w-48 h-36 rounded-xl overflow-hidden shadow-lg transform rotate-3">
                        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                          <svg className="w-16 h-16 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Botón Agregar */}
                  <label className="inline-block">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <span className="bg-gray-900 hover:bg-black text-white font-semibold py-3 px-8 rounded-lg transition cursor-pointer inline-block">
                      Agregar
                    </span>
                  </label>

                  {serviceData.photos.length > 0 && (
                    <p className="text-sm text-gray-600 mt-4">
                      {serviceData.photos.length} de 5 fotos mínimas
                    </p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <footer className="h-20 border-t border-gray-200 flex items-center justify-between px-10">
                <button className="text-sm font-semibold text-gray-900 hover:underline">
                  Ver consejos
                </button>
                <button
                  onClick={nextStep}
                  disabled={isNextDisabled()}
                  className={`font-semibold py-3 px-8 rounded-lg transition ${
                    isNextDisabled()
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-black'
                  }`}
                >
                  Siguiente
                </button>
              </footer>
            </div>
          </div>
        );

      // Paso 10: Ponle un título a tu servicio
      case 10:
        return (
          <div className={`fixed inset-0 bg-white flex ${devMode ? 'left-20' : 'left-0'}`} style={devMode ? { left: '5rem', width: 'calc(100% - 5rem)' } : {}}>
            {/* Sidebar negro izquierdo */}
            <div className="w-20 bg-black flex flex-col items-center py-6 gap-4">
              <div className="mb-8">
                <svg className="h-8 w-8 text-white" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M16 1c-1.3 0-2.5.5-3.5 1.4-1 .9-1.7 2.1-2.2 3.4-.5 1.3-.8 2.7-.9 4.1-.1 1.4.1 2.9.5 4.3.4 1.4 1 2.7 1.8 3.9.8 1.2 1.8 2.3 3 3.1 1.2.9 2.5 1.5 3.9 1.9 1.4.4 2.9.5 4.3.3 1.4-.2 2.8-.6 4-1.3 1.2-.7 2.3-1.6 3.2-2.7.9-1.1 1.5-2.4 1.9-3.7.4-1.4.5-2.8.3-4.2-.2-1.4-.7-2.8-1.4-4C30.2 5.7 29.3 4.6 28.2 3.7c-1.1-.9-2.4-1.5-3.8-1.9C23 1.4 21.5 1.2 20.1 1.3c-1.4.1-2.8.5-4 1.2-1.2.7-2.3 1.6-3.1 2.8-.8 1.1-1.4 2.4-1.7 3.8-.3 1.4-.3 2.8 0 4.2.3 1.4.9 2.7 1.7 3.8.8 1.1 1.9 2.1 3.1 2.8 1.2.7 2.6 1.1 4 1.2h.2c1.3 0 2.5-.4 3.5-1.2 1-.8 1.8-1.9 2.3-3.2.5-1.3.7-2.6.6-4-.1-1.4-.5-2.7-1.2-3.9-.7-1.2-1.6-2.2-2.8-2.9-1.1-.7-2.4-1.1-3.7-1.2z"/>
                </svg>
              </div>

              {[1, 2, 3, 4, 5, 6].map((icon) => (
                <div 
                  key={icon}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition ${
                    icon === 4
                      ? 'border-white bg-white'
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {icon === 1 && (
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      M
                    </div>
                  )}
                  {icon === 2 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 3 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 4 && (
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )}
                </div>
              ))}

              <div className="mt-auto">
                <button className="w-12 h-12 rounded-full border-2 border-gray-700 hover:border-gray-500 flex items-center justify-center transition">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <header className="h-20 border-b border-gray-200 flex items-center px-10">
                <button 
                  onClick={prevStep}
                  className="absolute left-24 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex-1 text-center">
                  <span className="text-sm font-semibold text-gray-900">Servicio</span>
                  <span className="text-sm text-gray-500 ml-2">Paso 4 de 6</span>
                </div>
                
                <button className="text-sm font-semibold text-gray-900 hover:underline">
                  Guardar y salir
                </button>
              </header>

              {/* Contenido centrado */}
              <div className="flex-1 flex items-center justify-center px-10">
                <div className="max-w-3xl w-full">
                  <h1 className="text-4xl md:text-5xl font-semibold mb-12 text-gray-900 text-center">
                    Ponle un título a tu servicio
                  </h1>

                  {/* Input del título */}
                  <div>
                    <textarea
                      value={serviceData.serviceTitle}
                      onChange={(e) => {
                        if (e.target.value.length <= 50) {
                          updateServiceData({ serviceTitle: e.target.value });
                        }
                      }}
                      placeholder="Mesa de temporada del chef con Alex"
                      className="w-full text-4xl md:text-5xl font-medium text-gray-300 placeholder-gray-300 border-none focus:outline-none resize-none overflow-hidden text-center"
                      style={{ 
                        minHeight: '120px',
                        color: serviceData.serviceTitle ? '#111827' : '#d1d5db'
                      }}
                      rows={2}
                    />
                    <div className="text-sm text-gray-500 text-center mt-2">
                      {serviceData.serviceTitle.length}/50 disponibles
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <footer className="h-20 border-t border-gray-200 flex items-center justify-between px-10">
                <button className="text-sm font-semibold text-gray-900 hover:underline">
                  Ver consejos
                </button>
                <button
                  onClick={nextStep}
                  disabled={isNextDisabled()}
                  className={`font-semibold py-3 px-8 rounded-lg transition ${
                    isNextDisabled()
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-black'
                  }`}
                >
                  Siguiente
                </button>
              </footer>
            </div>
          </div>
        );

      // Paso 11: Destaca tus conocimientos (subtítulo)
      case 11:
        return (
          <div className={`fixed inset-0 bg-white flex ${devMode ? 'left-20' : 'left-0'}`} style={devMode ? { left: '5rem', width: 'calc(100% - 5rem)' } : {}}>
            {/* Sidebar negro izquierdo */}
            <div className="w-20 bg-black flex flex-col items-center py-6 gap-4">
              <div className="mb-8">
                <svg className="h-8 w-8 text-white" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M16 1c-1.3 0-2.5.5-3.5 1.4-1 .9-1.7 2.1-2.2 3.4-.5 1.3-.8 2.7-.9 4.1-.1 1.4.1 2.9.5 4.3.4 1.4 1 2.7 1.8 3.9.8 1.2 1.8 2.3 3 3.1 1.2.9 2.5 1.5 3.9 1.9 1.4.4 2.9.5 4.3.3 1.4-.2 2.8-.6 4-1.3 1.2-.7 2.3-1.6 3.2-2.7.9-1.1 1.5-2.4 1.9-3.7.4-1.4.5-2.8.3-4.2-.2-1.4-.7-2.8-1.4-4C30.2 5.7 29.3 4.6 28.2 3.7c-1.1-.9-2.4-1.5-3.8-1.9C23 1.4 21.5 1.2 20.1 1.3c-1.4.1-2.8.5-4 1.2-1.2.7-2.3 1.6-3.1 2.8-.8 1.1-1.4 2.4-1.7 3.8-.3 1.4-.3 2.8 0 4.2.3 1.4.9 2.7 1.7 3.8.8 1.1 1.9 2.1 3.1 2.8 1.2.7 2.6 1.1 4 1.2h.2c1.3 0 2.5-.4 3.5-1.2 1-.8 1.8-1.9 2.3-3.2.5-1.3.7-2.6.6-4-.1-1.4-.5-2.7-1.2-3.9-.7-1.2-1.6-2.2-2.8-2.9-1.1-.7-2.4-1.1-3.7-1.2z"/>
                </svg>
              </div>

              {[1, 2, 3, 4, 5, 6].map((icon) => (
                <div 
                  key={icon}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition ${
                    icon === 4
                      ? 'border-white bg-white'
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {icon === 1 && (
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      M
                    </div>
                  )}
                  {icon === 2 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 3 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 4 && (
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )}
                </div>
              ))}

              <div className="mt-auto">
                <button className="w-12 h-12 rounded-full border-2 border-gray-700 hover:border-gray-500 flex items-center justify-center transition">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <header className="h-20 border-b border-gray-200 flex items-center px-10">
                <button 
                  onClick={prevStep}
                  className="absolute left-24 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex-1 text-center">
                  <span className="text-sm font-semibold text-gray-900">Servicio</span>
                  <span className="text-sm text-gray-500 ml-2">Paso 4 de 6</span>
                </div>
                
                <button className="text-sm font-semibold text-gray-900 hover:underline">
                  Guardar y salir
                </button>
              </header>

              {/* Contenido centrado */}
              <div className="flex-1 flex items-center justify-center px-10">
                <div className="max-w-3xl w-full">
                  <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-gray-900 text-center">
                    Destaca tus conocimientos
                  </h2>
                  
                  <p className="text-2xl font-semibold text-gray-900 text-center mb-12">
                    {serviceData.serviceTitle}
                  </p>

                  <textarea
                    value={serviceData.serviceSubtitle}
                    onChange={(e) => {
                      if (e.target.value.length <= 250) {
                        updateServiceData({ serviceSubtitle: e.target.value });
                      }
                    }}
                    placeholder='Explica qué te hace excelente. Por ejemplo, "Pongo en cada platillo las habilidades que aprendí en los mejores restaurantes".'
                    className="w-full text-base text-gray-600 placeholder-gray-400 border border-gray-300 rounded-xl p-4 focus:outline-none focus:border-gray-900 resize-none"
                    rows={4}
                  />
                  <div className="text-sm text-gray-500 text-right mt-2">
                    {serviceData.serviceSubtitle.length}/250 disponibles
                  </div>
                </div>
              </div>

              {/* Footer */}
              <footer className="h-20 border-t border-gray-200 flex items-center justify-between px-10">
                <button className="text-sm font-semibold text-gray-900 hover:underline">
                  Ver consejos
                </button>
                <button
                  onClick={nextStep}
                  className="bg-gray-900 hover:bg-black text-white font-semibold py-3 px-8 rounded-lg transition"
                >
                  Siguiente
                </button>
              </footer>
            </div>
          </div>
        );

      // Paso 12: Crea tus ofertas
      case 12:
        return (
          <div className={`fixed inset-0 bg-white flex ${devMode ? 'left-20' : 'left-0'}`} style={devMode ? { left: '5rem', width: 'calc(100% - 5rem)' } : {}}>
            {/* Sidebar negro izquierdo */}
            <div className="w-20 bg-black flex flex-col items-center py-6 gap-4">
              <div className="mb-8">
                <svg className="h-8 w-8 text-white" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M16 1c-1.3 0-2.5.5-3.5 1.4-1 .9-1.7 2.1-2.2 3.4-.5 1.3-.8 2.7-.9 4.1-.1 1.4.1 2.9.5 4.3.4 1.4 1 2.7 1.8 3.9.8 1.2 1.8 2.3 3 3.1 1.2.9 2.5 1.5 3.9 1.9 1.4.4 2.9.5 4.3.3 1.4-.2 2.8-.6 4-1.3 1.2-.7 2.3-1.6 3.2-2.7.9-1.1 1.5-2.4 1.9-3.7.4-1.4.5-2.8.3-4.2-.2-1.4-.7-2.8-1.4-4C30.2 5.7 29.3 4.6 28.2 3.7c-1.1-.9-2.4-1.5-3.8-1.9C23 1.4 21.5 1.2 20.1 1.3c-1.4.1-2.8.5-4 1.2-1.2.7-2.3 1.6-3.1 2.8-.8 1.1-1.4 2.4-1.7 3.8-.3 1.4-.3 2.8 0 4.2.3 1.4.9 2.7 1.7 3.8.8 1.1 1.9 2.1 3.1 2.8 1.2.7 2.6 1.1 4 1.2h.2c1.3 0 2.5-.4 3.5-1.2 1-.8 1.8-1.9 2.3-3.2.5-1.3.7-2.6.6-4-.1-1.4-.5-2.7-1.2-3.9-.7-1.2-1.6-2.2-2.8-2.9-1.1-.7-2.4-1.1-3.7-1.2z"/>
                </svg>
              </div>

              {[1, 2, 3, 4, 5, 6].map((icon) => (
                <div 
                  key={icon}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition ${
                    icon === 5
                      ? 'border-white bg-white'
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {icon === 1 && (
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      M
                    </div>
                  )}
                  {icon === 2 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 3 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 4 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )}
                  {icon === 5 && (
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </div>
              ))}

              <div className="mt-auto">
                <button className="w-12 h-12 rounded-full border-2 border-gray-700 hover:border-gray-500 flex items-center justify-center transition">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <header className="h-20 border-b border-gray-200 flex items-center px-10">
                <button 
                  onClick={prevStep}
                  className="absolute left-24 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex-1"></div>
                
                <button className="text-sm font-semibold text-gray-900 hover:underline">
                  Guardar y salir
                </button>
              </header>

              {/* Contenido centrado */}
              <div className="flex-1 flex items-center justify-center px-10">
                <div className="max-w-4xl w-full text-center">
                  {/* Tarjetas de ejemplo inclinadas */}
                  <div className="flex justify-center items-center gap-6 mb-16">
                    {/* Tarjeta 1 - Botanas */}
                    <div className="bg-white rounded-2xl shadow-xl p-4 w-56 transform -rotate-6 hover:rotate-0 transition">
                      <div className="w-full h-32 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                        <div className="text-4xl">🍤</div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">Botanas</h3>
                      <p className="text-sm text-gray-600">$ 49 por persona</p>
                    </div>

                    {/* Tarjeta 2 - Comida familiar */}
                    <div className="bg-white rounded-2xl shadow-xl p-4 w-56 transform rotate-2 hover:rotate-0 transition">
                      <div className="w-full h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                        <div className="text-4xl">🍖</div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">Comida familiar</h3>
                      <p className="text-sm text-gray-600">$ 90 por persona</p>
                    </div>

                    {/* Tarjeta 3 - Menú de degustación */}
                    <div className="bg-white rounded-2xl shadow-xl p-4 w-56 transform rotate-6 hover:rotate-0 transition">
                      <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                        <div className="text-4xl">🍽️</div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">Menú de degustación</h3>
                      <p className="text-sm text-gray-600">$ 175 por persona</p>
                    </div>
                  </div>

                  {/* Texto principal */}
                  <h1 className="text-5xl md:text-6xl font-semibold mb-6 text-gray-900">
                    Crea tus ofertas
                  </h1>
                  
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Esto es lo que se reservará. Agregarás una foto, algunos detalles y un precio.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <footer className="h-20 border-t border-gray-200 flex items-center justify-end px-10">
                <button
                  onClick={nextStep}
                  className="bg-gray-900 hover:bg-black text-white font-semibold py-3 px-8 rounded-lg transition"
                >
                  Siguiente
                </button>
              </footer>
            </div>
          </div>
        );

      // Paso 13: Tus ofertas
      case 13:
        return (
          <div className={`fixed inset-0 bg-white flex ${devMode ? 'left-20' : 'left-0'}`} style={devMode ? { left: '5rem', width: 'calc(100% - 5rem)' } : {}}>
            {/* Sidebar negro izquierdo */}
            <div className="w-20 bg-black flex flex-col items-center py-6 gap-4">
              <div className="mb-8">
                <svg className="h-8 w-8 text-white" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M16 1c-1.3 0-2.5.5-3.5 1.4-1 .9-1.7 2.1-2.2 3.4-.5 1.3-.8 2.7-.9 4.1-.1 1.4.1 2.9.5 4.3.4 1.4 1 2.7 1.8 3.9.8 1.2 1.8 2.3 3 3.1 1.2.9 2.5 1.5 3.9 1.9 1.4.4 2.9.5 4.3.3 1.4-.2 2.8-.6 4-1.3 1.2-.7 2.3-1.6 3.2-2.7.9-1.1 1.5-2.4 1.9-3.7.4-1.4.5-2.8.3-4.2-.2-1.4-.7-2.8-1.4-4C30.2 5.7 29.3 4.6 28.2 3.7c-1.1-.9-2.4-1.5-3.8-1.9C23 1.4 21.5 1.2 20.1 1.3c-1.4.1-2.8.5-4 1.2-1.2.7-2.3 1.6-3.1 2.8-.8 1.1-1.4 2.4-1.7 3.8-.3 1.4-.3 2.8 0 4.2.3 1.4.9 2.7 1.7 3.8.8 1.1 1.9 2.1 3.1 2.8 1.2.7 2.6 1.1 4 1.2h.2c1.3 0 2.5-.4 3.5-1.2 1-.8 1.8-1.9 2.3-3.2.5-1.3.7-2.6.6-4-.1-1.4-.5-2.7-1.2-3.9-.7-1.2-1.6-2.2-2.8-2.9-1.1-.7-2.4-1.1-3.7-1.2z"/>
                </svg>
              </div>

              {[1, 2, 3, 4, 5, 6].map((icon) => (
                <div 
                  key={icon}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition ${
                    icon === 5
                      ? 'border-white bg-white'
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {icon === 1 && (
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      M
                    </div>
                  )}
                  {icon === 2 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 3 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 4 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )}
                  {icon === 5 && (
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </div>
              ))}

              <div className="mt-auto">
                <button className="w-12 h-12 rounded-full border-2 border-gray-700 hover:border-gray-500 flex items-center justify-center transition">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <header className="h-20 border-b border-gray-200 flex items-center px-10">
                <button 
                  onClick={prevStep}
                  className="absolute left-24 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex-1 text-center">
                  <span className="text-sm font-semibold text-gray-900">Qué ofreces</span>
                  <span className="text-sm text-gray-500 ml-2">Paso 5 de 6</span>
                </div>
                
                <button className="text-sm font-semibold text-gray-900 hover:underline">
                  Guardar y salir
                </button>
              </header>

              {/* Contenido centrado */}
              <div className="flex-1 flex items-start justify-center px-10 pt-16">
                <div className="max-w-2xl w-full">
                  <h1 className="text-4xl md:text-5xl font-semibold mb-4 text-gray-900 text-center">
                    Tus ofertas
                  </h1>
                  
                  <p className="text-base text-gray-600 mb-12 text-center">
                    Agrega al menos una. Empieza con una opción accesible para atraer a más participantes.
                  </p>

                  {/* Botón para agregar primera oferta */}
                  <button 
                    onClick={() => {
                      setCurrentStep(14); // Ir al paso de crear oferta
                    }}
                    className="w-full flex items-center gap-4 p-6 border-2 border-gray-300 hover:border-gray-900 rounded-xl transition"
                  >
                    <div className="w-8 h-8 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <span className="text-base font-medium text-gray-900">
                      Agrega tu primera oferta
                    </span>
                  </button>
                </div>
              </div>

              {/* Footer */}
              <footer className="h-20 border-t border-gray-200 flex items-center justify-end px-10">
                <button
                  onClick={nextStep}
                  className="bg-gray-900 hover:bg-black text-white font-semibold py-3 px-8 rounded-lg transition"
                >
                  Siguiente
                </button>
              </footer>
            </div>
          </div>
        );

      // Paso 14: Ponle un título a tu oferta
      case 14:
        return (
          <div className={`fixed inset-0 bg-white flex ${devMode ? 'left-20' : 'left-0'}`} style={devMode ? { left: '5rem', width: 'calc(100% - 5rem)' } : {}}>
            {/* Sidebar negro izquierdo */}
            <div className="w-20 bg-black flex flex-col items-center py-6 gap-4">
              <div className="mb-8">
                <svg className="h-8 w-8 text-white" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M16 1c-1.3 0-2.5.5-3.5 1.4-1 .9-1.7 2.1-2.2 3.4-.5 1.3-.8 2.7-.9 4.1-.1 1.4.1 2.9.5 4.3.4 1.4 1 2.7 1.8 3.9.8 1.2 1.8 2.3 3 3.1 1.2.9 2.5 1.5 3.9 1.9 1.4.4 2.9.5 4.3.3 1.4-.2 2.8-.6 4-1.3 1.2-.7 2.3-1.6 3.2-2.7.9-1.1 1.5-2.4 1.9-3.7.4-1.4.5-2.8.3-4.2-.2-1.4-.7-2.8-1.4-4C30.2 5.7 29.3 4.6 28.2 3.7c-1.1-.9-2.4-1.5-3.8-1.9C23 1.4 21.5 1.2 20.1 1.3c-1.4.1-2.8.5-4 1.2-1.2.7-2.3 1.6-3.1 2.8-.8 1.1-1.4 2.4-1.7 3.8-.3 1.4-.3 2.8 0 4.2.3 1.4.9 2.7 1.7 3.8.8 1.1 1.9 2.1 3.1 2.8 1.2.7 2.6 1.1 4 1.2h.2c1.3 0 2.5-.4 3.5-1.2 1-.8 1.8-1.9 2.3-3.2.5-1.3.7-2.6.6-4-.1-1.4-.5-2.7-1.2-3.9-.7-1.2-1.6-2.2-2.8-2.9-1.1-.7-2.4-1.1-3.7-1.2z"/>
                </svg>
              </div>

              {[1, 2, 3, 4, 5, 6].map((icon) => (
                <div 
                  key={icon}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition ${
                    icon === 5
                      ? 'border-white bg-white'
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {icon === 1 && (
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      M
                    </div>
                  )}
                  {icon === 2 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 3 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 4 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )}
                  {icon === 5 && (
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </div>
              ))}

              <div className="mt-auto">
                <button className="w-12 h-12 rounded-full border-2 border-gray-700 hover:border-gray-500 flex items-center justify-center transition">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <header className="h-20 border-b border-gray-200 flex items-center px-10">
                <button 
                  onClick={() => setCurrentStep(13)} // Volver al paso 13
                  className="absolute left-24 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex-1 text-center">
                  <span className="text-sm font-semibold text-gray-900">Qué ofreces</span>
                  <span className="text-sm text-gray-500 ml-2">Paso 5 de 6</span>
                </div>
                
                <button className="text-sm font-semibold text-gray-900 hover:underline">
                  Guardar y salir
                </button>
              </header>

              {/* Contenido centrado */}
              <div className="flex-1 flex items-center justify-center px-10">
                <div className="max-w-3xl w-full">
                  <h1 className="text-4xl md:text-5xl font-semibold mb-12 text-gray-900 text-center">
                    Ponle un título a tu oferta
                  </h1>

                  {/* Input del título */}
                  <div>
                    <textarea
                      value={serviceData.tempOffer.title}
                      onChange={(e) => {
                        if (e.target.value.length <= 32) {
                          updateServiceData({ 
                            tempOffer: { ...serviceData.tempOffer, title: e.target.value } 
                          });
                        }
                      }}
                      placeholder="Botanas"
                      className="w-full text-4xl md:text-5xl font-medium text-gray-300 placeholder-gray-300 border-none focus:outline-none resize-none overflow-hidden text-center"
                      style={{ 
                        minHeight: '120px',
                        color: serviceData.tempOffer.title ? '#111827' : '#d1d5db'
                      }}
                      rows={2}
                    />
                    <div className="text-sm text-gray-500 text-center mt-2">
                      {serviceData.tempOffer.title.length}/32 disponibles
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <footer className="h-20 border-t border-gray-200 flex items-center justify-between px-10">
                <button className="text-sm font-semibold text-gray-900 hover:underline">
                  Ver consejos
                </button>
                <button
                  onClick={nextStep}
                  disabled={!serviceData.tempOffer.title || serviceData.tempOffer.title.trim() === ''}
                  className={`font-semibold py-3 px-8 rounded-lg transition ${
                    !serviceData.tempOffer.title || serviceData.tempOffer.title.trim() === ''
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-black'
                  }`}
                >
                  Siguiente
                </button>
              </footer>
            </div>
          </div>
        );

      // Paso 15: Describe lo que ofreces
      case 15:
        return (
          <div className={`fixed inset-0 bg-white flex ${devMode ? 'left-20' : 'left-0'}`} style={devMode ? { left: '5rem', width: 'calc(100% - 5rem)' } : {}}>
            {/* Sidebar negro izquierdo */}
            <div className="w-20 bg-black flex flex-col items-center py-6 gap-4">
              <div className="mb-8">
                <svg className="h-8 w-8 text-white" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M16 1c-1.3 0-2.5.5-3.5 1.4-1 .9-1.7 2.1-2.2 3.4-.5 1.3-.8 2.7-.9 4.1-.1 1.4.1 2.9.5 4.3.4 1.4 1 2.7 1.8 3.9.8 1.2 1.8 2.3 3 3.1 1.2.9 2.5 1.5 3.9 1.9 1.4.4 2.9.5 4.3.3 1.4-.2 2.8-.6 4-1.3 1.2-.7 2.3-1.6 3.2-2.7.9-1.1 1.5-2.4 1.9-3.7.4-1.4.5-2.8.3-4.2-.2-1.4-.7-2.8-1.4-4C30.2 5.7 29.3 4.6 28.2 3.7c-1.1-.9-2.4-1.5-3.8-1.9C23 1.4 21.5 1.2 20.1 1.3c-1.4.1-2.8.5-4 1.2-1.2.7-2.3 1.6-3.1 2.8-.8 1.1-1.4 2.4-1.7 3.8-.3 1.4-.3 2.8 0 4.2.3 1.4.9 2.7 1.7 3.8.8 1.1 1.9 2.1 3.1 2.8 1.2.7 2.6 1.1 4 1.2h.2c1.3 0 2.5-.4 3.5-1.2 1-.8 1.8-1.9 2.3-3.2.5-1.3.7-2.6.6-4-.1-1.4-.5-2.7-1.2-3.9-.7-1.2-1.6-2.2-2.8-2.9-1.1-.7-2.4-1.1-3.7-1.2z"/>
                </svg>
              </div>

              {[1, 2, 3, 4, 5, 6].map((icon) => (
                <div 
                  key={icon}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition ${
                    icon === 5
                      ? 'border-white bg-white'
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {icon === 1 && (
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      M
                    </div>
                  )}
                  {icon === 2 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 3 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 4 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )}
                  {icon === 5 && (
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </div>
              ))}

              <div className="mt-auto">
                <button className="w-12 h-12 rounded-full border-2 border-gray-700 hover:border-gray-500 flex items-center justify-center transition">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <header className="h-20 border-b border-gray-200 flex items-center px-10">
                <button 
                  onClick={prevStep}
                  className="absolute left-24 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex-1 text-center">
                  <span className="text-sm font-semibold text-gray-900">Qué ofreces</span>
                  <span className="text-sm text-gray-500 ml-2">Paso 5 de 6</span>
                </div>
                
                <button className="text-sm font-semibold text-gray-900 hover:underline">
                  Guardar y salir
                </button>
              </header>

              {/* Contenido centrado */}
              <div className="flex-1 flex items-center justify-center px-10">
                <div className="max-w-3xl w-full">
                  <h1 className="text-4xl md:text-5xl font-semibold mb-12 text-gray-900 text-center">
                    Describe lo que ofreces
                  </h1>

                  {/* Título de la oferta */}
                  <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 text-center mb-12">
                    {serviceData.tempOffer.title}
                  </h2>

                  {/* Textarea para la descripción */}
                  <div>
                    <textarea
                      value={serviceData.tempOffer.description}
                      onChange={(e) => {
                        if (e.target.value.length <= 500) {
                          updateServiceData({ 
                            tempOffer: { ...serviceData.tempOffer, description: e.target.value } 
                          });
                        }
                      }}
                      placeholder='Cuéntales qué incluye. Por ejemplo, "Esta selección de bocadillos incluye vieiras, brochetas y miniquiches..."'
                      className="w-full text-base text-gray-600 placeholder-gray-400 border border-gray-300 rounded-xl p-4 focus:outline-none focus:border-gray-900 resize-none"
                      rows={6}
                    />
                    <div className="text-sm text-gray-500 text-right mt-2">
                      {serviceData.tempOffer.description.length}/500 disponibles
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <footer className="h-20 border-t border-gray-200 flex items-center justify-between px-10">
                <button className="text-sm font-semibold text-gray-900 hover:underline">
                  Ver consejos
                </button>
                <button
                  onClick={nextStep}
                  className="bg-gray-900 hover:bg-black text-white font-semibold py-3 px-8 rounded-lg transition"
                >
                  Siguiente
                </button>
              </footer>
            </div>
          </div>
        );

      // Paso 16: Elige una foto para esta oferta
      case 16:
        const handlePhotoUploadForOffer = (e) => {
          const files = Array.from(e.target.files);
          const newPhotos = files.map(file => URL.createObjectURL(file));
          updateServiceData({ photos: [...serviceData.photos, ...newPhotos] });
        };

        return (
          <div className={`fixed inset-0 bg-white flex ${devMode ? 'left-20' : 'left-0'}`} style={devMode ? { left: '5rem', width: 'calc(100% - 5rem)' } : {}}>
            {/* Sidebar negro izquierdo */}
            <div className="w-20 bg-black flex flex-col items-center py-6 gap-4">
              <div className="mb-8">
                <svg className="h-8 w-8 text-white" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M16 1c-1.3 0-2.5.5-3.5 1.4-1 .9-1.7 2.1-2.2 3.4-.5 1.3-.8 2.7-.9 4.1-.1 1.4.1 2.9.5 4.3.4 1.4 1 2.7 1.8 3.9.8 1.2 1.8 2.3 3 3.1 1.2.9 2.5 1.5 3.9 1.9 1.4.4 2.9.5 4.3.3 1.4-.2 2.8-.6 4-1.3 1.2-.7 2.3-1.6 3.2-2.7.9-1.1 1.5-2.4 1.9-3.7.4-1.4.5-2.8.3-4.2-.2-1.4-.7-2.8-1.4-4C30.2 5.7 29.3 4.6 28.2 3.7c-1.1-.9-2.4-1.5-3.8-1.9C23 1.4 21.5 1.2 20.1 1.3c-1.4.1-2.8.5-4 1.2-1.2.7-2.3 1.6-3.1 2.8-.8 1.1-1.4 2.4-1.7 3.8-.3 1.4-.3 2.8 0 4.2.3 1.4.9 2.7 1.7 3.8.8 1.1 1.9 2.1 3.1 2.8 1.2.7 2.6 1.1 4 1.2h.2c1.3 0 2.5-.4 3.5-1.2 1-.8 1.8-1.9 2.3-3.2.5-1.3.7-2.6.6-4-.1-1.4-.5-2.7-1.2-3.9-.7-1.2-1.6-2.2-2.8-2.9-1.1-.7-2.4-1.1-3.7-1.2z"/>
                </svg>
              </div>

              {[1, 2, 3, 4, 5, 6].map((icon) => (
                <div 
                  key={icon}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition ${
                    icon === 5
                      ? 'border-white bg-white'
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {icon === 1 && (
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      M
                    </div>
                  )}
                  {icon === 2 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 3 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 4 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )}
                  {icon === 5 && (
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </div>
              ))}

              <div className="mt-auto">
                <button className="w-12 h-12 rounded-full border-2 border-gray-700 hover:border-gray-500 flex items-center justify-center transition">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <header className="h-20 border-b border-gray-200 flex items-center px-10">
                <button 
                  onClick={prevStep}
                  className="absolute left-24 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex-1 text-center">
                  <span className="text-sm font-semibold text-gray-900">Qué ofreces</span>
                  <span className="text-sm text-gray-500 ml-2">Paso 5 de 6</span>
                </div>
                
                <button className="text-sm font-semibold text-gray-900 hover:underline">
                  Guardar y salir
                </button>
              </header>

              {/* Contenido en dos columnas */}
              <div className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto px-10 py-12">
                  <div className="grid grid-cols-2 gap-16">
                    {/* Columna izquierda - Preview de la oferta */}
                    <div>
                      <h1 className="text-3xl font-semibold mb-8 text-gray-900">
                        Elige una foto para esta oferta
                      </h1>

                      {/* Tarjeta preview horizontal */}
                      <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-sm p-4 flex items-center gap-4">
                        {/* Imagen miniatura */}
                        <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {serviceData.tempOffer.photo ? (
                            <img 
                              src={serviceData.tempOffer.photo} 
                              alt="Oferta preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )}
                        </div>

                        {/* Título de la oferta */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900">{serviceData.tempOffer.title}</h3>
                        </div>
                      </div>
                    </div>

                    {/* Columna derecha - Grid de fotos */}
                    <div>
                      <div className="grid grid-cols-2 gap-4">
                        {serviceData.photos.map((photo, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              updateServiceData({
                                tempOffer: { ...serviceData.tempOffer, photo: photo }
                              });
                            }}
                            className={`relative aspect-square rounded-xl overflow-hidden transition ${
                              serviceData.tempOffer.photo === photo
                                ? 'ring-4 ring-gray-900'
                                : 'hover:opacity-75'
                            }`}
                          >
                            <img 
                              src={photo} 
                              alt={`Foto ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {serviceData.tempOffer.photo === photo && (
                              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                  <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </button>
                        ))}

                        {/* Botón + para agregar más fotos */}
                        <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-gray-900 transition cursor-pointer">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handlePhotoUploadForOffer}
                            className="hidden"
                          />
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <footer className="h-20 border-t border-gray-200 flex items-center justify-between px-10">
                <button 
                  onClick={() => setCurrentStep(13)} // Volver al inicio de ofertas
                  className="text-sm font-semibold text-gray-900 hover:underline"
                >
                  Inicio
                </button>
                <button
                  onClick={nextStep}
                  disabled={!serviceData.tempOffer.photo}
                  className={`font-semibold py-3 px-8 rounded-lg transition ${
                    !serviceData.tempOffer.photo
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-black'
                  }`}
                >
                  Siguiente
                </button>
              </footer>
            </div>
          </div>
        );

      // Paso 17: Agrega el número máximo de participantes
      case 17:
        return (
          <div className={`fixed inset-0 bg-white flex ${devMode ? 'left-20' : 'left-0'}`} style={devMode ? { left: '5rem', width: 'calc(100% - 5rem)' } : {}}>
            {/* Sidebar negro izquierdo */}
            <div className="w-20 bg-black flex flex-col items-center py-6 gap-4">
              <div className="mb-8">
                <svg className="h-8 w-8 text-white" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M16 1c-1.3 0-2.5.5-3.5 1.4-1 .9-1.7 2.1-2.2 3.4-.5 1.3-.8 2.7-.9 4.1-.1 1.4.1 2.9.5 4.3.4 1.4 1 2.7 1.8 3.9.8 1.2 1.8 2.3 3 3.1 1.2.9 2.5 1.5 3.9 1.9 1.4.4 2.9.5 4.3.3 1.4-.2 2.8-.6 4-1.3 1.2-.7 2.3-1.6 3.2-2.7.9-1.1 1.5-2.4 1.9-3.7.4-1.4.5-2.8.3-4.2-.2-1.4-.7-2.8-1.4-4C30.2 5.7 29.3 4.6 28.2 3.7c-1.1-.9-2.4-1.5-3.8-1.9C23 1.4 21.5 1.2 20.1 1.3c-1.4.1-2.8.5-4 1.2-1.2.7-2.3 1.6-3.1 2.8-.8 1.1-1.4 2.4-1.7 3.8-.3 1.4-.3 2.8 0 4.2.3 1.4.9 2.7 1.7 3.8.8 1.1 1.9 2.1 3.1 2.8 1.2.7 2.6 1.1 4 1.2h.2c1.3 0 2.5-.4 3.5-1.2 1-.8 1.8-1.9 2.3-3.2.5-1.3.7-2.6.6-4-.1-1.4-.5-2.7-1.2-3.9-.7-1.2-1.6-2.2-2.8-2.9-1.1-.7-2.4-1.1-3.7-1.2z"/>
                </svg>
              </div>

              {[1, 2, 3, 4, 5, 6].map((icon) => (
                <div 
                  key={icon}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition ${
                    icon === 5
                      ? 'border-white bg-white'
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {icon === 1 && (
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      M
                    </div>
                  )}
                  {icon === 2 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 3 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 4 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )}
                  {icon === 5 && (
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </div>
              ))}

              <div className="mt-auto">
                <button className="w-12 h-12 rounded-full border-2 border-gray-700 hover:border-gray-500 flex items-center justify-center transition">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <header className="h-20 border-b border-gray-200 flex items-center px-10">
                <button 
                  onClick={prevStep}
                  className="absolute left-24 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex-1 text-center">
                  <span className="text-sm font-semibold text-gray-900">Qué ofreces</span>
                  <span className="text-sm text-gray-500 ml-2">Paso 5 de 6</span>
                </div>
                
                <button className="text-sm font-semibold text-gray-900 hover:underline">
                  Guardar y salir
                </button>
              </header>

              {/* Contenido centrado */}
              <div className="flex-1 flex items-center justify-center px-10">
                <div className="max-w-2xl w-full text-center">
                  <h1 className="text-4xl md:text-5xl font-semibold mb-16 text-gray-900">
                    Agrega el número máximo de participantes
                  </h1>

                  {/* Counter */}
                  <div className="flex items-center justify-center gap-8">
                    {/* Botón - */}
                    <button
                      onClick={() => {
                        if (serviceData.tempOffer.maxParticipants > 1) {
                          updateServiceData({
                            tempOffer: { 
                              ...serviceData.tempOffer, 
                              maxParticipants: serviceData.tempOffer.maxParticipants - 1 
                            }
                          });
                        }
                      }}
                      disabled={serviceData.tempOffer.maxParticipants <= 1}
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition ${
                        serviceData.tempOffer.maxParticipants <= 1
                          ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                          : 'border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900'
                      }`}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>

                    {/* Número */}
                    <div className="text-8xl font-semibold text-gray-900 min-w-[200px]">
                      {serviceData.tempOffer.maxParticipants}
                    </div>

                    {/* Botón + */}
                    <button
                      onClick={() => {
                        updateServiceData({
                          tempOffer: { 
                            ...serviceData.tempOffer, 
                            maxParticipants: serviceData.tempOffer.maxParticipants + 1 
                          }
                        });
                      }}
                      className="w-12 h-12 rounded-full border-2 border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900 flex items-center justify-center transition"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <footer className="h-20 border-t border-gray-200 flex items-center justify-end px-10">
                <button
                  onClick={nextStep}
                  className="bg-gray-900 hover:bg-black text-white font-semibold py-3 px-8 rounded-lg transition"
                >
                  Siguiente
                </button>
              </footer>
            </div>
          </div>
        );

      // Paso 18: Establece un precio
      case 18:
        return (
          <div className={`fixed inset-0 bg-white flex ${devMode ? 'left-20' : 'left-0'}`} style={devMode ? { left: '5rem', width: 'calc(100% - 5rem)' } : {}}>
            {/* Sidebar negro izquierdo */}
            <div className="w-20 bg-black flex flex-col items-center py-6 gap-4">
              <div className="mb-8">
                <svg className="h-8 w-8 text-white" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M16 1c-1.3 0-2.5.5-3.5 1.4-1 .9-1.7 2.1-2.2 3.4-.5 1.3-.8 2.7-.9 4.1-.1 1.4.1 2.9.5 4.3.4 1.4 1 2.7 1.8 3.9.8 1.2 1.8 2.3 3 3.1 1.2.9 2.5 1.5 3.9 1.9 1.4.4 2.9.5 4.3.3 1.4-.2 2.8-.6 4-1.3 1.2-.7 2.3-1.6 3.2-2.7.9-1.1 1.5-2.4 1.9-3.7.4-1.4.5-2.8.3-4.2-.2-1.4-.7-2.8-1.4-4C30.2 5.7 29.3 4.6 28.2 3.7c-1.1-.9-2.4-1.5-3.8-1.9C23 1.4 21.5 1.2 20.1 1.3c-1.4.1-2.8.5-4 1.2-1.2.7-2.3 1.6-3.1 2.8-.8 1.1-1.4 2.4-1.7 3.8-.3 1.4-.3 2.8 0 4.2.3 1.4.9 2.7 1.7 3.8.8 1.1 1.9 2.1 3.1 2.8 1.2.7 2.6 1.1 4 1.2h.2c1.3 0 2.5-.4 3.5-1.2 1-.8 1.8-1.9 2.3-3.2.5-1.3.7-2.6.6-4-.1-1.4-.5-2.7-1.2-3.9-.7-1.2-1.6-2.2-2.8-2.9-1.1-.7-2.4-1.1-3.7-1.2z"/>
                </svg>
              </div>

              {[1, 2, 3, 4, 5, 6].map((icon) => (
                <div 
                  key={icon}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition ${
                    icon === 5
                      ? 'border-white bg-white'
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {icon === 1 && (
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      M
                    </div>
                  )}
                  {icon === 2 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 3 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 4 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )}
                  {icon === 5 && (
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </div>
              ))}

              <div className="mt-auto">
                <button className="w-12 h-12 rounded-full border-2 border-gray-700 hover:border-gray-500 flex items-center justify-center transition">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <header className="h-20 border-b border-gray-200 flex items-center px-10">
                <button 
                  onClick={prevStep}
                  className="absolute left-24 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex-1 text-center">
                  <span className="text-sm font-semibold text-gray-900">Qué ofreces</span>
                  <span className="text-sm text-gray-500 ml-2">Paso 5 de 6</span>
                </div>
                
                <button className="text-sm font-semibold text-gray-900 hover:underline">
                  Guardar y salir
                </button>
              </header>

              {/* Contenido centrado */}
              <div className="flex-1 flex items-center justify-center px-10">
                <div className="max-w-2xl w-full">
                  <h1 className="text-4xl md:text-5xl font-semibold mb-12 text-gray-900 text-center">
                    Establece un precio
                  </h1>

                  {/* Opciones de precio */}
                  <div className="space-y-4">
                    {/* Opción 1: Precio por huésped */}
                    <button
                      onClick={() => {
                        updateServiceData({
                          tempOffer: { ...serviceData.tempOffer, priceType: 'per_guest' }
                        });
                      }}
                      className={`w-full text-left p-6 rounded-2xl border-2 transition relative ${
                        serviceData.tempOffer.priceType === 'per_guest'
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-300 hover:border-gray-900'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            Precio por huésped
                          </h3>
                          <p className="text-sm text-gray-600">
                            Establece el precio que pagará cada huésped y el precio mínimo por reservación.
                          </p>
                        </div>
                        
                        {/* Check mark */}
                        {serviceData.tempOffer.priceType === 'per_guest' && (
                          <div className="ml-4">
                            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Opción 2: Precio fijo */}
                    <button
                      onClick={() => {
                        updateServiceData({
                          tempOffer: { ...serviceData.tempOffer, priceType: 'fixed' }
                        });
                      }}
                      className={`w-full text-left p-6 rounded-2xl border-2 transition relative ${
                        serviceData.tempOffer.priceType === 'fixed'
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-300 hover:border-gray-900'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            Precio fijo
                          </h3>
                          <p className="text-sm text-gray-600">
                            Establece un precio para cualquier número de participantes hasta el máximo que hayas establecido.
                          </p>
                        </div>
                        
                        {/* Check mark */}
                        {serviceData.tempOffer.priceType === 'fixed' && (
                          <div className="ml-4">
                            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <footer className="h-20 border-t border-gray-200 flex items-center justify-end px-10">
                <button
                  onClick={nextStep}
                  className="bg-gray-900 hover:bg-black text-white font-semibold py-3 px-8 rounded-lg transition"
                >
                  Siguiente
                </button>
              </footer>
            </div>
          </div>
        );

      // Paso 19: Precio por huésped (cuando priceType es 'per_guest')
      case 19:
        const priceAmount = serviceData.tempOffer.price ? parseInt(serviceData.tempOffer.price) : 0;
        const earnings = Math.round(priceAmount * 0.8); // Asumiendo 20% de comisión de Airbnb

        return (
          <div className={`fixed inset-0 bg-white flex ${devMode ? 'left-20' : 'left-0'}`} style={devMode ? { left: '5rem', width: 'calc(100% - 5rem)' } : {}}>
            {/* Sidebar negro izquierdo */}
            <div className="w-20 bg-black flex flex-col items-center py-6 gap-4">
              <div className="mb-8">
                <svg className="h-8 w-8 text-white" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M16 1c-1.3 0-2.5.5-3.5 1.4-1 .9-1.7 2.1-2.2 3.4-.5 1.3-.8 2.7-.9 4.1-.1 1.4.1 2.9.5 4.3.4 1.4 1 2.7 1.8 3.9.8 1.2 1.8 2.3 3 3.1 1.2.9 2.5 1.5 3.9 1.9 1.4.4 2.9.5 4.3.3 1.4-.2 2.8-.6 4-1.3 1.2-.7 2.3-1.6 3.2-2.7.9-1.1 1.5-2.4 1.9-3.7.4-1.4.5-2.8.3-4.2-.2-1.4-.7-2.8-1.4-4C30.2 5.7 29.3 4.6 28.2 3.7c-1.1-.9-2.4-1.5-3.8-1.9C23 1.4 21.5 1.2 20.1 1.3c-1.4.1-2.8.5-4 1.2-1.2.7-2.3 1.6-3.1 2.8-.8 1.1-1.4 2.4-1.7 3.8-.3 1.4-.3 2.8 0 4.2.3 1.4.9 2.7 1.7 3.8.8 1.1 1.9 2.1 3.1 2.8 1.2.7 2.6 1.1 4 1.2h.2c1.3 0 2.5-.4 3.5-1.2 1-.8 1.8-1.9 2.3-3.2.5-1.3.7-2.6.6-4-.1-1.4-.5-2.7-1.2-3.9-.7-1.2-1.6-2.2-2.8-2.9-1.1-.7-2.4-1.1-3.7-1.2z"/>
                </svg>
              </div>

              {[1, 2, 3, 4, 5, 6].map((icon) => (
                <div 
                  key={icon}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition ${
                    icon === 5
                      ? 'border-white bg-white'
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {icon === 1 && (
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      M
                    </div>
                  )}
                  {icon === 2 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 3 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 4 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )}
                  {icon === 5 && (
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </div>
              ))}

              <div className="mt-auto">
                <button className="w-12 h-12 rounded-full border-2 border-gray-700 hover:border-gray-500 flex items-center justify-center transition">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <header className="h-20 border-b border-gray-200 flex items-center px-10">
                <button 
                  onClick={prevStep}
                  className="absolute left-24 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex-1 text-center">
                  <span className="text-sm font-semibold text-gray-900">Qué ofreces</span>
                  <span className="text-sm text-gray-500 ml-2">Paso 5 de 6</span>
                </div>
                
                <button className="text-sm font-semibold text-gray-900 hover:underline">
                  Guardar y salir
                </button>
              </header>

              {/* Contenido centrado */}
              <div className="flex-1 flex items-center justify-center px-10">
                <div className="max-w-2xl w-full text-center">
                  <h1 className="text-4xl md:text-5xl font-semibold mb-16 text-gray-900">
                    Precio por huésped
                  </h1>

                  {/* Input de precio grande */}
                  <div className="mb-8">
                    <input
                      type="number"
                      value={serviceData.tempOffer.price}
                      onChange={(e) => {
                        updateServiceData({
                          tempOffer: { ...serviceData.tempOffer, price: e.target.value }
                        });
                      }}
                      className="text-8xl font-semibold text-gray-900 text-center w-full border-none focus:outline-none"
                      placeholder="$0"
                      style={{ 
                        WebkitAppearance: 'none',
                        MozAppearance: 'textfield'
                      }}
                    />
                  </div>

                  {/* Texto de ganancias */}
                  <button className="text-base text-gray-600 hover:text-gray-900 flex items-center justify-center gap-2 mx-auto">
                    <span>Ganas ${earnings} MXN</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Link más información */}
                  <div className="mt-32">
                    <a href="#" className="text-sm text-gray-900 underline hover:text-gray-600">
                      Más información sobre los precios
                    </a>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <footer className="h-20 border-t border-gray-200 flex items-center justify-between px-10">
                <button className="text-sm font-semibold text-gray-900 hover:underline">
                  Ver consejos
                </button>
                <button
                  onClick={nextStep}
                  disabled={!serviceData.tempOffer.price || serviceData.tempOffer.price <= 0}
                  className={`font-semibold py-3 px-8 rounded-lg transition ${
                    !serviceData.tempOffer.price || serviceData.tempOffer.price <= 0
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-black'
                  }`}
                >
                  Siguiente
                </button>
              </footer>
            </div>

            <style jsx>{`
              input[type="number"]::-webkit-inner-spin-button,
              input[type="number"]::-webkit-outer-spin-button {
                -webkit-appearance: none;
                margin: 0;
              }
            `}</style>
          </div>
        );

      // Paso 20: Precio mínimo por reservación
      case 20:
        const minPriceAmount = serviceData.tempOffer.minPrice ? parseInt(serviceData.tempOffer.minPrice) : 0;
        const minEarnings = Math.round(minPriceAmount * 0.8); // Asumiendo 20% de comisión de Airbnb

        return (
          <div className={`fixed inset-0 bg-white flex ${devMode ? 'left-20' : 'left-0'}`} style={devMode ? { left: '5rem', width: 'calc(100% - 5rem)' } : {}}>
            {/* Sidebar negro izquierdo */}
            <div className="w-20 bg-black flex flex-col items-center py-6 gap-4">
              <div className="mb-8">
                <svg className="h-8 w-8 text-white" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M16 1c-1.3 0-2.5.5-3.5 1.4-1 .9-1.7 2.1-2.2 3.4-.5 1.3-.8 2.7-.9 4.1-.1 1.4.1 2.9.5 4.3.4 1.4 1 2.7 1.8 3.9.8 1.2 1.8 2.3 3 3.1 1.2.9 2.5 1.5 3.9 1.9 1.4.4 2.9.5 4.3.3 1.4-.2 2.8-.6 4-1.3 1.2-.7 2.3-1.6 3.2-2.7.9-1.1 1.5-2.4 1.9-3.7.4-1.4.5-2.8.3-4.2-.2-1.4-.7-2.8-1.4-4C30.2 5.7 29.3 4.6 28.2 3.7c-1.1-.9-2.4-1.5-3.8-1.9C23 1.4 21.5 1.2 20.1 1.3c-1.4.1-2.8.5-4 1.2-1.2.7-2.3 1.6-3.1 2.8-.8 1.1-1.4 2.4-1.7 3.8-.3 1.4-.3 2.8 0 4.2.3 1.4.9 2.7 1.7 3.8.8 1.1 1.9 2.1 3.1 2.8 1.2.7 2.6 1.1 4 1.2h.2c1.3 0 2.5-.4 3.5-1.2 1-.8 1.8-1.9 2.3-3.2.5-1.3.7-2.6.6-4-.1-1.4-.5-2.7-1.2-3.9-.7-1.2-1.6-2.2-2.8-2.9-1.1-.7-2.4-1.1-3.7-1.2z"/>
                </svg>
              </div>

              {[1, 2, 3, 4, 5, 6].map((icon) => (
                <div 
                  key={icon}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition ${
                    icon === 5
                      ? 'border-white bg-white'
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {icon === 1 && (
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      M
                    </div>
                  )}
                  {icon === 2 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 3 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 4 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )}
                  {icon === 5 && (
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </div>
              ))}

              <div className="mt-auto">
                <button className="w-12 h-12 rounded-full border-2 border-gray-700 hover:border-gray-500 flex items-center justify-center transition">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <header className="h-20 border-b border-gray-200 flex items-center px-10">
                <button 
                  onClick={prevStep}
                  className="absolute left-24 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex-1 text-center">
                  <span className="text-sm font-semibold text-gray-900">Qué ofreces</span>
                  <span className="text-sm text-gray-500 ml-2">Paso 5 de 6</span>
                </div>
                
                <button className="text-sm font-semibold text-gray-900 hover:underline">
                  Guardar y salir
                </button>
              </header>

              {/* Contenido centrado */}
              <div className="flex-1 flex items-center justify-center px-10">
                <div className="max-w-2xl w-full text-center">
                  <h1 className="text-4xl md:text-5xl font-semibold mb-16 text-gray-900">
                    Precio mínimo por reservación
                  </h1>

                  {/* Input de precio grande */}
                  <div className="mb-8">
                    <input
                      type="number"
                      value={serviceData.tempOffer.minPrice}
                      onChange={(e) => {
                        updateServiceData({
                          tempOffer: { ...serviceData.tempOffer, minPrice: e.target.value }
                        });
                      }}
                      className="text-8xl font-semibold text-gray-900 text-center w-full border-none focus:outline-none"
                      placeholder="$500"
                      style={{ 
                        WebkitAppearance: 'none',
                        MozAppearance: 'textfield'
                      }}
                    />
                  </div>

                  {/* Texto de ganancias */}
                  {serviceData.tempOffer.minPrice && parseInt(serviceData.tempOffer.minPrice) > 0 && (
                    <button className="text-base text-gray-600 hover:text-gray-900 flex items-center justify-center gap-2 mx-auto">
                      <span>Ganas ${minEarnings} MXN</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}

                  {/* Link más información */}
                  <div className="mt-32">
                    <a href="#" className="text-sm text-gray-900 underline hover:text-gray-600">
                      Más información sobre los precios
                    </a>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <footer className="h-20 border-t border-gray-200 flex items-center justify-between px-10">
                <button 
                  onClick={nextStep}
                  className="text-sm font-semibold text-gray-900 hover:underline"
                >
                  Omitir
                </button>
                <button
                  onClick={nextStep}
                  className="bg-gray-900 hover:bg-black text-white font-semibold py-3 px-8 rounded-lg transition"
                >
                  Siguiente
                </button>
              </footer>
            </div>

            <style jsx>{`
              input[type="number"]::-webkit-inner-spin-button,
              input[type="number"]::-webkit-outer-spin-button {
                -webkit-appearance: none;
                margin: 0;
              }
            `}</style>
          </div>
        );

      // Paso 21: Revisa tus precios
      case 21:
        return (
          <div className={`fixed inset-0 bg-white flex ${devMode ? 'left-20' : 'left-0'}`} style={devMode ? { left: '5rem', width: 'calc(100% - 5rem)' } : {}}>
            {/* Sidebar negro izquierdo */}
            <div className="w-20 bg-black flex flex-col items-center py-6 gap-4">
              <div className="mb-8">
                <svg className="h-8 w-8 text-white" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M16 1c-1.3 0-2.5.5-3.5 1.4-1 .9-1.7 2.1-2.2 3.4-.5 1.3-.8 2.7-.9 4.1-.1 1.4.1 2.9.5 4.3.4 1.4 1 2.7 1.8 3.9.8 1.2 1.8 2.3 3 3.1 1.2.9 2.5 1.5 3.9 1.9 1.4.4 2.9.5 4.3.3 1.4-.2 2.8-.6 4-1.3 1.2-.7 2.3-1.6 3.2-2.7.9-1.1 1.5-2.4 1.9-3.7.4-1.4.5-2.8.3-4.2-.2-1.4-.7-2.8-1.4-4C30.2 5.7 29.3 4.6 28.2 3.7c-1.1-.9-2.4-1.5-3.8-1.9C23 1.4 21.5 1.2 20.1 1.3c-1.4.1-2.8.5-4 1.2-1.2.7-2.3 1.6-3.1 2.8-.8 1.1-1.4 2.4-1.7 3.8-.3 1.4-.3 2.8 0 4.2.3 1.4.9 2.7 1.7 3.8.8 1.1 1.9 2.1 3.1 2.8 1.2.7 2.6 1.1 4 1.2h.2c1.3 0 2.5-.4 3.5-1.2 1-.8 1.8-1.9 2.3-3.2.5-1.3.7-2.6.6-4-.1-1.4-.5-2.7-1.2-3.9-.7-1.2-1.6-2.2-2.8-2.9-1.1-.7-2.4-1.1-3.7-1.2z"/>
                </svg>
              </div>

              {[1, 2, 3, 4, 5, 6].map((icon) => (
                <div 
                  key={icon}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition ${
                    icon === 5
                      ? 'border-white bg-white'
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {icon === 1 && (
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      M
                    </div>
                  )}
                  {icon === 2 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 3 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 4 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )}
                  {icon === 5 && (
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </div>
              ))}

              <div className="mt-auto">
                <button className="w-12 h-12 rounded-full border-2 border-gray-700 hover:border-gray-500 flex items-center justify-center transition">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <header className="h-20 border-b border-gray-200 flex items-center px-10">
                <button 
                  onClick={prevStep}
                  className="absolute left-24 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex-1 text-center">
                  <span className="text-sm font-semibold text-gray-900">Qué ofreces</span>
                  <span className="text-sm text-gray-500 ml-2">Paso 5 de 6</span>
                </div>
                
                <button className="text-sm font-semibold text-gray-900 hover:underline">
                  Guardar y salir
                </button>
              </header>

              {/* Contenido centrado */}
              <div className="flex-1 flex items-center justify-center px-10">
                <div className="max-w-2xl w-full">
                  <h1 className="text-4xl md:text-5xl font-semibold mb-12 text-gray-900 text-center">
                    Revisa tus precios
                  </h1>

                  {/* Tarjeta de resumen de precios */}
                  <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Precio por huésped</h3>
                      <p className="text-lg font-semibold text-gray-900">
                        $ {serviceData.tempOffer.price} MXN
                      </p>
                    </div>

                    {serviceData.tempOffer.minPrice && (
                      <p className="text-sm text-gray-600">
                        Los viajeros pagan $ {serviceData.tempOffer.price} MXN por persona con un precio mínimo por reservación de $ {serviceData.tempOffer.minPrice} MXN.
                      </p>
                    )}

                    {!serviceData.tempOffer.minPrice && (
                      <p className="text-sm text-gray-600">
                        Los viajeros pagan $ {serviceData.tempOffer.price} MXN por persona.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <footer className="h-20 border-t border-gray-200 flex items-center justify-end px-10">
                <button
                  onClick={nextStep}
                  className="bg-gray-900 hover:bg-black text-white font-semibold py-3 px-8 rounded-lg transition"
                >
                  Siguiente
                </button>
              </footer>
            </div>
          </div>
        );

      // Paso 22: Agregar descuentos
      case 22:
        return (
          <div className={`fixed inset-0 bg-white flex ${devMode ? 'left-20' : 'left-0'}`} style={devMode ? { left: '5rem', width: 'calc(100% - 5rem)' } : {}}>
            {/* Sidebar negro izquierdo */}
            <div className="w-20 bg-black flex flex-col items-center py-6 gap-4">
              <div className="mb-8">
                <svg className="h-8 w-8 text-white" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M16 1c-1.3 0-2.5.5-3.5 1.4-1 .9-1.7 2.1-2.2 3.4-.5 1.3-.8 2.7-.9 4.1-.1 1.4.1 2.9.5 4.3.4 1.4 1 2.7 1.8 3.9.8 1.2 1.8 2.3 3 3.1 1.2.9 2.5 1.5 3.9 1.9 1.4.4 2.9.5 4.3.3 1.4-.2 2.8-.6 4-1.3 1.2-.7 2.3-1.6 3.2-2.7.9-1.1 1.5-2.4 1.9-3.7.4-1.4.5-2.8.3-4.2-.2-1.4-.7-2.8-1.4-4C30.2 5.7 29.3 4.6 28.2 3.7c-1.1-.9-2.4-1.5-3.8-1.9C23 1.4 21.5 1.2 20.1 1.3c-1.4.1-2.8.5-4 1.2-1.2.7-2.3 1.6-3.1 2.8-.8 1.1-1.4 2.4-1.7 3.8-.3 1.4-.3 2.8 0 4.2.3 1.4.9 2.7 1.7 3.8.8 1.1 1.9 2.1 3.1 2.8 1.2.7 2.6 1.1 4 1.2h.2c1.3 0 2.5-.4 3.5-1.2 1-.8 1.8-1.9 2.3-3.2.5-1.3.7-2.6.6-4-.1-1.4-.5-2.7-1.2-3.9-.7-1.2-1.6-2.2-2.8-2.9-1.1-.7-2.4-1.1-3.7-1.2z"/>
                </svg>
              </div>

              {[1, 2, 3, 4, 5, 6].map((icon) => (
                <div 
                  key={icon}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition ${
                    icon === 5
                      ? 'border-white bg-white'
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {icon === 1 && (
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      M
                    </div>
                  )}
                  {icon === 2 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 3 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 4 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )}
                  {icon === 5 && (
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </div>
              ))}

              <div className="mt-auto">
                <button className="w-12 h-12 rounded-full border-2 border-gray-700 hover:border-gray-500 flex items-center justify-center transition">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <header className="h-20 border-b border-gray-200 flex items-center px-10">
                <button 
                  onClick={prevStep}
                  className="absolute left-24 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex-1 text-center">
                  <span className="text-sm font-semibold text-gray-900">Qué ofreces</span>
                  <span className="text-sm text-gray-500 ml-2">Paso 5 de 6</span>
                </div>
                
                <button className="text-sm font-semibold text-gray-900 hover:underline">
                  Guardar y salir
                </button>
              </header>

              {/* Contenido centrado */}
              <div className="flex-1 overflow-y-auto px-10 py-12">
                <div className="max-w-2xl mx-auto">
                  <h1 className="text-4xl md:text-5xl font-semibold mb-12 text-gray-900 text-center">
                    Agregar descuentos
                  </h1>

                  <div className="space-y-6">
                    {/* Opción 1: Por tiempo limitado */}
                    {serviceData.tempOffer.earlyBirdDiscount ? (
                      <button
                        onClick={() => setShowEarlyBirdModal(true)}
                        className="w-full flex items-start justify-between p-6 border-2 border-gray-200 rounded-2xl hover:border-gray-900 transition text-left"
                      >
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            Por tiempo limitado
                          </h3>
                          <p className="text-sm text-gray-600">
                            {serviceData.tempOffer.earlyBirdDiscount}% off all bookings made in the first 90 days.
                          </p>
                        </div>
                        <svg className="w-6 h-6 text-gray-900 flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowEarlyBirdModal(true)}
                        className="w-full flex items-start justify-between p-6 border-2 border-gray-200 rounded-2xl hover:border-gray-900 transition text-left"
                      >
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            Por tiempo limitado
                          </h3>
                          <p className="text-sm text-gray-600">
                            Ofrece una oferta durante los próximos 90 días para alentar a tus primeros huéspedes a reservar.
                          </p>
                        </div>
                        <svg className="w-6 h-6 text-gray-900 flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    )}

                    {/* Opción 2: Reservación anticipada */}
                    {serviceData.tempOffer.advanceBookingDiscount ? (
                      <button
                        onClick={() => setShowAdvanceBookingModal(true)}
                        className="w-full flex items-start justify-between p-6 border-2 border-gray-200 rounded-2xl hover:border-gray-900 transition text-left"
                      >
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            Reservación anticipada: 20% de descuento
                          </h3>
                          <p className="text-sm text-gray-600">
                            Para los participantes que reserven con más de 2 semanas de anticipación.
                          </p>
                        </div>
                        <svg className="w-6 h-6 text-gray-900 flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowAdvanceBookingModal(true)}
                        className="w-full flex items-start justify-between p-6 border-2 border-gray-200 rounded-2xl hover:border-gray-900 transition text-left"
                      >
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            Reservación anticipada
                          </h3>
                          <p className="text-sm text-gray-600">
                            Ofrece un precio más bajo a los participantes que reserven con más de 2 semanas de anticipación.
                          </p>
                        </div>
                        <svg className="w-6 h-6 text-gray-900 flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    )}

                    {/* Sección: Descuentos para grupos grandes */}
                    <div className="pt-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Descuentos para grupos grandes
                      </h2>
                      <p className="text-sm text-gray-600 mb-6">
                        Ofrece un descuento para atraer a grupos más grandes.
                      </p>

                      {serviceData.tempOffer.groupDiscount.minGuests && serviceData.tempOffer.groupDiscount.percentage ? (
                        <button
                          onClick={() => setShowGroupDiscountModal(true)}
                          className="w-full flex items-start justify-between p-6 border-2 border-gray-200 rounded-2xl hover:border-gray-900 transition text-left"
                        >
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {serviceData.tempOffer.groupDiscount.percentage}% de descuento para grupos de {serviceData.tempOffer.groupDiscount.minGuests}+
                            </h3>
                            <p className="text-sm text-gray-600">
                              Para grupos de {serviceData.tempOffer.groupDiscount.minGuests} o más participantes.
                            </p>
                          </div>
                          <svg className="w-6 h-6 text-gray-900 flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowGroupDiscountModal(true)}
                          className="w-full flex items-center justify-between p-6 border-2 border-gray-200 rounded-2xl hover:border-gray-900 transition"
                        >
                          <span className="text-base font-medium text-gray-900">
                            Agrega un descuento
                          </span>
                          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Nota al final */}
                    <p className="text-sm text-gray-600 text-center pt-6">
                      Solo aplicaremos un descuento por reservación, el que sea más beneficioso para los participantes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <footer className="h-20 border-t border-gray-200 flex items-center justify-end px-10">
                <button
                  onClick={nextStep}
                  className="bg-gray-900 hover:bg-black text-white font-semibold py-3 px-8 rounded-lg transition"
                >
                  Siguiente
                </button>
              </footer>
            </div>

            {/* Modal 1: Descuento por tiempo limitado */}
            {showEarlyBirdModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative">
                  <button
                    onClick={() => setShowEarlyBirdModal(false)}
                    className="absolute top-6 left-6 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <h2 className="text-xl font-semibold text-gray-900 text-center mb-2 mt-8">
                    Descuento por tiempo limitado
                  </h2>
                  <p className="text-sm text-gray-600 text-center mb-8">
                    Se aplica a todas las reservaciones realizadas en los primeros 90 días
                  </p>

                  <div className="text-center mb-8">
                    <div className="relative inline-block">
                      <input
                        type="number"
                        value={serviceData.tempOffer.earlyBirdDiscount}
                        onChange={(e) => {
                          updateServiceData({
                            tempOffer: { ...serviceData.tempOffer, earlyBirdDiscount: e.target.value }
                          });
                        }}
                        className="text-7xl font-semibold text-gray-900 text-right w-48 border-none focus:outline-none pr-4"
                        placeholder="0"
                        style={{ 
                          WebkitAppearance: 'none',
                          MozAppearance: 'textfield'
                        }}
                      />
                      <span className="text-7xl font-semibold text-gray-900">%</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        updateServiceData({
                          tempOffer: { ...serviceData.tempOffer, earlyBirdDiscount: '' }
                        });
                        setShowEarlyBirdModal(false);
                      }}
                      className="text-base font-semibold text-gray-900 hover:underline"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => setShowEarlyBirdModal(false)}
                      className="flex-1 bg-gray-900 hover:bg-black text-white font-semibold py-3 rounded-lg transition"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal 2: Reservación anticipada */}
            {showAdvanceBookingModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative">
                  <button
                    onClick={() => setShowAdvanceBookingModal(false)}
                    className="absolute top-6 left-6 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <h2 className="text-xl font-semibold text-gray-900 text-center mb-8 mt-8">
                    Descuento por reservación anticipada
                  </h2>

                  <div className="text-center mb-4">
                    <p className="text-5xl font-semibold text-gray-900 mb-2">
                      20% de descuento
                    </p>
                  </div>

                  <p className="text-sm text-gray-600 text-center mb-8">
                    Se aplica a todas las reservaciones realizadas con más de 2 semanas de anticipación.
                  </p>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        updateServiceData({
                          tempOffer: { ...serviceData.tempOffer, advanceBookingDiscount: false }
                        });
                        setShowAdvanceBookingModal(false);
                      }}
                      className="text-base font-semibold text-gray-900 hover:underline"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        updateServiceData({
                          tempOffer: { ...serviceData.tempOffer, advanceBookingDiscount: true }
                        });
                        setShowAdvanceBookingModal(false);
                      }}
                      className="flex-1 bg-gray-900 hover:bg-black text-white font-semibold py-3 rounded-lg transition"
                    >
                      Aplica un descuento
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal 3: Descuento para grupos grandes */}
            {showGroupDiscountModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative">
                  <button
                    onClick={() => setShowGroupDiscountModal(false)}
                    className="absolute top-6 left-6 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <h2 className="text-xl font-semibold text-gray-900 text-center mb-8 mt-8">
                    Descuento para grupos grandes
                  </h2>

                  <div className="space-y-6 mb-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número mínimo de huéspedes
                      </label>
                      <input
                        type="number"
                        value={serviceData.tempOffer.groupDiscount.minGuests}
                        onChange={(e) => {
                          updateServiceData({
                            tempOffer: {
                              ...serviceData.tempOffer,
                              groupDiscount: {
                                ...serviceData.tempOffer.groupDiscount,
                                minGuests: e.target.value
                              }
                            }
                          });
                        }}
                        className="w-full border-2 border-gray-300 rounded-xl p-4 focus:outline-none focus:border-gray-900"
                        placeholder=""
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descuento
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={serviceData.tempOffer.groupDiscount.percentage}
                          onChange={(e) => {
                            updateServiceData({
                              tempOffer: {
                                ...serviceData.tempOffer,
                                groupDiscount: {
                                  ...serviceData.tempOffer.groupDiscount,
                                  percentage: e.target.value
                                }
                              }
                            });
                          }}
                          className="w-full border-2 border-gray-300 rounded-xl p-4 pr-12 focus:outline-none focus:border-gray-900"
                          placeholder=""
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        updateServiceData({
                          tempOffer: {
                            ...serviceData.tempOffer,
                            groupDiscount: { minGuests: '', percentage: '' }
                          }
                        });
                        setShowGroupDiscountModal(false);
                      }}
                      className="text-base font-semibold text-gray-900 hover:underline"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => setShowGroupDiscountModal(false)}
                      disabled={!serviceData.tempOffer.groupDiscount.minGuests || !serviceData.tempOffer.groupDiscount.percentage}
                      className={`flex-1 font-semibold py-3 rounded-lg transition ${
                        !serviceData.tempOffer.groupDiscount.minGuests || !serviceData.tempOffer.groupDiscount.percentage
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-900 hover:bg-black text-white'
                      }`}
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      // Paso 23: ¿Cuándo pueden reservar tu oferta los participantes?
      case 23:
        const durationOptions = [
          '15 minutos',
          '30 minutos',
          '45 minutos',
          '1 hora',
          '1.5 horas',
          '2 horas',
          '2.5 horas',
          '3 horas',
          '3.5 horas',
          '4 horas',
          '4.5 horas',
          '5 horas',
          '5.5 horas',
          '6 horas',
          '6.5 horas',
          '7 horas',
          '7.5 horas',
          '8 horas'
        ];

        return (
          <div className={`fixed inset-0 bg-white flex ${devMode ? 'left-20' : 'left-0'}`} style={devMode ? { left: '5rem', width: 'calc(100% - 5rem)' } : {}}>
            {/* Sidebar negro izquierdo */}
            <div className="w-20 bg-black flex flex-col items-center py-6 gap-4">
              <div className="mb-8">
                <svg className="h-8 w-8 text-white" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M16 1c-1.3 0-2.5.5-3.5 1.4-1 .9-1.7 2.1-2.2 3.4-.5 1.3-.8 2.7-.9 4.1-.1 1.4.1 2.9.5 4.3.4 1.4 1 2.7 1.8 3.9.8 1.2 1.8 2.3 3 3.1 1.2.9 2.5 1.5 3.9 1.9 1.4.4 2.9.5 4.3.3 1.4-.2 2.8-.6 4-1.3 1.2-.7 2.3-1.6 3.2-2.7.9-1.1 1.5-2.4 1.9-3.7.4-1.4.5-2.8.3-4.2-.2-1.4-.7-2.8-1.4-4C30.2 5.7 29.3 4.6 28.2 3.7c-1.1-.9-2.4-1.5-3.8-1.9C23 1.4 21.5 1.2 20.1 1.3c-1.4.1-2.8.5-4 1.2-1.2.7-2.3 1.6-3.1 2.8-.8 1.1-1.4 2.4-1.7 3.8-.3 1.4-.3 2.8 0 4.2.3 1.4.9 2.7 1.7 3.8.8 1.1 1.9 2.1 3.1 2.8 1.2.7 2.6 1.1 4 1.2h.2c1.3 0 2.5-.4 3.5-1.2 1-.8 1.8-1.9 2.3-3.2.5-1.3.7-2.6.6-4-.1-1.4-.5-2.7-1.2-3.9-.7-1.2-1.6-2.2-2.8-2.9-1.1-.7-2.4-1.1-3.7-1.2z"/>
                </svg>
              </div>

              {[1, 2, 3, 4, 5, 6].map((icon) => (
                <div 
                  key={icon}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition ${
                    icon === 5
                      ? 'border-white bg-white'
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {icon === 1 && (
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      M
                    </div>
                  )}
                  {icon === 2 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 3 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 4 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )}
                  {icon === 5 && (
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </div>
              ))}

              <div className="mt-auto">
                <button className="w-12 h-12 rounded-full border-2 border-gray-700 hover:border-gray-500 flex items-center justify-center transition">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <header className="h-20 border-b border-gray-200 flex items-center px-10">
                <button 
                  onClick={prevStep}
                  className="absolute left-24 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex-1 text-center">
                  <span className="text-sm font-semibold text-gray-900">Qué ofreces</span>
                  <span className="text-sm text-gray-500 ml-2">Paso 5 de 6</span>
                </div>
                
                <button className="text-sm font-semibold text-gray-900 hover:underline">
                  Guardar y salir
                </button>
              </header>

              {/* Contenido centrado */}
              <div className="flex-1 overflow-y-auto px-10 py-12">
                <div className="max-w-2xl mx-auto">
                  <h1 className="text-4xl md:text-5xl font-semibold mb-12 text-gray-900 text-center">
                    ¿Cuándo pueden reservar tu oferta los participantes?
                  </h1>

                  <div className="space-y-8">
                    {/* Sección: Horario comercial */}
                    <div>
                      <h2 className="text-base font-semibold text-gray-900 mb-4">
                        Horario comercial
                      </h2>

                      <div className="space-y-4">
                        {serviceData.tempOffer.schedule.map((slot, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setEditingScheduleIndex(index);
                              setShowScheduleModal(true);
                            }}
                            className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-gray-900 transition"
                          >
                            <div className="text-left">
                              <div className="text-base font-medium text-gray-900">
                                {Array.isArray(slot.days) ? (
                                  (() => {
                                    const weekdays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
                                    const weekend = ['Sábado', 'Domingo'];
                                    const allWeekdays = weekdays.every(day => slot.days.includes(day));
                                    const allWeekend = weekend.every(day => slot.days.includes(day));
                                    if (allWeekdays && !allWeekend) return 'Lunes – Viernes';
                                    if (allWeekend && !allWeekdays) return 'Sábado – Domingo';
                                    if (slot.days.length === 7) return 'Todos los días';
                                    if (slot.days.length === 1) return slot.days[0];
                                    return slot.days.join(', ');
                                  })()
                                ) : slot.days}
                              </div>
                              <div className="text-sm text-gray-600">
                                {slot.startTime} – {slot.endTime}
                              </div>
                            </div>
                            <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        ))}

                        <button 
                          onClick={() => {
                            // Agregar un nuevo horario vacío
                            const newSchedule = [...serviceData.tempOffer.schedule, {
                              days: [],
                              startTime: '9:00 a.m.',
                              endTime: '5:00 p.m.'
                            }];
                            updateServiceData({
                              tempOffer: { ...serviceData.tempOffer, schedule: newSchedule }
                            });
                            // Establecer el índice al nuevo horario y abrir modal
                            setEditingScheduleIndex(newSchedule.length - 1);
                            setShowScheduleModal(true);
                          }}
                          className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-gray-900 transition"
                        >
                          <span className="text-base font-medium text-gray-900">
                            Agregar hora
                          </span>
                          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Sección: Duración */}
                    <div>
                      <h2 className="text-base font-semibold text-gray-900 mb-2">
                        Duración
                      </h2>
                      <p className="text-sm text-gray-600 mb-4">
                        Indica a los participantes cuánto tiempo durará tu servicio.
                      </p>

                      <div className="relative">
                        <select
                          value={serviceData.tempOffer.duration}
                          onChange={(e) => {
                            updateServiceData({
                              tempOffer: { ...serviceData.tempOffer, duration: e.target.value }
                            });
                          }}
                          className="w-full appearance-none border-2 border-gray-200 rounded-xl p-4 pr-12 focus:outline-none focus:border-gray-900 text-base font-medium text-gray-900"
                        >
                          {durationOptions.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <footer className="h-20 border-t border-gray-200 flex items-center justify-end px-10">
                <button
                  onClick={nextStep}
                  className="bg-gray-900 hover:bg-black text-white font-semibold py-3 px-8 rounded-lg transition"
                >
                  Siguiente
                </button>
              </footer>
            </div>

            {/* Modal: Horario comercial */}
            {showScheduleModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative max-h-[90vh] overflow-y-auto">
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="absolute top-6 left-6 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <h2 className="text-xl font-semibold text-gray-900 text-center mb-8 mt-8">
                    Horario comercial
                  </h2>

                  {/* Mini preview de la oferta */}
                  <div className="flex flex-col items-center mb-8 pb-6 border-b border-gray-200">
                    <div className="w-20 h-20 bg-gray-100 rounded-xl mb-3"></div>
                    <p className="text-base font-medium text-gray-900">{serviceData.tempOffer.title}</p>
                  </div>

                  <div className="space-y-6">
                    {/* Selector de días */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Días
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day) => {
                          const isSelected = serviceData.tempOffer.schedule[editingScheduleIndex].days.includes(day);
                          return (
                            <button
                              key={day}
                              onClick={() => {
                                const currentDays = [...serviceData.tempOffer.schedule[editingScheduleIndex].days];
                                const newDays = isSelected
                                  ? currentDays.filter(d => d !== day)
                                  : [...currentDays, day];
                                
                                const newSchedule = [...serviceData.tempOffer.schedule];
                                newSchedule[editingScheduleIndex] = {
                                  ...newSchedule[editingScheduleIndex],
                                  days: newDays
                                };
                                
                                updateServiceData({
                                  tempOffer: { ...serviceData.tempOffer, schedule: newSchedule }
                                });
                              }}
                              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                                isSelected
                                  ? 'border-2 border-gray-900 bg-white text-gray-900'
                                  : 'border border-gray-300 bg-white text-gray-700 hover:border-gray-900'
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Selector de hora de inicio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Desde
                      </label>
                      <div className="relative">
                        <select
                          value={serviceData.tempOffer.schedule[editingScheduleIndex].startTime}
                          onChange={(e) => {
                            const newSchedule = [...serviceData.tempOffer.schedule];
                            newSchedule[editingScheduleIndex] = {
                              ...newSchedule[editingScheduleIndex],
                              startTime: e.target.value
                            };
                            updateServiceData({
                              tempOffer: { ...serviceData.tempOffer, schedule: newSchedule }
                            });
                          }}
                          className="w-full appearance-none border-2 border-gray-300 rounded-xl p-4 pr-12 focus:outline-none focus:border-gray-900 text-base"
                        >
                          {generateTimeOptions().map((time) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                        <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Selector de hora de fin */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Para
                      </label>
                      <div className="relative">
                        <select
                          value={serviceData.tempOffer.schedule[editingScheduleIndex].endTime}
                          onChange={(e) => {
                            const newSchedule = [...serviceData.tempOffer.schedule];
                            newSchedule[editingScheduleIndex] = {
                              ...newSchedule[editingScheduleIndex],
                              endTime: e.target.value
                            };
                            updateServiceData({
                              tempOffer: { ...serviceData.tempOffer, schedule: newSchedule }
                            });
                          }}
                          className="w-full appearance-none border-2 border-gray-300 rounded-xl p-4 pr-12 focus:outline-none focus:border-gray-900 text-base"
                        >
                          {generateTimeOptions().map((time) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                        <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => {
                        // Eliminar horario si hay más de uno
                        if (serviceData.tempOffer.schedule.length > 1) {
                          const newSchedule = serviceData.tempOffer.schedule.filter((_, i) => i !== editingScheduleIndex);
                          updateServiceData({
                            tempOffer: { ...serviceData.tempOffer, schedule: newSchedule }
                          });
                        }
                        setShowScheduleModal(false);
                      }}
                      className="text-base font-semibold text-gray-900 hover:underline"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => setShowScheduleModal(false)}
                      disabled={serviceData.tempOffer.schedule[editingScheduleIndex].days.length === 0}
                      className={`flex-1 font-semibold py-3 rounded-lg transition ${
                        serviceData.tempOffer.schedule[editingScheduleIndex].days.length === 0
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-900 hover:bg-black text-white'
                      }`}
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      // Paso 24: Tus ofertas (resumen)
      case 24:
        return (
          <div className={`fixed inset-0 bg-white flex ${devMode ? 'left-20' : 'left-0'}`} style={devMode ? { left: '5rem', width: 'calc(100% - 5rem)' } : {}}>
            {/* Sidebar negro izquierdo */}
            <div className="w-20 bg-black flex flex-col items-center py-6 gap-4">
              <div className="mb-8">
                <svg className="h-8 w-8 text-white" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M16 1c-1.3 0-2.5.5-3.5 1.4-1 .9-1.7 2.1-2.2 3.4-.5 1.3-.8 2.7-.9 4.1-.1 1.4.1 2.9.5 4.3.4 1.4 1 2.7 1.8 3.9.8 1.2 1.8 2.3 3 3.1 1.2.9 2.5 1.5 3.9 1.9 1.4.4 2.9.5 4.3.3 1.4-.2 2.8-.6 4-1.3 1.2-.7 2.3-1.6 3.2-2.7.9-1.1 1.5-2.4 1.9-3.7.4-1.4.5-2.8.3-4.2-.2-1.4-.7-2.8-1.4-4C30.2 5.7 29.3 4.6 28.2 3.7c-1.1-.9-2.4-1.5-3.8-1.9C23 1.4 21.5 1.2 20.1 1.3c-1.4.1-2.8.5-4 1.2-1.2.7-2.3 1.6-3.1 2.8-.8 1.1-1.4 2.4-1.7 3.8-.3 1.4-.3 2.8 0 4.2.3 1.4.9 2.7 1.7 3.8.8 1.1 1.9 2.1 3.1 2.8 1.2.7 2.6 1.1 4 1.2h.2c1.3 0 2.5-.4 3.5-1.2 1-.8 1.8-1.9 2.3-3.2.5-1.3.7-2.6.6-4-.1-1.4-.5-2.7-1.2-3.9-.7-1.2-1.6-2.2-2.8-2.9-1.1-.7-2.4-1.1-3.7-1.2z"/>
                </svg>
              </div>

              {[1, 2, 3, 4, 5, 6].map((icon) => (
                <div 
                  key={icon}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition ${
                    icon === 5
                      ? 'border-white bg-white'
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {icon === 1 && (
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      M
                    </div>
                  )}
                  {icon === 2 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 3 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 4 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )}
                  {icon === 5 && (
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </div>
              ))}

              <div className="mt-auto">
                <button className="w-12 h-12 rounded-full border-2 border-gray-700 hover:border-gray-500 flex items-center justify-center transition">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <header className="h-20 border-b border-gray-200 flex items-center px-10">
                <button 
                  onClick={prevStep}
                  className="absolute left-24 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex-1 text-center">
                  <span className="text-sm font-semibold text-gray-900">Qué ofreces</span>
                  <span className="text-sm text-gray-500 ml-2">Paso 5 de 6</span>
                </div>
                
                <button className="text-sm font-semibold text-gray-900 hover:underline">
                  Guardar y salir
                </button>
              </header>

              {/* Contenido centrado */}
              <div className="flex-1 overflow-y-auto px-10 py-12">
                <div className="max-w-2xl mx-auto">
                  <h1 className="text-4xl md:text-5xl font-semibold mb-4 text-gray-900 text-center">
                    Tus ofertas
                  </h1>
                  <p className="text-base text-gray-600 text-center mb-12">
                    Agrega al menos una. Empieza con una opción accesible para atraer a más participantes.
                  </p>

                  <div className="space-y-4">
                    {/* Tarjetas de ofertas existentes */}
                    {serviceData.offers.map((offer, index) => (
                      <div
                        key={index}
                        className="bg-white border-2 border-gray-200 rounded-2xl p-6 flex items-start gap-6"
                      >
                        {/* Imagen de la oferta */}
                        <div className="w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
                          {offer.photo && (
                            <img 
                              src={offer.photo} 
                              alt={offer.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        {/* Información de la oferta */}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {offer.title}
                          </h3>
                          <p className="text-base text-gray-600">
                            ${offer.price} MXN por huésped
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Botón para agregar otra oferta */}
                    <button
                      onClick={() => {
                        // Limpiar tempOffer y volver al paso 14 para crear nueva oferta
                        updateServiceData({
                          tempOffer: {
                            title: '',
                            description: '',
                            price: '',
                            priceType: 'per_guest',
                            minPrice: '',
                            duration: '30',
                            groupSize: '',
                            photo: '',
                            maxParticipants: 1,
                            earlyBirdDiscount: '',
                            advanceBookingDiscount: false,
                            groupDiscount: { minGuests: '', percentage: '' },
                            schedule: [{
                              days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
                              startTime: '9:00 a.m.',
                              endTime: '5:00 p.m.'
                            }]
                          }
                        });
                        setCurrentStep(14);
                      }}
                      className="w-full flex items-center justify-center gap-3 p-6 border-2 border-gray-200 rounded-2xl hover:border-gray-900 transition"
                    >
                      <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-base font-medium text-gray-900">
                        Agrega otra oferta
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <footer className="h-20 border-t border-gray-200 flex items-center justify-end px-10">
                <button
                  onClick={nextStep}
                  disabled={serviceData.offers.length === 0}
                  className={`font-semibold py-3 px-8 rounded-lg transition ${
                    serviceData.offers.length === 0
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-black'
                  }`}
                >
                  Siguiente
                </button>
              </footer>
            </div>
          </div>
        );

      // Paso 25: ¿Ofrecerás alcohol?
      case 25:
        return (
          <div className={`fixed inset-0 bg-white flex ${devMode ? 'left-20' : 'left-0'}`} style={devMode ? { left: '5rem', width: 'calc(100% - 5rem)' } : {}}>
            {/* Sidebar negro izquierdo */}
            <div className="w-20 bg-black flex flex-col items-center py-6 gap-4">
              <div className="mb-8">
                <svg className="h-8 w-8 text-white" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M16 1c-1.3 0-2.5.5-3.5 1.4-1 .9-1.7 2.1-2.2 3.4-.5 1.3-.8 2.7-.9 4.1-.1 1.4.1 2.9.5 4.3.4 1.4 1 2.7 1.8 3.9.8 1.2 1.8 2.3 3 3.1 1.2.9 2.5 1.5 3.9 1.9 1.4.4 2.9.5 4.3.3 1.4-.2 2.8-.6 4-1.3 1.2-.7 2.3-1.6 3.2-2.7.9-1.1 1.5-2.4 1.9-3.7.4-1.4.5-2.8.3-4.2-.2-1.4-.7-2.8-1.4-4C30.2 5.7 29.3 4.6 28.2 3.7c-1.1-.9-2.4-1.5-3.8-1.9C23 1.4 21.5 1.2 20.1 1.3c-1.4.1-2.8.5-4 1.2-1.2.7-2.3 1.6-3.1 2.8-.8 1.1-1.4 2.4-1.7 3.8-.3 1.4-.3 2.8 0 4.2.3 1.4.9 2.7 1.7 3.8.8 1.1 1.9 2.1 3.1 2.8 1.2.7 2.6 1.1 4 1.2h.2c1.3 0 2.5-.4 3.5-1.2 1-.8 1.8-1.9 2.3-3.2.5-1.3.7-2.6.6-4-.1-1.4-.5-2.7-1.2-3.9-.7-1.2-1.6-2.2-2.8-2.9-1.1-.7-2.4-1.1-3.7-1.2z"/>
                </svg>
              </div>

              {[1, 2, 3, 4, 5, 6].map((icon) => (
                <div 
                  key={icon}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition ${
                    icon === 6
                      ? 'border-white bg-white'
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {icon === 1 && (
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      M
                    </div>
                  )}
                  {icon === 2 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 3 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {icon === 4 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )}
                  {icon === 5 && (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                  {icon === 6 && (
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                </div>
              ))}

              <div className="mt-auto">
                <button className="w-12 h-12 rounded-full border-2 border-gray-700 hover:border-gray-500 flex items-center justify-center transition">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <header className="h-20 border-b border-gray-200 flex items-center px-10">
                <button 
                  onClick={prevStep}
                  className="absolute left-24 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex-1 text-center">
                  <span className="text-sm font-semibold text-gray-900">Detalles</span>
                  <span className="text-sm text-gray-500 ml-2">Paso 6 de 6</span>
                </div>
                
                <button className="text-sm font-semibold text-gray-900 hover:underline">
                  Guardar y salir
                </button>
              </header>

              {/* Contenido centrado */}
              <div className="flex-1 overflow-y-auto px-10 py-12">
                <div className="max-w-2xl mx-auto">
                  <p className="text-base text-gray-600 text-center mb-16">
                    Esto nos ayuda a saber si necesitamos hacer verificaciones de licencia, seguro, calidad y estándares.
                  </p>

                  {/* Pregunta */}
                  <div className="mb-12">
                    <h2 className="text-base font-medium text-gray-900 mb-4">
                      ¿Ofrecerás alcohol?
                    </h2>

                    {/* Botones Sí/No */}
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => updateServiceData({ offersAlcohol: true })}
                        className={`p-4 border-2 rounded-xl font-medium transition ${
                          serviceData.offersAlcohol === true
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-300 hover:border-gray-900'
                        }`}
                      >
                        Sí
                      </button>
                      <button
                        onClick={() => updateServiceData({ offersAlcohol: false })}
                        className={`p-4 border-2 rounded-xl font-medium transition ${
                          serviceData.offersAlcohol === false
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-300 hover:border-gray-900'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  {/* Requisitos y términos - se muestra solo si se ha seleccionado una opción */}
                  {serviceData.offersAlcohol !== null && (
                    <div className="space-y-6">
                      <h3 className="text-base font-semibold text-gray-900">
                        Requisitos y términos
                      </h3>

                      <p className="text-sm text-gray-700">
                        Leíste, comprendiste y aceptas los{' '}
                        <a href="#" className="underline">Términos de los Servicios</a>, la{' '}
                        <a href="#" className="underline">Política de Cancelación del Anfitrión de Servicios</a>{' '}
                        de Servicios y Experiencias, y las{' '}
                        <a href="#" className="underline">Políticas de Cancelación</a>{' '}
                        de Servicios y Experiencias. También reconoces la{' '}
                        <a href="#" className="underline">Política de Privacidad</a>.
                      </p>

                      <p className="text-sm text-gray-700">
                        Al seleccionar "Acepto", autorizas a Airbnb a hacer las{' '}
                        <a href="#" className="underline">verificaciones de calidad y estándares</a>{' '}
                        y declaras que tú y los terceros involucrados en experiencias y servicios mantendrán todas las licencias, autorizaciones y seguros de responsabilidad comercial necesarios.
                      </p>

                      <p className="text-sm text-gray-700">
                        Certificas que cumplirás con los{' '}
                        <a href="#" className="underline">Estándares y Requisitos de los Servicios</a>, todas las leyes y otros requisitos que apliquen a tu oferta, incluidos los específicos para:
                      </p>

                      <ul className="list-disc pl-6 space-y-2">
                        <li className="text-sm text-gray-700">
                          <a href="#" className="underline">manipular, servir o vender alimentos</a>, además de nuestras{' '}
                          <a href="#" className="underline">Guías de seguridad alimentaria</a>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <footer className="h-20 border-t border-gray-200 flex items-center justify-between px-10">
                <button 
                  onClick={nextStep}
                  disabled={serviceData.offersAlcohol === null}
                  className={`text-sm font-semibold transition ${
                    serviceData.offersAlcohol === null
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-900 hover:underline'
                  }`}
                >
                  Acepto
                </button>
                <button
                  onClick={nextStep}
                  disabled={serviceData.offersAlcohol === null}
                  className={`font-semibold py-3 px-8 rounded-lg transition ${
                    serviceData.offersAlcohol === null
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-black'
                  }`}
                  style={{ display: 'none' }}
                >
                  Siguiente
                </button>
              </footer>
            </div>
          </div>
        );

      // Paso 26: Envía tu anuncio (revisión final)
      case 26:
        return (
          <div className={`min-h-screen bg-black text-white ${devMode ? 'pl-20' : ''}`}>
            {/* Header */}
            <header className="h-20 flex items-center justify-between px-10">
              <svg className="h-8 w-8 text-white" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M16 1c-1.3 0-2.5.5-3.5 1.4-1 .9-1.7 2.1-2.2 3.4-.5 1.3-.8 2.7-.9 4.1-.1 1.4.1 2.9.5 4.3.4 1.4 1 2.7 1.8 3.9.8 1.2 1.8 2.3 3 3.1 1.2.9 2.5 1.5 3.9 1.9 1.4.4 2.9.5 4.3.3 1.4-.2 2.8-.6 4-1.3 1.2-.7 2.3-1.6 3.2-2.7.9-1.1 1.5-2.4 1.9-3.7.4-1.4.5-2.8.3-4.2-.2-1.4-.7-2.8-1.4-4C30.2 5.7 29.3 4.6 28.2 3.7c-1.1-.9-2.4-1.5-3.8-1.9C23 1.4 21.5 1.2 20.1 1.3c-1.4.1-2.8.5-4 1.2-1.2.7-2.3 1.6-3.1 2.8-.8 1.1-1.4 2.4-1.7 3.8-.3 1.4-.3 2.8 0 4.2.3 1.4.9 2.7 1.7 3.8.8 1.1 1.9 2.1 3.1 2.8 1.2.7 2.6 1.1 4 1.2h.2c1.3 0 2.5-.4 3.5-1.2 1-.8 1.8-1.9 2.3-3.2.5-1.3.7-2.6.6-4-.1-1.4-.5-2.7-1.2-3.9-.7-1.2-1.6-2.2-2.8-2.9-1.1-.7-2.4-1.1-3.7-1.2z"/>
              </svg>
              <button className="text-sm font-semibold text-white hover:underline">
                Guardar y salir
              </button>
            </header>

            {/* Contenido principal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 px-10 py-12 max-w-7xl mx-auto">
              {/* Columna izquierda - Información */}
              <div>
                <h1 className="text-5xl font-semibold mb-4">
                  Envía tu anuncio
                </h1>
                <p className="text-gray-400 text-lg mb-12">
                  Revisa los detalles y envíalos cuando tengas todo listo.
                </p>

                {/* Lista de secciones */}
                <div className="space-y-4">
                  {/* Acerca de ti */}
                  <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-900 transition text-left">
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black text-sm font-semibold">
                        M
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-white">
                        Acerca de ti
                      </h3>
                      <p className="text-sm text-gray-400">
                        Tus calificaciones
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Ubicación */}
                  <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-900 transition text-left">
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-white">
                        Ubicación
                      </h3>
                      <p className="text-sm text-gray-400">
                        {serviceData.location || 'No especificada'}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Fotos */}
                  <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-900 transition text-left">
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-white">
                        Fotos
                      </h3>
                      <p className="text-sm text-gray-400">
                        {serviceData.photos.length} fotos
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Servicio */}
                  <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-900 transition text-left">
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-white">
                        Servicio
                      </h3>
                      <p className="text-sm text-gray-400">
                        {serviceData.serviceTitle || 'No especificado'}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Qué ofreces */}
                  <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-900 transition text-left">
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-white">
                        Qué ofreces
                      </h3>
                      <p className="text-sm text-gray-400">
                        {serviceData.offers.length > 0 ? serviceData.offers[0].title : 'No especificado'}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Detalles */}
                  <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-900 transition text-left">
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-white">
                        Detalles
                      </h3>
                      <p className="text-sm text-gray-400">
                        {serviceData.offersAlcohol ? 'Se sirve alcohol' : 'No se sirve alcohol'}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Código de invitación */}
                <p className="text-sm text-gray-400 mt-12">
                  ¿Formas parte de una organización con la que colaboramos?{' '}
                  <a href="#" className="underline">Ingresa un código de invitación</a>
                </p>
              </div>

              {/* Columna derecha - Preview */}
              <div className="flex items-start justify-center">
                <div className="bg-white rounded-3xl p-8 w-full max-w-sm">
                  {/* Imagen del servicio */}
                  <div className="aspect-[3/4] bg-gray-100 rounded-2xl mb-6 overflow-hidden relative">
                    {serviceData.photos.length > 0 ? (
                      <img 
                        src={serviceData.photos[0]} 
                        alt={serviceData.serviceTitle}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Avatar superpuesto */}
                    <div className="absolute bottom-4 left-4 w-16 h-16 bg-black rounded-full flex items-center justify-center border-4 border-white">
                      <span className="text-white text-xl font-semibold">M</span>
                    </div>
                  </div>
                  
                  {/* Información del servicio */}
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                      {serviceData.serviceTitle || 'Título del servicio'}
                    </h2>
                    {serviceData.offers.length > 0 && (
                      <p className="text-sm text-gray-600">
                        Desde ${serviceData.offers[0].price} MXN por persona
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 px-10 py-4">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  Al seleccionar el botón, acepto los{' '}
                  <a href="#" className="underline">Términos de los Servicios</a>
                </p>
                <button 
                  onClick={() => {
                    console.log('Servicio enviado a revisión:', serviceData);
                    nextStep();
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition"
                >
                  Enviar a revisión
                </button>
              </div>
            </footer>
          </div>
        );

      // Paso 27: Gracias por avisarnos (Celebración)
      case 27:
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex flex-col">
            {/* Header */}
            <header className="h-20 flex items-center justify-between px-10">
              <svg className="h-8 w-8 text-gray-900" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M16 1c-1.3 0-2.5.5-3.5 1.4-1 .9-1.7 2.1-2.2 3.4-.5 1.3-.8 2.7-.9 4.1-.1 1.4.1 2.9.5 4.3.4 1.4 1 2.7 1.8 3.9.8 1.2 1.8 2.3 3 3.1 1.2.9 2.5 1.5 3.9 1.9 1.4.4 2.9.5 4.3.3 1.4-.2 2.8-.6 4-1.3 1.2-.7 2.3-1.6 3.2-2.7.9-1.1 1.5-2.4 1.9-3.7.4-1.4.5-2.8.3-4.2-.2-1.4-.7-2.8-1.4-4C30.2 5.7 29.3 4.6 28.2 3.7c-1.1-.9-2.4-1.5-3.8-1.9C23 1.4 21.5 1.2 20.1 1.3c-1.4.1-2.8.5-4 1.2-1.2.7-2.3 1.6-3.1 2.8-.8 1.1-1.4 2.4-1.7 3.8-.3 1.4-.3 2.8 0 4.2.3 1.4.9 2.7 1.7 3.8.8 1.1 1.9 2.1 3.1 2.8 1.2.7 2.6 1.1 4 1.2h.2c1.3 0 2.5-.4 3.5-1.2 1-.8 1.8-1.9 2.3-3.2.5-1.3.7-2.6.6-4-.1-1.4-.5-2.7-1.2-3.9-.7-1.2-1.6-2.2-2.8-2.9-1.1-.7-2.4-1.1-3.7-1.2z"/>
              </svg>
            </header>

            {/* Contenido principal */}
            <div className="flex-1 flex items-center justify-center px-10 py-12">
              <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Columna izquierda - Mensaje */}
                <div>
                  <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6">
                    Gracias por avisarnos
                  </h1>
                  <p className="text-lg text-gray-600">
                    Revisaremos tu anuncio en los próximos días y te avisaremos si lo aprobamos o si necesitas actualizar algo.
                  </p>
                </div>

                {/* Columna derecha - Preview del anuncio */}
                <div className="flex justify-center lg:justify-end">
                  <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    {/* Imagen del servicio */}
                    <div className="aspect-[3/4] bg-gray-100 rounded-2xl mb-6 overflow-hidden relative">
                      {serviceData.photos.length > 0 ? (
                        <img 
                          src={serviceData.photos[0]} 
                          alt={serviceData.serviceTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Avatar superpuesto */}
                      <div className="absolute bottom-4 left-4 w-16 h-16 bg-black rounded-full flex items-center justify-center border-4 border-white">
                        <span className="text-white text-xl font-semibold">M</span>
                      </div>
                    </div>
                    
                    {/* Información del servicio */}
                    <div className="text-center">
                      <h2 className="text-xl font-semibold text-gray-900 mb-1">
                        {serviceData.serviceTitle || 'Título del servicio'}
                      </h2>
                      {serviceData.offers.length > 0 && (
                        <p className="text-sm text-gray-600">
                          Desde ${serviceData.offers[0].price} MXN por persona
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="h-20 flex items-center justify-end px-10">
              <button 
                onClick={() => {
                  // Redirigir a la página principal o dashboard
                  console.log('Proceso completado');
                  // window.location.href = '/';
                }}
                className="bg-gray-900 hover:bg-black text-white font-semibold py-3 px-8 rounded-lg transition"
              >
                Listo
              </button>
            </footer>
          </div>
        );

      default:
        return (
          <div className="max-w-3xl mx-auto py-12">
            <h1 className="text-3xl font-semibold mb-10 text-gray-900">
              Paso {currentStep} de 5
            </h1>
            <p className="text-lg text-gray-700">
              Contenido de prueba para el paso {currentStep}.
            </p>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${currentStep >= 4 ? '' : 'pt-20'} ${devMode && currentStep < 4 ? 'pl-20' : ''}`}>
      {/* Panel de Desarrollo - Sidebar izquierdo */}
      {devMode && currentStep < 4 && (
        <div className="fixed left-0 top-0 bottom-0 w-20 bg-gray-900 z-[60] flex flex-col items-center py-6 gap-3 overflow-y-auto shadow-2xl">
          <style jsx>{`
            div::-webkit-scrollbar {
              width: 6px;
            }
            div::-webkit-scrollbar-track {
              background: #1F2937;
            }
            div::-webkit-scrollbar-thumb {
              background: #4B5563;
              border-radius: 3px;
            }
            div::-webkit-scrollbar-thumb:hover {
              background: #6B7280;
            }
          `}</style>
          
          {/* Header */}
          <div className="text-white text-xs font-bold mb-1 tracking-wider">DEV</div>
          <div className="w-12 h-px bg-gray-700 mb-2"></div>
          
          {/* Botones de navegación por paso */}
          <div className="flex flex-col items-center gap-2 w-full px-2 overflow-y-auto max-h-[calc(100vh-200px)]">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27].map((step) => (
              <button
                key={step}
                onClick={() => setCurrentStep(step)}
                className={`w-12 h-12 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center flex-shrink-0 ${
                  currentStep === step
                    ? 'bg-white text-gray-900 shadow-lg scale-110'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white hover:scale-105'
                }`}
                title={`Paso ${step}`}
              >
                {step}
              </button>
            ))}
          </div>
          
          <div className="w-12 h-px bg-gray-700 mt-2"></div>
          
          {/* Botón para ocultar */}
          <button
            onClick={() => setDevMode(false)}
            className="mt-2 p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 hover:text-white transition-all duration-200 hover:scale-105"
            title="Ocultar panel de desarrollo"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Botón para mostrar dev mode si está oculto */}
      {!devMode && currentStep < 4 && (
        <button
          onClick={() => setDevMode(true)}
          className="fixed left-2 top-24 z-[60] bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold p-3 rounded-xl shadow-xl transition-all duration-200 hover:scale-110"
          title="Mostrar panel de desarrollo"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      <header className={`fixed top-0 w-full bg-white border-b border-gray-200 z-50 ${devMode ? 'left-20' : 'left-0'} ${currentStep >= 4 ? 'hidden' : ''}`} style={devMode ? { width: 'calc(100% - 5rem)' } : {}}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo de Airbnb */}
          <svg className="h-8 w-auto text-primary" viewBox="0 0 1600 500" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <style>{`.airbnb-red{fill:none;stroke:#FF5A5F;stroke-width:50;stroke-linecap:round;stroke-linejoin:round;}`}</style>
            </defs>
            <path className="airbnb-red" d="M300 450c-120 0-240-180-240-300 0-66 54-120 120-120s120 54 120 120c0-66 54-120 120-120s120 54 120 120c0 120-120 300-240 300z M300 348a60 60 0 1 0 0-120 60 60 0 0 0 0 120z"/>
          </svg>

          {/* Botón Atrás */}
          <button className="text-gray-900 font-semibold hover:underline">
            Atrás
          </button>
        </div>
      </header>
      
      <main className={`flex-grow ${currentStep >= 4 ? '' : 'pb-32'}`}>
        {renderStep(currentStep)} 
      </main>

      <footer className={`fixed bottom-0 w-full bg-white border-t border-gray-200 z-50 ${devMode ? 'left-20' : 'left-0'} ${currentStep >= 4 ? 'hidden' : ''}`} style={devMode ? { width: 'calc(100% - 5rem)' } : {}}>
        <div className="px-6 py-5"> 
          <div className="h-1 bg-gray-200 rounded-full mb-4">
            <div 
              className="h-1 bg-gray-900 rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              className="font-semibold py-3 px-6 rounded-lg transition text-gray-900 hover:bg-gray-100"
            >
              Atrás
            </button>

            <button
              onClick={nextStep}
              disabled={isNextDisabled()}
              className={`font-semibold py-3 px-8 rounded-lg transition
                ${isNextDisabled() 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-black'
                }
              `}
            >
              {currentStep === 3 ? 'Empezar' : 'Siguiente'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}