import { useState, useCallback } from 'react';

// Datos para el paso 1 (Tipo de experiencia)
const experienceTypeOptions = [
  { 
    id: 'art_design', 
    label: 'Arte y diseño', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ) 
  },
  { 
    id: 'food_drink', 
    label: 'Comida y bebida', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
        <path d="M7 2v20"/>
        <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
      </svg>
    ) 
  },
  { 
    id: 'fitness_wellness', 
    label: 'Fitness y bienestar', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 7-8.5 8.5-5-5L2 17"/>
        <path d="M16 7h6v6"/>
      </svg>
    ) 
  },
  { 
    id: 'history_culture', 
    label: 'Historia y cultura', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <path d="M20.4 14.5 16 10 4 20"/>
      </svg>
    ) 
  },
  { 
    id: 'nature_outdoor', 
    label: 'Naturaleza y actividades al aire libre', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ) 
  },
];

// Datos para el paso 2 según el tipo de experiencia
const experienceSubtypes = {
  art_design: [
    { id: 'architectural_tour', label: 'Ruta arquitectónica' },
    { id: 'art_workshop', label: 'Taller de arte' },
    { id: 'gallery_visit', label: 'Visita a galerías' },
    { id: 'shopping_fashion', label: 'Experiencia de compras y moda' },
  ],
  food_drink: [
    { id: 'cooking_class', label: 'Experiencia gastronómica' },
    { id: 'food_tour', label: 'Clase de cocina' },
    { id: 'wine_tasting', label: 'Recorrido gastronómico' },
    { id: 'cocktail_class', label: 'Degustación' },
  ],
  fitness_wellness: [
    { id: 'yoga', label: 'Experiencia de bienestar' },
    { id: 'meditation', label: 'Experiencia de belleza' },
    { id: 'hiking', label: 'Entrenamiento' },
  ],
  history_culture: [
    { id: 'historical_tour', label: 'Recorrido cultural' },
    { id: 'museum_visit', label: 'Recorrido por sitios de interés' },
    { id: 'cultural_workshop', label: 'Visita a museo' },
  ],
  nature_outdoor: [
    { id: 'wildlife_watching', label: 'Experiencia al aire libre' },
    { id: 'camping', label: 'Experiencia de vuelo' },
    { id: 'water_sports', label: 'Experiencia de deportes acuáticos' },
    { id: 'climbing', label: 'Experiencia con animales' },
  ],
};

// Textos dinámicos para la pregunta de años de experiencia según categoría
const experienceQuestions = {
  art_design: "¿Cuántos años has trabajado con arte y diseño?",
  food_drink: "¿Cuántos años has trabajado con comida y bebida?",
  fitness_wellness: "¿Cuántos años has trabajado con fitness y bienestar?",
  history_culture: "¿Cuántos años has trabajado con historia y cultura?",
  nature_outdoor: "¿Cuántos años has trabajado con la naturaleza y al aire libre?",
};

// Función para obtener el icono según la categoría
const getCategoryIcon = (categoryId) => {
  const icons = {
    art_design: (
      <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl flex items-center justify-center transform rotate-12">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      </div>
    ),
    food_drink: (
      <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center transform rotate-12">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
          <path d="M7 2v20"/>
          <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
        </svg>
      </div>
    ),
    fitness_wellness: (
      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center transform rotate-12">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m22 7-8.5 8.5-5-5L2 17"/>
          <path d="M16 7h6v6"/>
        </svg>
      </div>
    ),
    history_culture: (
      <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center transform rotate-12">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="M20.4 14.5 16 10 4 20"/>
        </svg>
      </div>
    ),
    nature_outdoor: (
      <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center transform rotate-12">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
    ),
  };
  return icons[categoryId];
};

// Componente para la opción de tipo de experiencia
const ExperienceTypeOption = ({ id, label, icon, isSelected, onSelect }) => (
  <button
    onClick={() => onSelect(id)}
    className={`
      flex flex-col items-center justify-center p-6 
      w-full max-w-[280px] h-[180px]
      border-2 rounded-xl transition duration-200 text-left
      ${isSelected 
        ? 'border-gray-900 bg-gray-50 shadow-sm' 
        : 'border-gray-300 hover:border-gray-900 hover:bg-gray-50'
      }
    `}
  >
    <div className='mb-4 text-gray-900'>
      {icon}
    </div>
    <span className="text-lg font-medium text-gray-900 text-center">
      {label}
    </span>
  </button>
);

// Componente para mostrar los años de experiencia
const YearsExperienceStep = ({ experienceType, onYearsSelect, selectedYears }) => {
  const currentYears = selectedYears || 1;

  const handleDecrease = () => {
    if (currentYears > 1) {
      onYearsSelect(currentYears - 1);
    }
  };

  const handleIncrease = () => {
    if (currentYears < 20) {
      onYearsSelect(currentYears + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-10 py-12">
      <h1 className="text-3xl md:text-4xl font-semibold mb-12 text-gray-900">
        {experienceQuestions[experienceType] || "¿Cuántos años de experiencia tienes?"}
      </h1>
      
      <div className="flex items-center justify-center gap-8 mb-8">
        <button
          onClick={handleDecrease}
          disabled={currentYears <= 1}
          className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition
            ${currentYears <= 1 
              ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
              : 'border-gray-400 text-gray-700 hover:border-gray-900 hover:text-gray-900'
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>

        <div className="text-7xl font-bold text-gray-900 min-w-[160px] text-center">
          {currentYears}
        </div>

        <button
          onClick={handleIncrease}
          disabled={currentYears >= 20}
          className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition
            ${currentYears >= 20 
              ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
              : 'border-gray-400 text-gray-700 hover:border-gray-900 hover:text-gray-900'
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>

      <div className="hidden lg:block fixed right-20 top-1/2 -translate-y-1/2">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-64">
          <div className="mb-6">
            {getCategoryIcon(experienceType)}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {experienceTypeOptions.find(opt => opt.id === experienceType)?.label}
          </h3>
        </div>
      </div>
    </div>
  );
};

// **Componente para el Paso 10: Confirmación de Ubicación (Datos de la dirección)**
const MeetingLocationConfirmationStep = ({ experienceData, prevStep }) => {
  // Enlaza el valor ingresado en el Paso 9 (meetingLocation) a la línea de dirección
  // Si meetingLocation está lleno, úsalo. Si no, usa el valor de simulación.
  const displayAddress = experienceData.meetingLocation.trim() 
    ? experienceData.meetingLocation 
    : experienceData.confirmAddress; 

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-10 py-12">
      <div className="text-left mb-8">
        <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Ubicación - Paso 3 de 7
        </h2>
      </div>

      <h1 className="text-3xl md:text-4xl font-semibold mb-8 text-gray-900">
        Confirma tu ubicación
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Asegúrate de que esta dirección sea correcta. No podrás cambiarla una vez que envíes tu anuncio.
      </p>

      <div className="space-y-4">
        {/* Campo no editable: País o región */}
        <div className="border border-2 border-gray-300 rounded-xl p-4 relative bg-gray-50">
          <label className="text-xs text-gray-500 absolute -top-2 left-3 bg-gray-50 px-1">
            País o región
          </label>
          <div className="w-full text-base focus:outline-none pt-1">
            {experienceData.confirmCountry}
          </div>
        </div>

        {/* Campo no editable: Dirección (Ligado al Paso 9) */}
        <div className="border border-2 border-gray-300 rounded-xl p-4 bg-gray-50">
          <label className="text-xs text-gray-500 block -mt-2">
            Dirección
          </label>
          <div className="w-full text-base focus:outline-none pt-1">
            {displayAddress} 
          </div>
        </div>

        {/* Campo no editable: Departamento, habitación, etc. (Opcional) */}
        <div className="border border-2 border-gray-300 rounded-xl p-4 bg-gray-50">
          <label className="text-xs text-gray-500 block -mt-2">
            Departamento, habitación, etc. (si corresponde)
          </label>
          <div className="w-full text-base focus:outline-none pt-1 text-gray-400">
            {experienceData.confirmApartment || '—'} 
          </div>
        </div>
        
        {/* Campo no editable: Zona (Opcional) */}
        <div className="border border-2 border-gray-300 rounded-xl p-4 bg-gray-50">
          <label className="text-xs text-gray-500 block -mt-2">
            Zona (si corresponde)
          </label>
          <div className="w-full text-base focus:outline-none pt-1 text-gray-400">
            {experienceData.confirmZone || '—'} 
          </div>
        </div>

        {/* Campo no editable: Código postal */}
        <div className="border border-2 border-gray-300 rounded-xl p-4 bg-gray-50">
          <label className="text-xs text-gray-500 block -mt-2">
            Código postal
          </label>
          <div className="w-full text-base focus:outline-none pt-1">
            {experienceData.confirmZipCode}
          </div>
        </div>

        {/* Campo no editable: Ciudad / municipio */}
        <div className="border border-2 border-gray-300 rounded-xl p-4 bg-gray-50">
          <label className="text-xs text-gray-500 block -mt-2">
            Ciudad / municipio
          </label>
          <div className="w-full text-base focus:outline-none pt-1">
            {experienceData.confirmCity}
          </div>
        </div>

        {/* Campo no editable: Estado */}
        <div className="border border-2 border-gray-300 rounded-xl p-4 bg-gray-50">
          <label className="text-xs text-gray-500 block -mt-2">
            Estado
          </label>
          <div className="w-full text-base focus:outline-none pt-1">
            {experienceData.confirmState}
          </div>
        </div>

        {/* Botón para volver a editar */}
        <button 
          onClick={prevStep} 
          className="w-full text-center py-3 text-gray-900 font-semibold hover:bg-gray-100 rounded-xl transition mt-4"
        >
          Editar ubicación
        </button>
      </div>
    </div>
  );
};

// **Componente para el Paso 11: Confirmación en el Mapa (Similar a la imagen del usuario)**
// El título ha sido ajustado para eliminar "¡Confirmado!"
const LocationMapConfirmationStep = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 md:px-10 py-12">
      <div className="text-left mb-8">
        <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Ubicación - Paso 4 de 7
        </h2>
      </div>

      {/* Título de la vista: "¿Tu marcador está en el lugar correcto?" (sin "¡Confirmado!") */}
      <h1 className="text-3xl md:text-4xl font-semibold mb-8 text-gray-900 text-center">
        ¿Tu marcador está en el lugar correcto?
      </h1>
      
      {/* Contenedor del Mapa (simulación visual) */}
      <div className="border border-2 border-gray-300 rounded-xl overflow-hidden shadow-lg h-[400px] mb-8 relative">
        {/* Simulación del mapa */}
        <div className="w-full h-full bg-gray-100 flex items-center justify-center relative">
          {/* Marcador Central */}
          <div className="absolute w-8 h-8 flex items-center justify-center">
            {/* SVG del marcador de ubicación */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-full h-full text-red-500" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              stroke="none"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
            </svg>
          </div>
          <p className="text-gray-400 text-sm">
            [Mapa de Ubicación Interactivo]
          </p>
        </div>
        
        {/* Enlace para notificar problema, colocado en la esquina inferior derecha como en la imagen */}
        <div className="absolute bottom-3 right-3 bg-white bg-opacity-80 p-1 rounded-lg">
          <button className="text-xs text-gray-600 hover:text-gray-900 underline">
            Notificar un problema con el mapa
          </button>
        </div>
      </div>
      
      {/* Mensaje de precisión (simulación) */}
      <div className="flex items-center justify-center text-lg text-green-700 font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        La ubicación es precisa
      </div>
    </div>
  );
};


// Componente principal del flujo de creación
export default function CreateExperience() {
  const [currentStep, setCurrentStep] = useState(1);
  const [devMode, setDevMode] = useState(true); // Modo desarrollo - cambiar a false en producción
  
  // Estado para controlar sub-pasos dentro del paso 13
  const [step13SubStep, setStep13SubStep] = useState(1); // 1 = título, 2 = descripción
  
  // Estado para almacenar los datos del formulario
  const [experienceData, setExperienceData] = useState({
    experienceType: null,
    experienceSubtype: null,
    location: '',
    yearsExperience: null,
    jobTitle: '',
    expertise: '',
    recognition: '',
    // Campos para la Dirección de Residencia (Paso 8)
    country: '', 
    addressLine1: '', 
    addressLine2: '',
    zone: '',
    zipCode: '', 
    city: '', 
    state: '', 
    // Nuevo campo para Ubicación (Paso 9)
    meetingLocation: '',

    // *** NUEVOS CAMPOS DE CONFIRMACIÓN (Simulación para Paso 10) ***
    confirmCountry: 'México',
    confirmAddress: 'Fujiyama 2067', // Fallback si no hay meetingLocation.
    confirmApartment: 'Dpto. 3', 
    confirmZone: 'Zona Río', 
    confirmZipCode: '80017',
    confirmCity: 'Culiacán Rosales',
    confirmState: 'Sinaloa',
    // *** FIN CAMPOS DE CONFIRMACIÓN ***
    // Campo para fotos (Paso 12)
    photos: [],
    // Campo para título (Paso 13)
    experienceTitle: '',
    // Campo para descripción (Paso 13 - parte 2)
    experienceDescription: '',
    // Campo para itinerario (Paso 14)
    itinerary: [], // Array de objetos: { id, title, duration, image }
    // Campo para número máximo de participantes (Paso 16)
    maxParticipants: 1,
    // Campo para precio por viajero (Paso 17)
    price: '',
    // Campo para precio mínimo de grupos privados (Paso 18)
    privateGroupMinPrice: '',
  });

  // Estado para los modales
  const [showJobTitleModal, setShowJobTitleModal] = useState(false);
  const [showExpertiseModal, setShowExpertiseModal] = useState(false);
  const [showRecognitionModal, setShowRecognitionModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activityModalStep, setActivityModalStep] = useState(1); // 1: título, 2: descripción, 3: duración, 4: foto
  const [showActivityOptionsModal, setShowActivityOptionsModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  
  // Estado temporal para la actividad que se está creando/editando
  const [tempActivity, setTempActivity] = useState({
    id: null,
    title: '',
    description: '',
    duration: '',
    durationMinutes: 60, // Duración en minutos
    image: null
  });

  // Estados para los descuentos (Paso 20)
  const [showLimitedTimeModal, setShowLimitedTimeModal] = useState(false);
  const [showEarlyBookingModal, setShowEarlyBookingModal] = useState(false);
  const [showGroupDiscountModal, setShowGroupDiscountModal] = useState(false);
  const [limitedTimeDiscount, setLimitedTimeDiscount] = useState('');
  const [earlyBookingDiscount, setEarlyBookingDiscount] = useState(20); // Fijo en 20%
  const [groupDiscountMinGuests, setGroupDiscountMinGuests] = useState('');
  const [groupDiscountPercent, setGroupDiscountPercent] = useState('');
  const [hasLimitedTimeDiscount, setHasLimitedTimeDiscount] = useState(false);
  const [hasEarlyBookingDiscount, setHasEarlyBookingDiscount] = useState(false);
  const [hasGroupDiscount, setHasGroupDiscount] = useState(false);

  // Estados para el paso 21 - Detalles/Preguntas legales
  const [providesTransport, setProvidesTransport] = useState(null); // true, false, null
  const [transportTypes, setTransportTypes] = useState([]); // ['car', 'boat', 'plane', 'motorcycle']
  const [providesFood, setProvidesFood] = useState(null);
  const [foodLicensedEstablishment, setFoodLicensedEstablishment] = useState(null);
  const [providesAlcohol, setProvidesAlcohol] = useState(null);
  const [alcoholLicensedEstablishment, setAlcoholLicensedEstablishment] = useState(null);

  // Funciones memoizadas para actualizar el estado
  const updateExperienceData = useCallback((updates) => {
    setExperienceData(prev => ({ ...prev, ...updates }));
  }, []);

  // Lógica para deshabilitar el botón "Siguiente"
  const isNextDisabled = useCallback(() => {
    switch (currentStep) {
      case 1:
        return !experienceData.experienceType;
      case 2:
        return !experienceData.experienceSubtype;
      case 3:
        return !experienceData.location || experienceData.location.trim() === '';
      case 4:
        return false;
      case 5:
        return !experienceData.yearsExperience;
      case 6: // Paso 6: Comparte tus cualificaciones - REQUERIR Presentación y Conocimiento
        return !experienceData.jobTitle.trim() || !experienceData.expertise.trim(); 
      case 7: // Paso 7: Perfiles en línea - Opcional, se puede saltar
        return false; 
      case 8: // Paso 8: Dirección Residencial - REQUERIR campos principales
        return (
            !experienceData.country.trim() ||
            !experienceData.addressLine1.trim() ||
            !experienceData.zipCode.trim() ||
            !experienceData.city.trim() ||
            !experienceData.state.trim()
        );
      case 9: // Paso 9: Ubicación (Punto de Reunión) - REQUERIR campo
        return !experienceData.meetingLocation.trim();
      case 10: // Paso 10: Confirmar Ubicación (Datos) - Nunca deshabilitado
        return false; 
      case 11: // PASO 11: Confirmar Ubicación (Mapa) - Nunca deshabilitado
        return false; 
      case 12: // PASO 12: Fotos - REQUERIR al menos 5 fotos
        return !experienceData.photos || experienceData.photos.length < 5;
      case 13: // PASO 13: Título y Descripción
        if (step13SubStep === 1) {
          // Sub-paso 1: Validar que tenga título
          return !experienceData.experienceTitle.trim();
        } else {
          // Sub-paso 2: Validar que tenga descripción
          return !experienceData.experienceDescription.trim();
        }
      case 14: // PASO 14: Vista de itinerario - Nunca deshabilitado
        return false;
      case 15: // PASO 15: Crear itinerario - Nunca deshabilitado
        return false;
      case 16: // PASO 16: Número máximo de participantes - Nunca deshabilitado
        return false;
      case 17: // PASO 17: Precio por viajero - Opcional (puede omitirse)
        return false;
      case 18: // PASO 18: Mínimo para grupos privados - Nunca deshabilitado
        return false;
      case 19: // PASO 19: Revisa tus precios - Nunca deshabilitado
        return false;
      case 20: // PASO 20: Agregar descuentos - Nunca deshabilitado
        return false;
      case 21: // PASO 21: Detalles/Preguntas legales - Requiere responder preguntas principales
        return (
          providesTransport === null ||
          providesFood === null ||
          providesAlcohol === null
        );
      default:
        return false;
    }
  }, [currentStep, experienceData, step13SubStep, providesTransport, providesFood, providesAlcohol]);

  // Lógica de navegación
  const nextStep = () => {
    // Si el botón está deshabilitado, no avanzar
    if (isNextDisabled()) {
        return;
    }

    // Manejo especial para el paso 13 con sub-pasos
    if (currentStep === 13 && step13SubStep === 1) {
      setStep13SubStep(2); // Avanzar al sub-paso 2 (descripción)
      return;
    }

    if (currentStep < 23) {
      setCurrentStep(prev => prev + 1);
      // Resetear sub-paso del paso 13 al avanzar a paso 14
      if (currentStep === 13) {
        setStep13SubStep(1);
      }
    } else {
      console.log('Experiencia finalizada:', experienceData);
    }
  };

  const prevStep = () => {
    // Manejo especial para el paso 13 con sub-pasos
    if (currentStep === 13 && step13SubStep === 2) {
      setStep13SubStep(1); // Retroceder al sub-paso 1 (título)
      return;
    }

    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      // Si retrocedemos al paso 13 desde el paso 14, ir directo al sub-paso 2
      if (currentStep === 14) {
        setStep13SubStep(2);
      }
    }
  };

  // Cálculo de progreso para la barra
  const progress = Math.round((currentStep / 23) * 100);

  // Renderizado del contenido del paso actual
  const renderStep = (step) => {
    switch (step) {
      case 1:
        return (
          <div className="max-w-6xl mx-auto px-4 md:px-10 py-12">
            <h1 className="text-3xl md:text-4xl font-semibold mb-8 text-gray-900 text-center">
              ¿Qué experiencia ofrecerás a los participantes?
            </h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 justify-items-center">
              {experienceTypeOptions.map((option) => (
                <ExperienceTypeOption
                  key={option.id}
                  id={option.id}
                  label={option.label}
                  icon={option.icon}
                  isSelected={experienceData.experienceType === option.id}
                  onSelect={(id) => updateExperienceData({ experienceType: id })}
                />
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="max-w-4xl mx-auto px-4 md:px-10 py-12">
            <h1 className="text-3xl md:text-4xl font-semibold mb-12 text-gray-900">
              ¿Cómo describirías tu experiencia?
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              {experienceSubtypes[experienceData.experienceType]?.map((option) => (
                <button
                  key={option.id}
                  onClick={() => updateExperienceData({ experienceSubtype: option.id })}
                  className={`
                    p-4 text-left border-2 rounded-xl transition duration-200
                    ${experienceData.experienceSubtype === option.id
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-300 hover:border-gray-900'
                    }
                  `}
                >
                  <span className="text-base font-medium text-gray-900">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="hidden lg:block fixed right-20 top-1/2 -translate-y-1/2">
              <div className="bg-white rounded-2xl shadow-lg p-8 w-64">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl flex items-center justify-center transform rotate-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {experienceTypeOptions.find(opt => opt.id === experienceData.experienceType)?.label}
                </h3>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="max-w-2xl mx-auto px-4 md:px-10 py-12">
            <h1 className="text-3xl md:text-4xl font-semibold mb-12 text-gray-900">
              ¿Dónde ofrecerás tu experiencia?
            </h1>
            
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Ingresa una ciudad"
                value={experienceData.location}
                onChange={(e) => updateExperienceData({ location: e.target.value })}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl text-base
                  focus:border-gray-900 focus:outline-none transition"
              />
            </div>

            <div className="hidden lg:block fixed right-20 top-1/2 -translate-y-1/2">
              <div className="bg-white rounded-2xl shadow-lg p-8 w-64">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl flex items-center justify-center transform rotate-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {experienceTypeOptions.find(opt => opt.id === experienceData.experienceType)?.label}
                </h3>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="max-w-6xl mx-auto px-4 md:px-10 py-12 flex items-center justify-between gap-12">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-semibold mb-6 text-gray-900">
                Crea un anuncio
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Háblanos de ti y de la experiencia que ofreces. Nuestro equipo lo revisará para confirmar que cumple con nuestros requisitos.
              </p>
            </div>

            <div className="hidden lg:block">
              <div className="bg-white rounded-3xl shadow-2xl p-10 w-80 transform hover:scale-105 transition-transform duration-300">
                <div className="mb-6 flex justify-center">
                  {getCategoryIcon(experienceData.experienceType)}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
                  {experienceTypeOptions.find(opt => opt.id === experienceData.experienceType)?.label}
                </h3>
                <p className="text-gray-600 text-center">
                  {experienceData.location}
                </p>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <YearsExperienceStep
            experienceType={experienceData.experienceType}
            onYearsSelect={(years) => updateExperienceData({ yearsExperience: years })}
            selectedYears={experienceData.yearsExperience}
          />
        );
      case 6:
        return (
          <div className="max-w-2xl mx-auto px-4 md:px-10 py-12">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-900 rounded-full mb-6">
                <span className="text-4xl font-semibold text-white">M</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900">
                Comparte tus cualificaciones
              </h1>
              <p className="text-lg text-gray-600">
                Ayuda a los participantes a conocerte mejor
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setShowJobTitleModal(true)}
                className="w-full flex items-center justify-between p-6 border-2 border-gray-300 rounded-xl hover:border-gray-900 transition group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition">
                    {experienceData.jobTitle ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-semibold text-gray-900">Presentación</h3>
                    <p className="text-sm text-gray-600">
                      {experienceData.jobTitle || 'Indica tu oficio o puesto'}
                    </p>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>

              <button
                onClick={() => setShowExpertiseModal(true)}
                className="w-full flex items-center justify-between p-6 border-2 border-gray-300 rounded-xl hover:border-gray-900 transition group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition">
                    {experienceData.expertise ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                        <path d="M5 3v4"/>
                        <path d="M19 17v4"/>
                        <path d="M3 5h4"/>
                        <path d="M17 19h4"/>
                      </svg>
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-semibold text-gray-900">Conocimiento</h3>
                    <p className="text-sm text-gray-600 truncate max-w-[300px]">
                      {experienceData.expertise || 'Haz que tu experiencia destaque'}
                    </p>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>

              <button
                onClick={() => setShowRecognitionModal(true)}
                className="w-full flex items-center justify-between p-6 border-2 border-gray-300 rounded-xl hover:border-gray-900 transition group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition">
                    {experienceData.recognition ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-semibold text-gray-900">
                      Reconocimiento <span className="text-gray-500 font-normal">(opcional)</span>
                    </h3>
                    <p className="text-sm text-gray-600 truncate max-w-[300px]">
                      {experienceData.recognition || 'Agrega un punto destacado de tu trayectoria'}
                    </p>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>

            <div className="mt-8">
              <button className="text-gray-900 font-semibold hover:underline">
                Ver consejos
              </button>
            </div>

            {/* Modal de Presentación */}
            {showJobTitleModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-semibold text-gray-900">
                        Indica tu oficio o puesto
                      </h2>
                      <button
                        onClick={() => setShowJobTitleModal(false)}
                        className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>

                    <textarea
                      placeholder="Entusiasta de la aventura"
                      value={experienceData.jobTitle}
                      onChange={(e) => updateExperienceData({ jobTitle: e.target.value })}
                      maxLength={40}
                      className="w-full h-32 p-4 border-2 border-gray-300 rounded-xl text-base resize-none
                        focus:border-gray-900 focus:outline-none transition placeholder-gray-400"
                    />
                    
                    <div className="text-right text-sm text-gray-500 mt-2">
                      {experienceData.jobTitle.length}/40 disponibles
                    </div>
                  </div>

                  <div className="border-t border-gray-200 p-4 flex justify-between items-center">
                    <button
                      onClick={() => setShowJobTitleModal(false)}
                      className="text-gray-900 font-semibold hover:underline"
                    >
                      Ver consejos
                    </button>
                    <button
                      onClick={() => setShowJobTitleModal(false)}
                      disabled={!experienceData.jobTitle.trim()}
                      className={`px-6 py-2 rounded-lg font-semibold transition
                        ${experienceData.jobTitle.trim()
                          ? 'bg-gray-900 text-white hover:bg-black'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal de Conocimiento */}
            {showExpertiseModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-semibold text-gray-900">
                        Haz que tu experiencia destaque
                      </h2>
                      <button
                        onClick={() => setShowExpertiseModal(false)}
                        className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>

                    <textarea
                      placeholder='Comparte los aspectos más destacados de tu carrera. Por ejemplo, "Llevo 10 años haciendo paseos en globo aerostático con un historial de seguridad impecable..."'
                      value={experienceData.expertise}
                      onChange={(e) => updateExperienceData({ expertise: e.target.value })}
                      maxLength={150}
                      className="w-full h-40 p-4 border-2 border-gray-300 rounded-xl text-base resize-none
                        focus:border-gray-900 focus:outline-none transition placeholder-gray-400"
                    />
                    
                    <div className="text-right text-sm text-gray-500 mt-2">
                      {experienceData.expertise.length}/150 caracteres obligatorios
                    </div>
                  </div>

                  <div className="border-t border-gray-200 p-4 flex justify-between items-center">
                    <button
                      onClick={() => setShowExpertiseModal(false)}
                      className="text-gray-900 font-semibold hover:underline"
                    >
                      Ver consejos
                    </button>
                    <button
                      onClick={() => setShowExpertiseModal(false)}
                      disabled={!experienceData.expertise.trim()}
                      className={`px-6 py-2 rounded-lg font-semibold transition
                        ${experienceData.expertise.trim()
                          ? 'bg-gray-900 text-white hover:bg-black'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal de Reconocimiento */}
            {showRecognitionModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-semibold text-gray-900">
                        Agrega un punto destacado de tu trayectoria
                      </h2>
                      <button
                        onClick={() => setShowRecognitionModal(false)}
                        className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>

                    <textarea
                      placeholder="Aparecí en una transmisión de la BBC"
                      value={experienceData.recognition}
                      onChange={(e) => updateExperienceData({ recognition: e.target.value })}
                      maxLength={90}
                      className="w-full h-32 p-4 border-2 border-gray-300 rounded-xl text-base resize-none
                        focus:border-gray-900 focus:outline-none transition placeholder-gray-400"
                    />
                    
                    <div className="text-right text-sm text-gray-500 mt-2">
                      {experienceData.recognition.length}/90 disponibles
                    </div>
                  </div>

                  <div className="border-t border-gray-200 p-4 flex justify-between items-center">
                    <button
                      onClick={() => setShowRecognitionModal(false)}
                      className="text-gray-900 font-semibold hover:underline"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => setShowRecognitionModal(false)}
                      className="px-6 py-2 rounded-lg font-semibold bg-gray-900 text-white hover:bg-black transition"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      // Paso 7: Perfiles en línea 
      case 7:
        // Paso 7: Agregar perfiles en línea
        return (
          <div className="max-w-2xl mx-auto px-4 md:px-10 py-12 text-center">
            <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900">
              Agrega tus perfiles en línea
            </h1>
            <p className="text-lg text-gray-600 mb-12">
              Revisaremos tus perfiles y es posible que te sugiramos contenido y fotos para mejorar tu anuncio.
            </p>
            <div className="flex justify-center gap-6 mb-12">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center text-4xl">📘</div>
              <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center text-4xl">📷</div>
              <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center text-4xl">🎵</div>
            </div>
            <button className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-black transition">
              Agrega un perfil
            </button>
            <p className='text-sm text-gray-500 mt-4'>O salta este paso</p>
          </div>
        );
      
      
      // Paso 8: Dirección de Residencia
      case 8:
        return (
          <div className="max-w-2xl mx-auto px-4 md:px-10 py-12">
            <div className="text-left mb-8">
              <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acerca de ti - Paso 1 de 7 
              </h2>
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-900">
              Cuéntanos un poco más sobre ti
            </h1>
            <h2 className="text-xl font-semibold mb-6 text-gray-900">
              ¿Cuál es tu dirección residencial?
            </h2>
            <p className="text-gray-600 mb-6">
              Los huéspedes no verán esta información.
            </p>

            <div className="space-y-4">
              {/* País o región (Select) */}
              <div className="border border-2 border-gray-300 rounded-xl p-4 relative focus-within:border-gray-900 transition">
                <label className="text-xs text-gray-500 absolute -top-2 left-3 bg-white px-1">
                  País o región
                </label>
                <select
                  value={experienceData.country}
                  onChange={(e) => updateExperienceData({ country: e.target.value })}
                  className="w-full text-base focus:outline-none cursor-pointer pt-1 appearance-none bg-none"
                >
                  <option value="">Selecciona un país</option>
                  <option value="México">México</option>
                  <option value="Otro">Otro</option>
                </select>
                {/* SVG para simular flecha del select */}
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </div>

              {/* Dirección (Input) */}
              <div className="border border-2 border-gray-300 rounded-xl p-4 focus-within:border-gray-900 transition">
                <label htmlFor="addressLine1" className="text-xs text-gray-500 block -mt-2">
                  Dirección
                </label>
                <input
                  id="addressLine1"
                  type="text"
                  placeholder="Ej: Fujiyama 2067"
                  value={experienceData.addressLine1}
                  onChange={(e) => updateExperienceData({ addressLine1: e.target.value })}
                  className="w-full text-base focus:outline-none pt-1"
                />
              </div>

              {/* Departamento, habitación, etc. (Input Opcional) */}
              <div className="border border-2 border-gray-300 rounded-xl p-4 focus-within:border-gray-900 transition">
                <label htmlFor="addressLine2" className="text-xs text-gray-500 block -mt-2">
                  Departamento, habitación, etc. (si corresponde)
                </label>
                <input
                  id="addressLine2"
                  type="text"
                  value={experienceData.addressLine2}
                  onChange={(e) => updateExperienceData({ addressLine2: e.target.value })}
                  className="w-full text-base focus:outline-none pt-1"
                />
              </div>
              
              {/* Zona (Input Opcional) */}
              <div className="border border-2 border-gray-300 rounded-xl p-4 focus-within:border-gray-900 transition">
                <label htmlFor="zone" className="text-xs text-gray-500 block -mt-2">
                  Zona (si corresponde)
                </label>
                <input
                  id="zone"
                  type="text"
                  value={experienceData.zone}
                  onChange={(e) => updateExperienceData({ zone: e.target.value })}
                  className="w-full text-base focus:outline-none pt-1"
                />
              </div>

              {/* Código postal (Input) */}
              <div className="border border-2 border-gray-300 rounded-xl p-4 focus-within:border-gray-900 transition">
                <label htmlFor="zipCode" className="text-xs text-gray-500 block -mt-2">
                  Código postal
                </label>
                <input
                  id="zipCode"
                  type="text"
                  placeholder="Ej: 80017"
                  value={experienceData.zipCode}
                  onChange={(e) => updateExperienceData({ zipCode: e.target.value })}
                  className="w-full text-base focus:outline-none pt-1"
                />
              </div>

              {/* Ciudad / municipio (Input) */}
              <div className="border border-2 border-gray-300 rounded-xl p-4 focus-within:border-gray-900 transition">
                <label htmlFor="city" className="text-xs text-gray-500 block -mt-2">
                  Ciudad / municipio
                </label>
                <input
                  id="city"
                  type="text"
                  placeholder="Ej: Culiacán Rosales"
                  value={experienceData.city}
                  onChange={(e) => updateExperienceData({ city: e.target.value })}
                  className="w-full text-base focus:outline-none pt-1"
                />
              </div>

              {/* Estado (Input) */}
              <div className="border border-2 border-gray-300 rounded-xl p-4 focus-within:border-gray-900 transition">
                <label htmlFor="state" className="text-xs text-gray-500 block -mt-2">
                  Estado
                </label>
                <input
                  id="state"
                  type="text"
                  placeholder="Ej: Sinaloa"
                  value={experienceData.state}
                  onChange={(e) => updateExperienceData({ state: e.target.value })}
                  className="w-full text-base focus:outline-none pt-1"
                />
              </div>
            </div>
          </div>
        );
      
      // Paso 9: Ubicación (Punto de Reunión)
      case 9:
        return (
          <div className="max-w-2xl mx-auto px-4 md:px-10 py-12">
            <div className="text-left mb-8">
              <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ubicación - Paso 2 de 7
              </h2>
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900">
              ¿Dónde te reunirás con los participantes?
            </h1>
            <p className="text-gray-600 mb-8">
              Esta dirección se mostrará a los huéspedes en tu anuncio.
            </p>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                {/* Icono de búsqueda */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Ingresa una dirección"
                value={experienceData.meetingLocation}
                onChange={(e) => updateExperienceData({ meetingLocation: e.target.value })}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-full text-base
                  focus:border-gray-900 focus:outline-none transition"
              />
            </div>
          </div>
        );

      // Paso 10: Confirmar Ubicación (Datos)
      case 10:
        return (
          <MeetingLocationConfirmationStep 
            experienceData={experienceData} 
            prevStep={prevStep} 
          />
        );

      // Paso 11: Confirmar Ubicación (Mapa)
      
      case 11:
        return <LocationMapConfirmationStep />;

      // Paso 12: Fotos
      case 12:
        return (
          <div className="max-w-2xl mx-auto px-4 md:px-10 py-12">
            <div className="text-left mb-8">
              <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fotos - Paso 3 de 7
              </h2>
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900">
              Agrega fotos que destaquen tus habilidades
            </h1>
            <p className="text-gray-600 mb-12">
              Agrega al menos 5 fotos.
            </p>

            {/* Contenedor de fotos */}
            <div className="relative min-h-[400px] flex items-center justify-center">
              {experienceData.photos && experienceData.photos.length > 0 ? (
                <div className="grid grid-cols-2 gap-6 w-full max-w-xl">
                  {experienceData.photos.map((photo, index) => (
                    <div 
                      key={index}
                      className="relative group"
                      style={{
                        transform: index % 2 === 0 ? 'rotate(-3deg)' : 'rotate(3deg)',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'rotate(0deg) scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = index % 2 === 0 ? 'rotate(-3deg)' : 'rotate(3deg)';
                      }}
                    >
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                        <img
                          src={photo}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => {
                            const newPhotos = experienceData.photos.filter((_, i) => i !== index);
                            updateExperienceData({ photos: newPhotos });
                          }}
                          className="absolute top-3 right-3 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 
                            transition-opacity shadow-lg hover:bg-gray-100"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="w-5 h-5 text-gray-700" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                          >
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Fotos de ejemplo cuando no hay fotos subidas
                <div className="flex items-center justify-center gap-4">
                  <div 
                    className="w-64 h-48 rounded-2xl overflow-hidden shadow-xl"
                    style={{ transform: 'rotate(-8deg)' }}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="w-16 h-16 text-white opacity-50" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <path d="M20.4 14.5 16 10 4 20"/>
                      </svg>
                    </div>
                  </div>
                  <div 
                    className="w-64 h-48 rounded-2xl overflow-hidden shadow-xl"
                    style={{ transform: 'rotate(8deg)' }}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-emerald-200 to-emerald-400 flex items-center justify-center">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="w-16 h-16 text-white opacity-50" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <path d="M20.4 14.5 16 10 4 20"/>
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Botón Agregar */}
            <div className="flex justify-center mt-12">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    const currentPhotos = experienceData.photos || [];
                    
                    files.forEach(file => {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const newPhotos = [...(experienceData.photos || []), event.target.result];
                        updateExperienceData({ photos: newPhotos });
                      };
                      reader.readAsDataURL(file);
                    });
                  }}
                />
                <span className="inline-block bg-gray-900 text-white font-semibold px-8 py-3 rounded-lg 
                  hover:bg-black transition">
                  Agregar
                </span>
              </label>
            </div>
          </div>
        );

      // Paso 13: Título y Descripción de la experiencia
      case 13:
        if (step13SubStep === 1) {
          // Sub-paso 1: Título
          const titleCharCount = experienceData.experienceTitle.length;
          const titleMaxChars = 50;
          
          return (
            <div className="max-w-2xl mx-auto px-4 md:px-10 py-12">
              <div className="text-left mb-8">
                <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experiencia - Paso 4 de 7
                </h2>
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold mb-16 text-gray-900 text-center">
                Ponle título a tu experiencia
              </h1>

              <div className="max-w-xl mx-auto">
                <div className="relative">
                  <textarea
                    value={experienceData.experienceTitle}
                    onChange={(e) => {
                      if (e.target.value.length <= titleMaxChars) {
                        updateExperienceData({ experienceTitle: e.target.value });
                      }
                    }}
                    placeholder="Haz dumplings tradicionales con la abuela"
                    maxLength={titleMaxChars}
                    rows={3}
                    className="w-full text-3xl md:text-4xl font-light text-gray-400 focus:text-gray-900 
                      placeholder:text-gray-300 text-center resize-none focus:outline-none
                      transition-colors duration-200"
                    style={{ lineHeight: '1.3' }}
                  />
                </div>
                
                <div className="text-center mt-6 text-sm text-gray-500">
                  {titleCharCount}/{titleMaxChars} disponibles
                </div>
              </div>
            </div>
          );
        } else {
          // Sub-paso 2: Descripción
          return (
            <div className="max-w-2xl mx-auto px-4 md:px-10 py-12">
              <h1 className="text-2xl md:text-3xl font-semibold mb-12 text-gray-900 text-center">
                Describe tu experiencia
              </h1>

              <div className="max-w-xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-semibold mb-12 text-gray-900 text-center">
                  {experienceData.experienceTitle || 'Tu experiencia'}
                </h2>

                <div className="relative">
                  <div className="absolute left-0 top-0 w-1 h-full bg-gray-300"></div>
                  <textarea
                    value={experienceData.experienceDescription}
                    onChange={(e) => {
                      updateExperienceData({ experienceDescription: e.target.value });
                    }}
                    placeholder='Explica qué harán los participantes. Por ejemplo, "Domina el arte de doblar dumplings".'
                    rows={6}
                    className="w-full pl-6 text-base text-gray-500 focus:text-gray-900 
                      placeholder:text-gray-400 resize-none focus:outline-none
                      transition-colors duration-200"
                    style={{ lineHeight: '1.6' }}
                  />
                </div>
              </div>
            </div>
          );
        }

      
      // Paso 14: Itinerario de la experiencia
      
      case 14:
        // Actividades de ejemplo
        const sampleActivities = [
          {
            id: 1,
            title: 'Conoce a Nonna',
            duration: '20 minutos',
            image: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400'
          },
          {
            id: 2,
            title: 'Prepara tu propia pasta',
            duration: '1 hora',
            image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400'
          },
          {
            id: 3,
            title: 'Disfruta la receta familiar',
            duration: '30 minutos',
            image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400'
          }
        ];

        return (
          <div className="max-w-2xl mx-auto px-4 md:px-10 py-12">
            {/* Tarjetas de actividades en la parte superior */}
            <div className="flex flex-col items-center mb-16 space-y-4">
              {sampleActivities.map((activity) => (
                <div 
                  key={activity.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 w-full max-w-sm flex items-center gap-4"
                >
                  {/* Imagen de la actividad */}
                  <img 
                    src={activity.image} 
                    alt={activity.title}
                    className="w-14 h-14 object-cover rounded-xl flex-shrink-0"
                  />
                  
                  {/* Información de la actividad */}
                  <div>
                    <h3 className="font-medium text-gray-900 text-base">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {activity.duration}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Título principal */}
            <h1 className="text-3xl md:text-5xl font-semibold text-gray-900 text-center leading-tight">
              Agrega un itinerario para que los participantes tengan una idea de lo que van a hacer
            </h1>
          </div>
        );

      
      // Paso 15: Crear itinerario
      case 15:
        return (
          <div className="max-w-2xl mx-auto px-4 md:px-10 py-12">
            <div className="text-center mb-8">
              <h2 className="text-sm font-medium text-gray-600">
                Itinerario - Paso 5 de 7
              </h2>
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold mb-4 text-gray-900 text-center">
              Crea un itinerario
            </h1>

            <p className="text-lg text-gray-600 mb-12 text-center">
              Agrega hasta 10 actividades a tu experiencia para que los participantes sepan qué esperar.
            </p>

            {/* Lista de actividades agregadas */}
            {experienceData.itinerary.length > 0 && (
              <div className="space-y-4 mb-8 max-w-md mx-auto">
                {experienceData.itinerary.map((activity) => (
                  <button
                    key={activity.id}
                    onClick={() => {
                      setSelectedActivity(activity);
                      setShowActivityOptionsModal(true);
                    }}
                    className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition text-left"
                  >
                    {/* Imagen de la actividad */}
                    <div className="flex-shrink-0">
                      {activity.image ? (
                        <img 
                          src={activity.image} 
                          alt={activity.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <svg 
                            className="w-8 h-8 text-gray-400" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Información de la actividad */}
                    <div className="flex-grow">
                      <h3 className="font-medium text-gray-900">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {activity.duration}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Botón para agregar actividad */}
            <div className="max-w-md mx-auto">
              <button
                onClick={() => {
                  setTempActivity({
                    id: Date.now(),
                    title: '',
                    description: '',
                    duration: '',
                    durationMinutes: 60,
                    image: null
                  });
                  setActivityModalStep(1);
                  setShowActivityModal(true);
                }}
                className="w-full p-6 border-2 border-gray-300 rounded-xl 
                  hover:border-gray-400 hover:bg-gray-50 transition flex items-center justify-start gap-4 
                  text-gray-900 font-medium bg-white"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                  <svg 
                    className="w-5 h-5 text-gray-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 4v16m8-8H4" 
                    />
                  </svg>
                </div>
                <span>Agregar actividad</span>
              </button>
            </div>

            {/* Link de ver consejos */}
            <div className="mt-12 text-center">
              <button className="text-gray-900 font-medium underline hover:text-gray-700 transition">
                Ver consejos
              </button>
            </div>

            {/* Modal para agregar actividad */}
            {showActivityModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-xl w-full max-h-[85vh] overflow-hidden flex flex-col">
                  {/* Header del modal */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    {/* Botón Atrás (solo en paso 2, 3 y 4) */}
                    {activityModalStep > 1 ? (
                      <button
                        onClick={() => setActivityModalStep(activityModalStep - 1)}
                        className="p-1 hover:bg-gray-100 rounded-full transition"
                      >
                        <svg 
                          className="w-6 h-6 text-gray-600" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M15 19l-7-7 7-7" 
                          />
                        </svg>
                      </button>
                    ) : (
                      <div className="w-6"></div>
                    )}

                    <h2 className="text-xl font-semibold text-gray-900">
                      {activityModalStep === 1 && 'Ponle un título a tu primera actividad'}
                      {activityModalStep === 2 && 'Describe lo que harán los participantes'}
                      {activityModalStep === 3 && 'Establece una duración'}
                      {activityModalStep === 4 && 'Elige una foto'}
                    </h2>

                    <button
                      onClick={() => {
                        setShowActivityModal(false);
                        setActivityModalStep(1);
                        setTempActivity({
                          id: null,
                          title: '',
                          description: '',
                          duration: '',
                          durationMinutes: 60,
                          image: null
                        });
                      }}
                      className="p-1 hover:bg-gray-100 rounded-full transition"
                    >
                      <svg 
                        className="w-6 h-6 text-gray-600" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M6 18L18 6M6 6l12 12" 
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Contenido del modal - Paso 1: Título */}
                  {activityModalStep === 1 && (
                    <div className="p-10"  style={{ minHeight: '300px' }}>
                      {/* Input grande para el título */}
                      <div className="mb-8">
                        <textarea
                          value={tempActivity.title}
                          onChange={(e) => {
                            if (e.target.value.length <= 35) {
                              setTempActivity({ ...tempActivity, title: e.target.value });
                            }
                          }}
                          placeholder="Prueba salsas de soya"
                          maxLength={35}
                          rows={3}
                          className="w-full text-4xl md:text-5xl font-light text-gray-400 focus:text-gray-900 
                            placeholder:text-gray-300 text-center resize-none focus:outline-none
                            transition-colors duration-200"
                          style={{ lineHeight: '1.2' }}
                        />
                      </div>
                      
                      {/* Contador de caracteres */}
                      <div className="text-center text-sm text-gray-500">
                        {tempActivity.title.length}/35 disponibles
                      </div>
                    </div>
                  )}

                  {/* Contenido del modal - Paso 2: Descripción */}
                  {activityModalStep === 2 && (
                    <div className="p-10" style={{ minHeight: '300px' }}>
                      {/* Mostrar el título ingresado */}
                      <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 text-center mb-8">
                        {tempActivity.title}
                      </h3>

                      {/* Input para la descripción */}
                      <div className="mb-8">
                        <textarea
                          value={tempActivity.description}
                          onChange={(e) => {
                            setTempActivity({ ...tempActivity, description: e.target.value });
                          }}
                          placeholder='Agrega detalles sobre la actividad. Por ejemplo, "Descubre los apetitosos sabores del umami".'
                          rows={4}
                          className="w-full text-lg text-gray-400 focus:text-gray-900 
                            placeholder:text-gray-300 text-center resize-none focus:outline-none
                            transition-colors duration-200"
                          style={{ lineHeight: '1.6' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Contenido del modal - Paso 3: Duración */}
                  {activityModalStep === 3 && (
                    <div className="p-10" style={{ minHeight: '300px' }}>
                      {/* Selector de duración */}
                      <div className="flex items-center justify-center gap-8 mb-4">
                        {/* Botón menos */}
                        <button
                          onClick={() => {
                            if (tempActivity.durationMinutes > 15) {
                              setTempActivity({ 
                                ...tempActivity, 
                                durationMinutes: tempActivity.durationMinutes - 15 
                              });
                            }
                          }}
                          className="w-12 h-12 rounded-full border-2 border-gray-300 
                            hover:border-gray-400 flex items-center justify-center transition"
                        >
                          <svg 
                            className="w-5 h-5 text-gray-600" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M20 12H4" 
                            />
                          </svg>
                        </button>

                        {/* Número de minutos */}
                        <div className="text-center">
                          <div className="text-7xl font-bold text-gray-900">
                            {tempActivity.durationMinutes}
                          </div>
                          <div className="text-base text-gray-600 mt-2">
                            Minutos
                          </div>
                        </div>

                        {/* Botón más */}
                        <button
                          onClick={() => {
                            setTempActivity({ 
                              ...tempActivity, 
                              durationMinutes: tempActivity.durationMinutes + 15 
                            });
                          }}
                          className="w-12 h-12 rounded-full border-2 border-gray-300 
                            hover:border-gray-400 flex items-center justify-center transition"
                        >
                          <svg 
                            className="w-5 h-5 text-gray-600" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M12 4v16m8-8H4" 
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Contenido del modal - Paso 4: Seleccionar foto */}
                  {activityModalStep === 4 && (
                    <div className="p-6 overflow-y-auto" style={{ maxHeight: '50vh' }}>
                      {/* Título de la actividad arriba */}
                      <div className="mb-6 bg-white border-2 border-gray-200 rounded-xl p-3 flex items-center gap-3">
                        {tempActivity.image ? (
                          <img 
                            src={tempActivity.image} 
                            alt={tempActivity.title}
                            className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg 
                              className="w-6 h-6 text-gray-400" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                              />
                            </svg>
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-gray-900 truncate">{tempActivity.title}</h3>
                          <p className="text-sm text-gray-600">..</p>
                        </div>
                      </div>

                      {/* Grid de fotos */}
                      {experienceData.photos && experienceData.photos.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                          {experienceData.photos.map((photo, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setTempActivity({ ...tempActivity, image: photo });
                              }}
                              className={`relative aspect-square rounded-xl overflow-hidden border-4 transition
                                ${tempActivity.image === photo 
                                  ? 'border-gray-900' 
                                  : 'border-transparent hover:border-gray-300'
                                }`}
                            >
                              <img 
                                src={photo} 
                                alt={`Foto ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              {tempActivity.image === photo && (
                                <div className="absolute top-2 right-2 bg-gray-900 text-white rounded-full p-1">
                                  <svg 
                                    className="w-5 h-5" 
                                    fill="currentColor" 
                                    viewBox="0 0 20 20"
                                  >
                                    <path 
                                      fillRule="evenodd" 
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                      clipRule="evenodd" 
                                    />
                                  </svg>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p>No hay fotos disponibles.</p>
                          <p className="text-sm mt-2">Agrega fotos en el paso 12 primero.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer del modal */}
                  <div className="flex items-center justify-end p-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        if (activityModalStep === 1 && tempActivity.title.trim()) {
                          // Ir al paso 2
                          setActivityModalStep(2);
                        } else if (activityModalStep === 2) {
                          // Ir al paso 3
                          setActivityModalStep(3);
                        } else if (activityModalStep === 3) {
                          // Ir al paso 4
                          setActivityModalStep(4);
                        } else if (activityModalStep === 4) {
                          // Guardar la actividad con la duración
                          const hours = Math.floor(tempActivity.durationMinutes / 60);
                          const minutes = tempActivity.durationMinutes % 60;
                          let durationText = '';
                          
                          if (hours > 0 && minutes > 0) {
                            durationText = `${hours} ${hours === 1 ? 'hora' : 'horas'} ${minutes} minutos`;
                          } else if (hours > 0) {
                            durationText = `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
                          } else {
                            durationText = `${minutes} minutos`;
                          }

                          const updatedActivity = {
                            ...tempActivity,
                            duration: durationText
                          };
                          
                          // Verificar si estamos editando o creando
                          const existingIndex = experienceData.itinerary.findIndex(a => a.id === tempActivity.id);
                          let newItinerary;
                          
                          if (existingIndex >= 0) {
                            // Estamos editando - actualizar la actividad existente
                            newItinerary = [...experienceData.itinerary];
                            newItinerary[existingIndex] = updatedActivity;
                          } else {
                            // Estamos creando - agregar nueva actividad
                            newItinerary = [...experienceData.itinerary, updatedActivity];
                          }
                          
                          updateExperienceData({ itinerary: newItinerary });
                          setShowActivityModal(false);
                          setActivityModalStep(1);
                          setTempActivity({
                            id: null,
                            title: '',
                            description: '',
                            duration: '',
                            durationMinutes: 60,
                            image: null
                          });
                        }
                      }}
                      disabled={activityModalStep === 1 && !tempActivity.title.trim()}
                      className={`font-semibold py-3 px-8 rounded-lg transition
                        ${(activityModalStep === 1 && tempActivity.title.trim()) || activityModalStep > 1
                          ? 'bg-gray-900 text-white hover:bg-black'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal de opciones de actividad */}
            {showActivityOptionsModal && selectedActivity && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-sm w-full">
                  {/* Header del modal */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Itinerario
                    </h2>
                    <button
                      onClick={() => {
                        setShowActivityOptionsModal(false);
                        setSelectedActivity(null);
                      }}
                      className="p-1 hover:bg-gray-100 rounded-full transition"
                    >
                      <svg 
                        className="w-6 h-6 text-gray-600" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M6 18L18 6M6 6l12 12" 
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Contenido del modal */}
                  <div className="p-6 text-center">
                    {/* Imagen de la actividad */}
                    {selectedActivity.image ? (
                      <img 
                        src={selectedActivity.image} 
                        alt={selectedActivity.title}
                        className="w-24 h-24 object-cover rounded-xl mx-auto mb-4"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <svg 
                          className="w-12 h-12 text-gray-400" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                          />
                        </svg>
                      </div>
                    )}

                    {/* Título */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {selectedActivity.title}
                    </h3>

                    {/* Descripción si existe */}
                    {selectedActivity.description && (
                      <p className="text-sm text-gray-600 mb-3">
                        {selectedActivity.description}
                      </p>
                    )}

                    {/* Duración */}
                    <p className="text-sm text-gray-600 mb-6">
                      {selectedActivity.duration}
                    </p>

                    {/* Botón Editar */}
                    <button
                      onClick={() => {
                        // Convertir la duración de texto a minutos
                        let minutes = 60;
                        if (selectedActivity.duration.includes('hora')) {
                          const hours = parseInt(selectedActivity.duration);
                          minutes = hours * 60;
                          const remainingMinutes = selectedActivity.duration.match(/(\d+) minutos/);
                          if (remainingMinutes) {
                            minutes += parseInt(remainingMinutes[1]);
                          }
                        } else {
                          minutes = parseInt(selectedActivity.duration) || 60;
                        }

                        setTempActivity({
                          ...selectedActivity,
                          durationMinutes: minutes
                        });
                        setShowActivityOptionsModal(false);
                        setActivityModalStep(1);
                        setShowActivityModal(true);
                      }}
                      className="w-full bg-gray-900 text-white font-semibold py-3 rounded-lg hover:bg-black transition mb-3"
                    >
                      Editar
                    </button>

                    {/* Botón Eliminar */}
                    <button
                      onClick={() => {
                        const newItinerary = experienceData.itinerary.filter(a => a.id !== selectedActivity.id);
                        updateExperienceData({ itinerary: newItinerary });
                        setShowActivityOptionsModal(false);
                        setSelectedActivity(null);
                      }}
                      className="text-gray-900 font-semibold hover:text-gray-700 transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      
      // Paso 16: Número máximo de participantes
      case 16:
        return (
          <div className="max-w-2xl mx-auto px-4 md:px-10 py-12">
            <div className="text-center mb-8">
              <h2 className="text-sm font-medium text-gray-600">
                Precios - Paso 6 de 7
              </h2>
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold mb-16 text-gray-900 text-center leading-tight">
              Agrega el número máximo de participantes
            </h1>

            {/* Selector de participantes */}
            <div className="flex items-center justify-center gap-8">
              {/* Botón menos */}
              <button
                onClick={() => {
                  if (experienceData.maxParticipants > 1) {
                    updateExperienceData({ maxParticipants: experienceData.maxParticipants - 1 });
                  }
                }}
                className="w-12 h-12 rounded-full border-2 border-gray-300 
                  hover:border-gray-400 flex items-center justify-center transition"
              >
                <svg 
                  className="w-5 h-5 text-gray-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M20 12H4" 
                  />
                </svg>
              </button>

              {/* Número de participantes */}
              <div className="text-center">
                <div className="text-8xl font-bold text-gray-900">
                  {experienceData.maxParticipants}
                </div>
              </div>

              {/* Botón más */}
              <button
                onClick={() => {
                  updateExperienceData({ maxParticipants: experienceData.maxParticipants + 1 });
                }}
                className="w-12 h-12 rounded-full border-2 border-gray-300 
                  hover:border-gray-400 flex items-center justify-center transition"
              >
                <svg 
                  className="w-5 h-5 text-gray-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 4v16m8-8H4" 
                  />
                </svg>
              </button>
            </div>
          </div>
        );

      // Paso 17: Precio por viajero
      case 17:
        return (
          <div className="max-w-2xl mx-auto px-4 md:px-10 py-12">
            <div className="text-center mb-8">
              <h2 className="text-sm font-medium text-gray-600">
                Precios - Paso 6 de 7
              </h2>
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold mb-16 text-gray-900 text-center leading-tight">
              Precio por viajero
            </h1>

            {/* Input de precio */}
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-center mb-4">
                <span className="text-7xl font-bold text-gray-900 mr-2">$</span>
                <input
                  type="number"
                  value={experienceData.price}
                  onChange={(e) => updateExperienceData({ price: e.target.value })}
                  placeholder=""
                  className="text-7xl font-bold text-gray-900 w-48 border-b-2 border-gray-300 
                    focus:border-gray-900 focus:outline-none text-center"
                  min="0"
                />
              </div>

              {/* Link de más información */}
              <div className="text-center mt-12">
                <button className="text-gray-900 font-medium underline hover:text-gray-700 transition">
                  Más información sobre los precios
                </button>
              </div>
            </div>

            {/* Link de ver consejos */}
            <div className="text-center mt-8">
              <button className="text-gray-900 font-medium underline hover:text-gray-700 transition">
                Ver consejos
              </button>
            </div>
          </div>
        );

      // Paso 18: Mínimo para grupos privados
      case 18:
        return (
          <div className="max-w-2xl mx-auto px-6 py-16">
            {/* Encabezado */}
            <h1 className="text-5xl font-semibold mb-3 text-center text-gray-900">
              Mínimo para grupos privados
            </h1>
            <p className="text-center text-gray-600 mb-16">
              Las reservaciones comenzarán a este precio
            </p>

            {/* Símbolo de dólar grande con input editable */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative flex items-center justify-center">
                <span className="text-[200px] font-bold text-gray-900 leading-none">$</span>
                <input
                  type="number"
                  value={experienceData.privateGroupMinPrice}
                  onChange={(e) => updateExperienceData({ privateGroupMinPrice: e.target.value })}
                  placeholder=""
                  className="text-[120px] font-bold text-gray-900 w-80 bg-transparent
                    focus:outline-none text-left ml-4 border-b-4 border-transparent
                    hover:border-gray-300 focus:border-gray-900 transition-colors"
                  min="0"
                  style={{ caretColor: '#111827' }}
                />
                {/* Ícono de lápiz/editar */}
                <button 
                  className="absolute -right-20 bottom-12 p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                  onClick={() => {
                    // El input ya es editable, este botón es decorativo
                    document.querySelector('input[type="number"]').focus();
                  }}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="w-6 h-6 text-gray-700" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Link de más información */}
            <div className="text-center">
              <button className="text-gray-900 font-medium underline hover:text-gray-700 transition text-base">
                Más información sobre los precios
              </button>
            </div>
          </div>
        );

      // Paso 19: Revisa tus precios
      case 19:
        return (
          <div className="max-w-2xl mx-auto px-6 py-16">
            {/* Título principal */}
            <h1 className="text-5xl font-semibold mb-16 text-center text-gray-900">
              Revisa tus precios
            </h1>

            {/* Tarjeta de Precio por huésped */}
            <div className="bg-white border border-gray-300 rounded-2xl p-6 mb-4 hover:shadow-md transition">
              <div className="flex justify-between items-center">
                <span className="text-base font-medium text-gray-900">
                  Precio por huésped
                </span>
                <span className="text-base font-semibold text-gray-900">
                  ${experienceData.price || '0'} MXN
                </span>
              </div>
            </div>

            {/* Tarjeta de Mínimo para grupos privados */}
            <div className="bg-white border border-gray-300 rounded-2xl p-6 mb-4 hover:shadow-md transition">
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-base font-medium text-gray-900">
                    Mínimo para grupos privados
                  </span>
                  <span className="text-base font-semibold text-gray-900">
                    ${experienceData.privateGroupMinPrice || '0'} MXN
                  </span>
                </div>
                
                {/* Texto explicativo */}
                <p className="text-sm text-gray-600">
                  Los huéspedes pagan ${experienceData.price || '0'} MXN por persona con un mínimo para grupos privados de ${experienceData.privateGroupMinPrice || '0'} MXN.
                </p>
              </div>
            </div>
          </div>
        );

      // Paso 20: Agregar descuentos
      case 20:
        return (
          <div className="max-w-2xl mx-auto px-6 py-16">
            {/* Título principal */}
            <h1 className="text-5xl font-semibold mb-16 text-center text-gray-900">
              Agregar descuentos
            </h1>

            {/* Opción 1: Por tiempo limitado */}
            <div className="bg-white border border-gray-300 rounded-2xl p-6 mb-4 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    Por tiempo limitado
                  </h3>
                  <p className="text-sm text-gray-600">
                    {hasLimitedTimeDiscount && limitedTimeDiscount 
                      ? `${limitedTimeDiscount}% off all bookings made in the first 90 days.`
                      : 'Offer a deal for the next 90 days to encourage your first guests to book.'
                    }
                  </p>
                </div>
                <button
                  onClick={() => setShowLimitedTimeModal(true)}
                  className="ml-4 p-2 hover:bg-gray-100 rounded-full transition"
                >
                  {hasLimitedTimeDiscount ? (
                    <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Opción 2: Reservación anticipada */}
            <div className="bg-white border border-gray-300 rounded-2xl p-6 mb-8 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    {hasEarlyBookingDiscount 
                      ? `Reservación anticipada: ${earlyBookingDiscount}% de descuento`
                      : 'Reservación anticipada'
                    }
                  </h3>
                  <p className="text-sm text-gray-600">
                    {hasEarlyBookingDiscount
                      ? 'Para los participantes que reserven con más de 2 semanas de anticipación.'
                      : 'Ofrece un precio más bajo a los participantes que reserven con más de 2 semanas de anticipación.'
                    }
                  </p>
                </div>
                <button
                  onClick={() => setShowEarlyBookingModal(true)}
                  className="ml-4 p-2 hover:bg-gray-100 rounded-full transition"
                >
                  {hasEarlyBookingDiscount ? (
                    <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Sección: Descuentos para grupos grandes */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Descuentos para grupos grandes
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Ofrece un descuento para atraer a grupos más grandes.
              </p>

              {/* Botón Agrega un descuento */}
              <div className="bg-white border border-gray-300 rounded-2xl p-6 hover:shadow-md transition">
                <button
                  onClick={() => setShowGroupDiscountModal(true)}
                  className="w-full flex justify-between items-center"
                >
                  <div className="text-left flex-1">
                    <span className="text-base font-medium text-gray-900 block">
                      {hasGroupDiscount && groupDiscountMinGuests && groupDiscountPercent
                        ? `${groupDiscountPercent}% de descuento para grupos de ${groupDiscountMinGuests}+ personas`
                        : 'Agrega un descuento'
                      }
                    </span>
                  </div>
                  {hasGroupDiscount ? (
                    <svg className="w-6 h-6 text-gray-900 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-gray-900 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Texto informativo */}
            <p className="text-sm text-gray-600 text-center mt-12">
              Solo aplicaremos un descuento por reservación, el que sea más beneficioso para los participantes.
            </p>

            {/* Modal: Descuento por tiempo limitado */}
            {showLimitedTimeModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-3xl max-w-md w-full p-8 relative">
                  {/* Botón cerrar */}
                  <button
                    onClick={() => setShowLimitedTimeModal(false)}
                    className="absolute top-6 left-6 p-1 hover:bg-gray-100 rounded-full transition"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Título */}
                  <h2 className="text-xl font-semibold text-gray-900 text-center mb-2 mt-8">
                    Descuento por tiempo limitado
                  </h2>
                  <p className="text-sm text-gray-600 text-center mb-12">
                    Applies to all bookings made in the first 90 days
                  </p>

                  {/* Input de porcentaje */}
                  <div className="flex items-center justify-center mb-12">
                    <input
                      type="number"
                      value={limitedTimeDiscount}
                      onChange={(e) => setLimitedTimeDiscount(e.target.value)}
                      className="text-8xl font-bold text-gray-900 w-48 text-center border-b-2 border-gray-300 
                        focus:border-gray-900 focus:outline-none"
                      min="0"
                      max="100"
                      placeholder="0"
                    />
                    <span className="text-8xl font-bold text-gray-900">%</span>
                  </div>

                  {/* Botones */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setLimitedTimeDiscount('');
                        setHasLimitedTimeDiscount(false);
                        setShowLimitedTimeModal(false);
                      }}
                      className="flex-1 py-3 px-6 rounded-lg border border-gray-900 text-gray-900 
                        font-semibold hover:bg-gray-50 transition"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => {
                        setHasLimitedTimeDiscount(true);
                        setShowLimitedTimeModal(false);
                      }}
                      className="flex-1 py-3 px-6 rounded-lg bg-gray-900 text-white font-semibold 
                        hover:bg-black transition"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal: Descuento por reservación anticipada */}
            {showEarlyBookingModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-3xl max-w-md w-full p-8 relative">
                  {/* Botón cerrar */}
                  <button
                    onClick={() => setShowEarlyBookingModal(false)}
                    className="absolute top-6 left-6 p-1 hover:bg-gray-100 rounded-full transition"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Título */}
                  <h2 className="text-xl font-semibold text-gray-900 text-center mb-8 mt-8">
                    Descuento por reservación anticipada
                  </h2>

                  {/* Porcentaje grande */}
                  <div className="text-center mb-8">
                    <p className="text-6xl font-bold text-gray-900">
                      {earlyBookingDiscount}% de descuento
                    </p>
                  </div>

                  {/* Descripción */}
                  <p className="text-sm text-gray-600 text-center mb-8">
                    Se aplica a todas las reservaciones realizadas con más de 2 semanas de anticipación.
                  </p>

                  {/* Botones */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setHasEarlyBookingDiscount(false);
                        setShowEarlyBookingModal(false);
                      }}
                      className="flex-1 py-3 px-6 rounded-lg text-gray-600 font-semibold 
                        hover:bg-gray-100 transition"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        setHasEarlyBookingDiscount(true);
                        setShowEarlyBookingModal(false);
                      }}
                      className="flex-1 py-3 px-6 rounded-lg bg-gray-900 text-white font-semibold 
                        hover:bg-black transition"
                    >
                      Aplica un descuento
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal: Descuento para grupos grandes */}
            {showGroupDiscountModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-3xl max-w-md w-full p-8 relative">
                  {/* Botón cerrar */}
                  <button
                    onClick={() => setShowGroupDiscountModal(false)}
                    className="absolute top-6 left-6 p-1 hover:bg-gray-100 rounded-full transition"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Título */}
                  <h2 className="text-xl font-semibold text-gray-900 text-center mb-8 mt-8">
                    Descuento para grupos grandes
                  </h2>

                  {/* Campo 1: Número mínimo de huéspedes */}
                  <div className="mb-6">
                    <input
                      type="number"
                      value={groupDiscountMinGuests}
                      onChange={(e) => setGroupDiscountMinGuests(e.target.value)}
                      placeholder="Número mínimo de huéspedes"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base
                        focus:border-gray-900 focus:outline-none"
                      min="1"
                    />
                  </div>

                  {/* Campo 2: Descuento */}
                  <div className="mb-8">
                    <div className="relative">
                      <input
                        type="number"
                        value={groupDiscountPercent}
                        onChange={(e) => setGroupDiscountPercent(e.target.value)}
                        placeholder="Descuento"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base
                          focus:border-gray-900 focus:outline-none pr-12"
                        min="0"
                        max="100"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-base">
                        %
                      </span>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setGroupDiscountMinGuests('');
                        setGroupDiscountPercent('');
                        setHasGroupDiscount(false);
                        setShowGroupDiscountModal(false);
                      }}
                      className="flex-1 py-3 px-6 rounded-lg text-gray-600 font-semibold 
                        hover:bg-gray-100 transition"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => {
                        if (groupDiscountMinGuests && groupDiscountPercent) {
                          setHasGroupDiscount(true);
                          setShowGroupDiscountModal(false);
                        }
                      }}
                      disabled={!groupDiscountMinGuests || !groupDiscountPercent}
                      className={`flex-1 py-3 px-6 rounded-lg font-semibold transition
                        ${groupDiscountMinGuests && groupDiscountPercent
                          ? 'bg-gray-900 text-white hover:bg-black'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
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

      // Paso 21: Detalles - Preguntas legales
      case 21:
        return (
          <div className="max-w-2xl mx-auto px-6 py-16">
            <div className="text-center mb-12">
              <h2 className="text-sm font-medium text-gray-600">
                Detalles - Paso 7 de 7
              </h2>
            </div>

            <div className="space-y-12">
              {/* Pregunta 1: ¿Transportarás a los participantes? */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  ¿Transportarás a los participantes?
                </h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setProvidesTransport(true);
                      if (!providesTransport) {
                        setTransportTypes([]);
                      }
                    }}
                    className={`flex-1 py-3 px-6 rounded-lg border-2 font-medium transition
                      ${providesTransport === true
                        ? 'border-gray-900 bg-gray-50 text-gray-900'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                  >
                    Sí
                  </button>
                  <button
                    onClick={() => {
                      setProvidesTransport(false);
                      setTransportTypes([]);
                    }}
                    className={`flex-1 py-3 px-6 rounded-lg border-2 font-medium transition
                      ${providesTransport === false
                        ? 'border-gray-900 bg-gray-50 text-gray-900'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Pregunta condicional: ¿Cómo? */}
              {providesTransport === true && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    ¿Cómo? Selecciona todas las opciones que correspondan.
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        if (transportTypes.includes('car')) {
                          setTransportTypes(transportTypes.filter(t => t !== 'car'));
                        } else {
                          setTransportTypes([...transportTypes, 'car']);
                        }
                      }}
                      className={`py-3 px-6 rounded-lg border-2 font-medium transition
                        ${transportTypes.includes('car')
                          ? 'border-gray-900 bg-gray-50 text-gray-900'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                    >
                      Coche
                    </button>
                    <button
                      onClick={() => {
                        if (transportTypes.includes('boat')) {
                          setTransportTypes(transportTypes.filter(t => t !== 'boat'));
                        } else {
                          setTransportTypes([...transportTypes, 'boat']);
                        }
                      }}
                      className={`py-3 px-6 rounded-lg border-2 font-medium transition
                        ${transportTypes.includes('boat')
                          ? 'border-gray-900 bg-gray-50 text-gray-900'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                    >
                      Barco
                    </button>
                    <button
                      onClick={() => {
                        if (transportTypes.includes('plane')) {
                          setTransportTypes(transportTypes.filter(t => t !== 'plane'));
                        } else {
                          setTransportTypes([...transportTypes, 'plane']);
                        }
                      }}
                      className={`py-3 px-6 rounded-lg border-2 font-medium transition
                        ${transportTypes.includes('plane')
                          ? 'border-gray-900 bg-gray-50 text-gray-900'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                    >
                      Avión
                    </button>
                    <button
                      onClick={() => {
                        if (transportTypes.includes('motorcycle')) {
                          setTransportTypes(transportTypes.filter(t => t !== 'motorcycle'));
                        } else {
                          setTransportTypes([...transportTypes, 'motorcycle']);
                        }
                      }}
                      className={`py-3 px-6 rounded-lg border-2 font-medium transition
                        ${transportTypes.includes('motorcycle')
                          ? 'border-gray-900 bg-gray-50 text-gray-900'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                    >
                      Motocicleta
                    </button>
                  </div>
                </div>
              )}

              {/* Pregunta 2: ¿Servirás comida? */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  ¿Servirás comida?
                </h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setProvidesFood(true);
                      if (!providesFood) {
                        setFoodLicensedEstablishment(null);
                      }
                    }}
                    className={`flex-1 py-3 px-6 rounded-lg border-2 font-medium transition
                      ${providesFood === true
                        ? 'border-gray-900 bg-gray-50 text-gray-900'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                  >
                    Sí
                  </button>
                  <button
                    onClick={() => {
                      setProvidesFood(false);
                      setFoodLicensedEstablishment(null);
                    }}
                    className={`flex-1 py-3 px-6 rounded-lg border-2 font-medium transition
                      ${providesFood === false
                        ? 'border-gray-900 bg-gray-50 text-gray-900'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Pregunta condicional: Establecimiento con licencia para comida */}
              {providesFood === true && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    ¿Se preparará en un establecimiento de comida con licencia, como un restaurante?
                  </h3>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setFoodLicensedEstablishment(true)}
                      className={`flex-1 py-3 px-6 rounded-lg border-2 font-medium transition
                        ${foodLicensedEstablishment === true
                          ? 'border-gray-900 bg-gray-50 text-gray-900'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                    >
                      Sí
                    </button>
                    <button
                      onClick={() => setFoodLicensedEstablishment(false)}
                      className={`flex-1 py-3 px-6 rounded-lg border-2 font-medium transition
                        ${foodLicensedEstablishment === false
                          ? 'border-gray-900 bg-gray-50 text-gray-900'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              )}

              {/* Pregunta 3: ¿Servirás bebidas alcohólicas? */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  ¿Servirás bebidas alcohólicas?
                </h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setProvidesAlcohol(true);
                      if (!providesAlcohol) {
                        setAlcoholLicensedEstablishment(null);
                      }
                    }}
                    className={`flex-1 py-3 px-6 rounded-lg border-2 font-medium transition
                      ${providesAlcohol === true
                        ? 'border-gray-900 bg-gray-50 text-gray-900'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                  >
                    Sí
                  </button>
                  <button
                    onClick={() => {
                      setProvidesAlcohol(false);
                      setAlcoholLicensedEstablishment(null);
                    }}
                    className={`flex-1 py-3 px-6 rounded-lg border-2 font-medium transition
                      ${providesAlcohol === false
                        ? 'border-gray-900 bg-gray-50 text-gray-900'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Pregunta condicional: Establecimiento con licencia para alcohol */}
              {providesAlcohol === true && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    ¿Será en un establecimiento con licencia, como un bar?
                  </h3>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setAlcoholLicensedEstablishment(true)}
                      className={`flex-1 py-3 px-6 rounded-lg border-2 font-medium transition
                        ${alcoholLicensedEstablishment === true
                          ? 'border-gray-900 bg-gray-50 text-gray-900'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                    >
                      Sí
                    </button>
                    <button
                      onClick={() => setAlcoholLicensedEstablishment(false)}
                      className={`flex-1 py-3 px-6 rounded-lg border-2 font-medium transition
                        ${alcoholLicensedEstablishment === false
                          ? 'border-gray-900 bg-gray-50 text-gray-900'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      // Paso 22: Envía tu anuncio - Revisión final
      case 22:
        return (
          <div className="min-h-screen bg-black text-white -mt-20 -mb-32 pt-20 pb-32">
            {/* Header personalizado para este paso */}
            <div className="fixed top-0 left-0 right-0 bg-black z-50 px-6 py-4 flex justify-between items-center">
              {/* Logo de Airbnb */}
              <svg className="h-8 w-auto" viewBox="0 0 1600 500" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <style>{`.airbnb-red{fill:none;stroke:#FFFFFF;stroke-width:50;stroke-linecap:round;stroke-linejoin:round;}`}</style>
                </defs>
                <path className="airbnb-red" d="M300 450c-120 0-240-180-240-300 0-66 54-120 120-120s120 54 120 120c0-66 54-120 120-120s120 54 120 120c0 120-120 300-240 300z M300 348a60 60 0 1 0 0-120 60 60 0 0 0 0 120z"/>
              </svg>

              {/* Botón Guardar y salir */}
              <button className="text-white font-semibold hover:underline">
                Guardar y salir
              </button>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Columna izquierda - Lista de secciones */}
                <div>
                  <h1 className="text-5xl font-semibold mb-4">
                    Envía tu anuncio
                  </h1>
                  <p className="text-gray-400 mb-12">
                    Revisa los detalles y envíalos cuando tengas todo listo.
                  </p>

                  {/* Lista de secciones */}
                  <div className="space-y-4">
                    {/* Acerca de ti */}
                    <button
                      onClick={() => setCurrentStep(6)}
                      className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-900 transition group"
                    >
                      <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-gray-700 transition">
                        <span className="text-lg font-semibold">M</span>
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-white">Acerca de ti</h3>
                        <p className="text-sm text-gray-400">Tus cualificaciones</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Ubicación */}
                    <button
                      onClick={() => setCurrentStep(9)}
                      className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-900 transition group"
                    >
                      <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-gray-700 transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-white">Ubicación</h3>
                        <p className="text-sm text-gray-400 truncate">
                          {experienceData.meetingLocation || 'Calle Josefa Ortiz de Dominguez S/N...'}
                        </p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Fotos */}
                    <button
                      onClick={() => setCurrentStep(12)}
                      className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-900 transition group"
                    >
                      <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-gray-700 transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-white">Fotos</h3>
                        <p className="text-sm text-gray-400">
                          {experienceData.photos?.length || 0} fotos
                        </p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Experiencia */}
                    <button
                      onClick={() => setCurrentStep(13)}
                      className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-900 transition group"
                    >
                      <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-gray-700 transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-white">Experiencia</h3>
                        <p className="text-sm text-gray-400 truncate">
                          {experienceData.experienceTitle || 'Mafer'}
                        </p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Itinerario */}
                    <button
                      onClick={() => setCurrentStep(15)}
                      className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-900 transition group"
                    >
                      <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-gray-700 transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-white">Itinerario</h3>
                        <p className="text-sm text-gray-400">
                          {experienceData.itinerary?.length || 0} actividades
                        </p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Precios */}
                    <button
                      onClick={() => setCurrentStep(17)}
                      className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-900 transition group"
                    >
                      <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-gray-700 transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-white">Precios</h3>
                        <p className="text-sm text-gray-400">
                          ${experienceData.price || '100'} MXN por huésped
                        </p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Detalles */}
                    <button
                      onClick={() => setCurrentStep(21)}
                      className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-900 transition group"
                    >
                      <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-gray-700 transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-white">Detalles</h3>
                        <p className="text-sm text-gray-400">
                          {providesTransport === true && 'Transporte, '}
                          {providesAlcohol === true && 'se sirve alcohol, '}
                          {providesFood === true && 'se sirve c...'}
                        </p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Link adicional */}
                  <div className="mt-8">
                    <button className="text-gray-400 hover:text-white underline text-sm">
                      ¿Formas parte de una organización con la que colaboramos? Ingresa un código de invitación
                    </button>
                  </div>
                </div>

                {/* Columna derecha - Preview card */}
                <div className="flex items-start justify-center lg:justify-end">
                  <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
                    {/* Fotos preview */}
                    <div className="mb-6 relative">
                      {experienceData.photos && experienceData.photos.length > 0 ? (
                        <div className="grid grid-cols-3 gap-1 rounded-2xl overflow-hidden h-48">
                          {experienceData.photos.slice(0, 3).map((photo, index) => (
                            <img
                              key={index}
                              src={photo}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center">
                          <svg className="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Avatar superpuesto */}
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                        <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center text-white text-2xl font-semibold border-4 border-white">
                          M
                        </div>
                      </div>
                    </div>

                    {/* Nombre */}
                    <div className="text-center mt-8">
                      <h2 className="text-2xl font-semibold text-gray-900">Mafer</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer fijo */}
            <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 py-4 px-6">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 w-5 h-5 rounded border-gray-600 text-red-600 focus:ring-red-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-400">
                    Al seleccionar el botón, acepto los{' '}
                    <a href="#" className="underline hover:text-white">
                      Términos de las Experiencias
                    </a>
                  </label>
                </div>

                <button 
                  onClick={() => setCurrentStep(23)}
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-lg transition ml-6"
                >
                  Enviar a revisión
                </button>
              </div>
            </div>
          </div>
        );

      // Paso 23: Gracias por avisarnos - Confirmación final
      case 23:
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Columna izquierda - Mensaje */}
              <div>
                <h1 className="text-6xl font-semibold text-gray-900 mb-6 leading-tight">
                  Gracias por avisarnos
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Revisaremos tu anuncio en los próximos días y te avisaremos si lo aprobamos o si necesitas actualizar algo.
                </p>
              </div>

              {/* Columna derecha - Preview card */}
              <div className="flex items-center justify-center">
                <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-xl">
                  {/* Foto principal */}
                  <div className="mb-6 relative">
                    {experienceData.photos && experienceData.photos.length > 0 ? (
                      <div className="rounded-2xl overflow-hidden h-64">
                        <img
                          src={experienceData.photos[0]}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-64 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center">
                        <svg className="w-20 h-20 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Avatar superpuesto */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                      <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center text-white text-2xl font-semibold border-4 border-white">
                        M
                      </div>
                    </div>
                  </div>

                  {/* Nombre */}
                  <div className="text-center mt-8">
                    <h2 className="text-2xl font-semibold text-gray-900">Mafer</h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón Listo en esquina inferior derecha */}
            <div className="fixed bottom-8 right-8">
              <button 
                onClick={() => {
                  // Aquí podrías redirigir a otra página o reiniciar el flujo
                  console.log('Experiencia completada');
                  alert('¡Experiencia creada con éxito!');
                }}
                className="bg-gray-900 hover:bg-black text-white font-semibold py-3 px-8 rounded-lg transition shadow-lg"
              >
                Listo
              </button>
            </div>
          </div>
        );

      default:
        // Renderizar el resto de pasos genéricos
        return (
          <div className="max-w-3xl mx-auto py-12">
            <h1 className="text-3xl font-semibold mb-10 text-gray-900">
              Paso {currentStep} de 17
            </h1>
            <p className="text-lg text-gray-700">
              Contenido de prueba para el paso {currentStep}.
            </p>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen flex flex-col pt-20 ${devMode ? 'pl-20' : ''}`}>
      {/* Panel de Desarrollo - Sidebar izquierdo estilo Airbnb */}
      {devMode && (
        <div className="fixed left-0 top-0 bottom-0 w-20 bg-gray-900 z-[60] flex flex-col items-center py-6 gap-3 overflow-y-auto shadow-2xl"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#4B5563 #1F2937'
          }}>
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
          
          {/* Botones de navegación por paso organizados por secciones */}
          <div className="flex flex-col items-center gap-2 w-full px-2">
            {/* Configuración inicial */}
            <div className="text-xs text-gray-500 font-semibold mt-2">Inicio</div>
            {[1, 2, 3, 4].map((step) => (
              <button
                key={step}
                onClick={() => setCurrentStep(step)}
                className={`w-12 h-12 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center ${
                  currentStep === step
                    ? 'bg-white text-gray-900 shadow-lg scale-110'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white hover:scale-105'
                }`}
                title={`Paso ${step}`}
              >
                {step}
              </button>
            ))}

            <div className="w-12 h-px bg-gray-700 my-1"></div>

            {/* Acerca de ti */}
            <div className="text-xs text-gray-500 font-semibold">Acerca</div>
            {[5, 6, 7, 8].map((step) => (
              <button
                key={step}
                onClick={() => setCurrentStep(step)}
                className={`w-12 h-12 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center ${
                  currentStep === step
                    ? 'bg-white text-gray-900 shadow-lg scale-110'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white hover:scale-105'
                }`}
                title={`Paso ${step}`}
              >
                {step}
              </button>
            ))}

            <div className="w-12 h-px bg-gray-700 my-1"></div>

            {/* Ubicación */}
            <div className="text-xs text-gray-500 font-semibold">Ubicación</div>
            {[9, 10, 11].map((step) => (
              <button
                key={step}
                onClick={() => setCurrentStep(step)}
                className={`w-12 h-12 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center ${
                  currentStep === step
                    ? 'bg-white text-gray-900 shadow-lg scale-110'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white hover:scale-105'
                }`}
                title={`Paso ${step}`}
              >
                {step}
              </button>
            ))}

            <div className="w-12 h-px bg-gray-700 my-1"></div>

            {/* Fotos */}
            <div className="text-xs text-gray-500 font-semibold">Fotos</div>
            <button
              onClick={() => setCurrentStep(12)}
              className={`w-12 h-12 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center ${
                currentStep === 12
                  ? 'bg-white text-gray-900 shadow-lg scale-110'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white hover:scale-105'
              }`}
              title="Paso 12"
            >
              12
            </button>

            <div className="w-12 h-px bg-gray-700 my-1"></div>

            {/* Experiencia */}
            <div className="text-xs text-gray-500 font-semibold">Experiencia</div>
            {[13, 14, 15].map((step) => (
              <button
                key={step}
                onClick={() => setCurrentStep(step)}
                className={`w-12 h-12 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center ${
                  currentStep === step
                    ? 'bg-white text-gray-900 shadow-lg scale-110'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white hover:scale-105'
                }`}
                title={`Paso ${step}`}
              >
                {step}
              </button>
            ))}

            <div className="w-12 h-px bg-gray-700 my-1"></div>

            {/* Participantes */}
            <div className="text-xs text-gray-500 font-semibold">Participan.</div>
            <button
              onClick={() => setCurrentStep(16)}
              className={`w-12 h-12 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center ${
                currentStep === 16
                  ? 'bg-white text-gray-900 shadow-lg scale-110'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white hover:scale-105'
              }`}
              title="Paso 16"
            >
              16
            </button>

            <div className="w-12 h-px bg-gray-700 my-1"></div>

            {/* Precios */}
            <div className="text-xs text-gray-500 font-semibold">Precios</div>
            {[17, 18, 19, 20].map((step) => (
              <button
                key={step}
                onClick={() => setCurrentStep(step)}
                className={`w-12 h-12 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center ${
                  currentStep === step
                    ? 'bg-white text-gray-900 shadow-lg scale-110'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white hover:scale-105'
                }`}
                title={`Paso ${step}`}
              >
                {step}
              </button>
            ))}

            <div className="w-12 h-px bg-gray-700 my-1"></div>

            {/* Detalles */}
            <div className="text-xs text-gray-500 font-semibold">Detalles</div>
            <button
              onClick={() => setCurrentStep(21)}
              className={`w-12 h-12 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center ${
                currentStep === 21
                  ? 'bg-white text-gray-900 shadow-lg scale-110'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white hover:scale-105'
              }`}
              title="Paso 21"
            >
              21
            </button>

            <div className="w-12 h-px bg-gray-700 my-1"></div>

            {/* Revisión */}
            <div className="text-xs text-gray-500 font-semibold">Revisión</div>
            {[22, 23].map((step) => (
              <button
                key={step}
                onClick={() => setCurrentStep(step)}
                className={`w-12 h-12 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center ${
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
      {!devMode && (
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

      <header className={`fixed top-0 w-full bg-white border-b border-gray-200 z-50 ${devMode ? 'left-20' : 'left-0'} ${currentStep === 22 || currentStep === 23 ? 'hidden' : ''}`} style={devMode ? { width: 'calc(100% - 5rem)' } : {}}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-start items-center">
          {/* SVG del Logo de Airbnb */}
          <svg className="h-8 w-auto text-primary" viewBox="0 0 1600 500" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <style>{`.airbnb-red{fill:none;stroke:#FF5A5F;stroke-width:50;stroke-linecap:round;stroke-linejoin:round;}`}</style>
            </defs>
            <path className="airbnb-red" d="M300 450c-120 0-240-180-240-300 0-66 54-120 120-120s120 54 120 120c0-66 54-120 120-120s120 54 120 120c0 120-120 300-240 300z M300 348a60 60 0 1 0 0-120 60 60 0 0 0 0 120z"/>
          </svg>
        </div>
      </header>
      
      <main className="flex-grow pb-32">
        {renderStep(currentStep)} 
      </main>

      <footer className={`fixed bottom-0 w-full bg-white border-t border-gray-200 z-50 ${devMode ? 'left-20' : 'left-0'} ${currentStep === 22 || currentStep === 23 ? 'hidden' : ''}`} style={devMode ? { width: 'calc(100% - 5rem)' } : {}}>
        <div className="px-6 py-5"> 
          <div className="h-1 bg-gray-200 rounded-full mb-4">
            <div 
              className="h-1 bg-gray-900 rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className='flex items-center'>
              <button
                onClick={currentStep === 18 ? nextStep : prevStep}
                className="font-semibold py-3 px-6 rounded-lg transition text-gray-900 hover:bg-gray-100"
              >
                {currentStep === 18 ? 'Omitir' : 'Atrás'}
              </button>
            </div>

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
              {currentStep === 4 ? 'Empezar' : currentStep === 17 ? 'Siguiente' : 'Siguiente'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}