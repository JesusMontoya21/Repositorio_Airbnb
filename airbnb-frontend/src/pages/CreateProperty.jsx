import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function CreateProperty() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [isSuperHost, setIsSuperHost] = useState(false);
  
  const [propertyData, setPropertyData] = useState({
    propertyType: null,
    placeType: null,
    address: '',
    basics: {
      guests: 1,
      bedrooms: 0,
      beds: 1,
      bathrooms: 0.5
    },
    amenities: [],
    title: '',
    description: '',
    bookingPreference: 'approve_first',
    guestPreference: 'any_guest',
    price: 387,
    weekendPricePercentage: 0,
    discounts: [],
    safetyItems: [],
    cameraDescription: ''
  });

  const updatePropertyData = useCallback((updates) => {
    setPropertyData(prev => ({ ...prev, ...updates }));
  }, []);

  const updateBasics = useCallback((basics) => {
    setPropertyData(prev => ({ ...prev, basics }));
  }, []);

  const updateAmenities = useCallback((amenities) => {
    setPropertyData(prev => ({ ...prev, amenities }));
  }, []);

  const updateSafetyItems = useCallback((safetyItems) => {
    setPropertyData(prev => ({ ...prev, safetyItems }));
  }, []);

  const updateCameraDescription = useCallback((cameraDescription) => {
    setPropertyData(prev => ({ ...prev, cameraDescription }));
  }, []);

  const handleCreateProperty = async () => {
    try {
      await api.post('/properties', {
        title: propertyData.title || 'Mi propiedad',
        description: propertyData.description || 'Descripción de mi propiedad',
        city: propertyData.address.split(',')[0] || propertyData.address,
        country: 'México',
        address: propertyData.address,
        price_per_night: propertyData.price,
        guests: propertyData.basics.guests,
        bedrooms: propertyData.basics.bedrooms,
        bathrooms: propertyData.basics.bathrooms,
        type: propertyData.propertyType || 'apartment',
      });
      alert('¡Felicidades! Tu propiedad ha sido creada exitosamente.');
      navigate('/my-properties');
    } catch (error) {
      alert(error.response?.data?.message || 'Error al crear la propiedad. Asegúrate de estar logueado.');
    }
  };

  const HostIntroModal = ({ onClose }) => {
    const avatars = [
      'https://randomuser.me/api/portraits/women/68.jpg',
      'https://randomuser.me/api/portraits/men/4.jpg',
      'https://randomuser.me/api/portraits/women/90.jpg',
      'https://randomuser.me/api/portraits/women/16.jpg',
      'https://randomuser.me/api/portraits/men/32.jpg',
      'https://randomuser.me/api/portraits/women/44.jpg',
      'https://randomuser.me/api/portraits/men/88.jpg',
      'https://randomuser.me/api/portraits/women/77.jpg',
      'https://randomuser.me/api/portraits/men/2.jpg',
      'https://randomuser.me/api/portraits/women/55.jpg',
      'https://randomuser.me/api/portraits/men/29.jpg',
    ];
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-11/12 max-w-lg">
          <div className="relative h-64 bg-black overflow-hidden flex items-center justify-center p-4">
            {avatars.map((url, index) => (
              <div key={index} className="absolute rounded-full border-2 border-gray-700 overflow-hidden shadow-md"
                style={{ width: `${50 + (index % 4) * 5}px`, height: `${50 + (index % 4) * 5}px`, left: `${(index * 17 + 5) % 90}%`, top: `${(index * 23 + 10) % 80}%`, filter: 'grayscale(70%) opacity(80%)', zIndex: index === 3 ? 10 : 0 }}>
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="absolute w-36 h-36 rounded-full border-4 border-white shadow-2xl overflow-hidden z-20">
              <img src="https://randomuser.me/api/portraits/women/79.jpg" alt="" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="p-8 pb-4">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Recibe asesoramiento personalizado de un Superanfitrión</h2>
            <p className="text-base text-gray-700 mb-8">Te asignaremos un anfitrión con experiencia, para que te oriente mientras pones tu casa en Airbnb.</p>
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button onClick={() => onClose(false)} className="text-gray-900 text-base py-3 font-semibold hover:underline">Empieza por tu cuenta</button>
              <button onClick={() => onClose(true)} className="bg-[#222222] text-white py-4 px-6 rounded-xl text-base font-semibold hover:bg-black transition">Encuéntrame un Superanfitrión</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Step1Intro = () => (
    <div className="flex w-full max-w-[1280px] h-full items-center justify-center p-8 mx-auto">
      <div className="flex w-full max-w-6xl">
        <div className="flex-1 flex flex-col justify-center pr-12 max-w-xl">
          <p className="text-lg font-semibold text-gray-900 mb-2">Paso 1</p>
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-8">Describe tu espacio</h1>
          <p className="text-lg text-gray-600">En este paso, te preguntaremos qué tipo de alojamiento compartes y si los huéspedes reservarán el espacio entero o una habitación.</p>
        </div>
        <div className="flex-1 flex justify-center items-center pl-12">
          <div className="w-[450px] h-[450px] bg-gray-100 rounded-xl flex items-center justify-center">
            <span className="text-8xl">🏠</span>
          </div>
        </div>
      </div>
    </div>
  );

  const Step2PropertyType = ({ propertyType, setPropertyType }) => {
    const types = [
      { id: 'house', label: 'Casa' },
      { id: 'apartment', label: 'Departamento' },
      { id: 'cabin', label: 'Cabaña' },
      { id: 'hotel', label: 'Hotel' },
      { id: 'boat', label: 'Barco' },
      { id: 'rv', label: 'Casa rodante' },
      { id: 'tent', label: 'Tienda de campaña' },
      { id: 'treehouse', label: 'Casa del árbol' },
      { id: 'castle', label: 'Castillo' },
      { id: 'dome', label: 'Domo' },
      { id: 'tiny_home', label: 'Minicasa' },
      { id: 'farm', label: 'Granja' },
    ];
    return (
      <div className="flex flex-col w-full max-w-2xl px-6 mx-auto pb-8 pt-1">
        <div className="mb-8"><h1 className="text-4xl font-extrabold text-gray-900">¿Cuál de estas opciones describe mejor tu alojamiento?</h1></div>
        <div className="grid grid-cols-3 gap-4">
          {types.map((type) => (
            <button key={type.id} onClick={() => setPropertyType(type.id)}
              className={`flex flex-col items-start p-4 h-[80px] border-2 rounded-xl text-left transition-all ${propertyType === type.id ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-900'}`}>
              <span className="text-base font-semibold text-gray-900">{type.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const Step3PlaceType = ({ placeType, setPlaceType }) => {
    const types = [
      { id: 'entire_place', label: 'Un alojamiento entero', description: 'Los huéspedes tienen toda la propiedad para ellos.' },
      { id: 'private_room', label: 'Una habitación', description: 'Los huéspedes tienen su propia habitación en un alojamiento.' },
      { id: 'shared_room', label: 'Una habitación compartida', description: 'Los huéspedes duermen en una habitación compartida.' },
    ];
    return (
      <div className="flex flex-col w-full max-w-2xl px-8 mx-auto pt-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">¿Qué tipo de alojamiento ofreces?</h1>
        <div className="space-y-4">
          {types.map((type) => (
            <button key={type.id} onClick={() => setPlaceType(type.id)}
              className={`flex items-center justify-between p-6 w-full border-2 rounded-xl text-left transition-all ${placeType === type.id ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-900'}`}>
              <div>
                <span className="text-xl font-semibold text-gray-900 block mb-1">{type.label}</span>
                <p className="text-base text-gray-600">{type.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const Step4Location = ({ address, setAddress }) => (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-10 pt-6 pb-8">
      <div className="mb-5 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">¿Dónde se encuentra tu espacio?</h1>
        <p className="text-sm text-gray-600">Solo compartiremos la dirección con los huéspedes después de que hayan hecho la reservación.</p>
      </div>
      <div className="w-full h-[200px] bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
        <span className="text-6xl">📍</span>
      </div>
      <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
        placeholder="Ingresa tu dirección completa"
        className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-gray-900" />
    </div>
  );

  const Step5BasicInfo = ({ basics, setBasics }) => {
    const items = [
      { id: 'guests', label: 'Huéspedes', min: 1 },
      { id: 'bedrooms', label: 'Recámaras', min: 0 },
      { id: 'beds', label: 'Camas', min: 1 },
      { id: 'bathrooms', label: 'Baños', min: 0.5 }
    ];
    const handleIncrement = (field) => {
      const increment = field === 'bathrooms' ? 0.5 : 1;
      setBasics({ ...basics, [field]: basics[field] + increment });
    };
    const handleDecrement = (field) => {
      const decrement = field === 'bathrooms' ? 0.5 : 1;
      const item = items.find(i => i.id === field);
      if (basics[field] > item.min) setBasics({ ...basics, [field]: basics[field] - decrement });
    };
    return (
      <div className="flex flex-col w-full max-w-2xl mx-auto px-10 py-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Agrega algunos datos básicos</h1>
        </div>
        <div className="space-y-8">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-6 border-b border-gray-200">
              <span className="text-lg font-medium text-gray-900">{item.label}</span>
              <div className="flex items-center gap-4">
                <button onClick={() => handleDecrement(item.id)} disabled={basics[item.id] <= item.min}
                  className={`w-8 h-8 rounded-full border transition-all flex items-center justify-center ${basics[item.id] <= item.min ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-400 text-gray-600 hover:border-gray-900'}`}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" /></svg>
                </button>
                <span className="text-lg font-normal text-gray-900 w-8 text-center">
                  {item.id === 'bathrooms' ? basics[item.id].toFixed(1) : basics[item.id]}
                </span>
                <button onClick={() => handleIncrement(item.id)}
                  className="w-8 h-8 rounded-full border border-gray-400 text-gray-600 hover:border-gray-900 flex items-center justify-center">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const Step6IntroStep2 = () => (
    <div className="flex w-full max-w-[1280px] h-full items-center justify-center p-8 mx-auto">
      <div className="flex w-full max-w-6xl">
        <div className="flex-1 flex flex-col justify-center pr-12 max-w-xl">
          <p className="text-lg font-semibold text-gray-900 mb-2">Paso 2</p>
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-8">Haz que tu espacio se destaque</h1>
          <p className="text-lg text-gray-600">Agregarás servicios, fotos, un título y una descripción.</p>
        </div>
        <div className="flex-1 flex justify-center items-center pl-12">
          <div className="w-[450px] h-[450px] bg-gray-100 rounded-xl flex items-center justify-center">
            <span className="text-8xl">✨</span>
          </div>
        </div>
      </div>
    </div>
  );

  const Step7Amenities = ({ amenities, setAmenities }) => {
    const amenitiesList = [
      { id: 'wifi', label: 'Wifi' },
      { id: 'tv', label: 'TV' },
      { id: 'kitchen', label: 'Cocina' },
      { id: 'washer', label: 'Lavadora' },
      { id: 'parking', label: 'Estacionamiento gratuito' },
      { id: 'ac', label: 'Aire acondicionado' },
      { id: 'workspace', label: 'Área de trabajo' },
      { id: 'pool', label: 'Alberca' },
      { id: 'jacuzzi', label: 'Jacuzzi' },
      { id: 'bbq', label: 'Parrilla BBQ' },
      { id: 'smoke_detector', label: 'Detector de humo' },
      { id: 'first_aid', label: 'Botiquín' },
    ];
    const toggle = (id) => {
      if (amenities.includes(id)) setAmenities(amenities.filter(a => a !== id));
      else setAmenities([...amenities, id]);
    };
    return (
      <div className="flex flex-col w-full max-w-2xl mx-auto px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">¿Qué servicios ofreces?</h1>
        <div className="grid grid-cols-3 gap-4">
          {amenitiesList.map((a) => (
            <button key={a.id} onClick={() => toggle(a.id)}
              className={`p-4 h-[80px] border-2 rounded-xl text-left transition-all ${amenities.includes(a.id) ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-900'}`}>
              <span className="text-sm font-medium text-gray-900">{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const Step8Photos = () => (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-6 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Agrega fotos de tu alojamiento</h1>
        <p className="text-base text-gray-600">Para empezar, necesitarás al menos 5 fotos.</p>
      </div>
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-24 text-center hover:border-gray-400 transition-colors">
        <p className="text-gray-500 mb-4">Las fotos se podrán agregar una vez publicada la propiedad</p>
        <button className="bg-gray-900 text-white py-4 px-8 rounded-lg text-base font-semibold hover:bg-black transition">
          Agregar fotos
        </button>
      </div>
    </div>
  );

  const Step9Title = ({ title, setTitle }) => {
    const maxLength = 50;
    return (
      <div className="flex flex-col w-full max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Ponle un título a tu alojamiento</h1>
          <p className="text-base text-gray-600">Los títulos cortos funcionan mejor.</p>
        </div>
        <div className="relative">
          <textarea value={title} onChange={(e) => e.target.value.length <= maxLength && setTitle(e.target.value)}
            className="w-full min-h-[200px] p-6 text-lg border border-gray-300 rounded-xl resize-none focus:outline-none focus:border-gray-900" rows="6" />
          <div className="absolute bottom-6 right-6 text-sm text-gray-500">{title.length}/{maxLength}</div>
        </div>
      </div>
    );
  };

  const Step10Description = ({ description, setDescription }) => {
    const maxLength = 500;
    return (
      <div className="flex flex-col w-full max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Crea tu descripción</h1>
          <p className="text-base text-gray-600">Explica qué hace que tu alojamiento sea especial.</p>
        </div>
        <textarea value={description} onChange={(e) => e.target.value.length <= maxLength && setDescription(e.target.value)}
          className="w-full min-h-[240px] p-6 text-lg border border-gray-300 rounded-xl resize-none focus:outline-none focus:border-gray-900" rows="8" />
        <div className="text-sm text-gray-600 mt-2">{description.length}/{maxLength}</div>
      </div>
    );
  };

  const Step11IntroStep3 = () => (
    <div className="flex w-full max-w-[1280px] h-full items-center justify-center p-8 mx-auto">
      <div className="flex w-full max-w-6xl">
        <div className="flex-1 flex flex-col justify-center pr-12 max-w-xl">
          <p className="text-lg font-semibold text-gray-900 mb-2">Paso 3</p>
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-8">Terminar y publicar</h1>
          <p className="text-lg text-gray-600">Por último, definirás tus preferencias, establecerás los precios y publicarás el anuncio.</p>
        </div>
        <div className="flex-1 flex justify-center items-center pl-12">
          <div className="w-[450px] h-[450px] bg-gray-100 rounded-xl flex items-center justify-center">
            <span className="text-8xl">🎉</span>
          </div>
        </div>
      </div>
    </div>
  );

  const Step12BookingPreference = ({ bookingPreference, setBookingPreference }) => (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Elige tus preferencias para las reservaciones</h1>
      <div className="space-y-4">
        {[
          { id: 'approve_first', label: 'Aprueba tus 5 primeras reservaciones', desc: 'Revisa las solicitudes y luego cambia a Reservación inmediata.', recommended: true },
          { id: 'instant_book', label: 'Utiliza la Reservación inmediata', desc: 'Deja que los huéspedes hagan reservaciones automáticas.' },
        ].map((opt) => (
          <button key={opt.id} onClick={() => setBookingPreference(opt.id)}
            className={`w-full text-left p-6 rounded-xl border-2 transition-all ${bookingPreference === opt.id ? 'border-gray-900 bg-white' : 'border-gray-200 hover:border-gray-400'}`}>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{opt.label}</h3>
              {opt.recommended && <span className="bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded">Recomendado</span>}
            </div>
            <p className="text-sm text-gray-600">{opt.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const Step13GuestPreference = ({ guestPreference, setGuestPreference }) => (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Elige a quién quieres recibir</h1>
      <div className="space-y-4">
        {[
          { id: 'any_guest', label: 'Cualquier huésped en Airbnb', desc: 'Para recibir reservaciones más pronto.' },
          { id: 'experienced_guest', label: 'Un huésped con experiencia', desc: 'Recibe a alguien con buenas evaluaciones.' },
        ].map((opt) => (
          <button key={opt.id} onClick={() => setGuestPreference(opt.id)}
            className={`w-full text-left p-6 rounded-xl border-2 transition-all ${guestPreference === opt.id ? 'border-gray-900 bg-white' : 'border-gray-200 hover:border-gray-400'}`}>
            <h3 className="text-base font-semibold text-gray-900 mb-1">{opt.label}</h3>
            <p className="text-sm text-gray-600">{opt.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const Step14Price = ({ price, setPrice }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(price.toString());
    return (
      <div className="flex flex-col w-full max-w-2xl mx-auto px-6 py-8 items-center">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Configura un precio base</h1>
          <p className="text-base text-gray-600">Puedes cambiarlo en cualquier momento.</p>
        </div>
        <div className="mb-8 flex items-center justify-center">
          {isEditing ? (
            <div className="flex items-center">
              <span className="text-8xl font-bold text-gray-900">$</span>
              <input type="text" value={inputValue}
                onChange={(e) => setInputValue(e.target.value.replace(/[^0-9]/g, ''))}
                onBlur={() => { setPrice(parseInt(inputValue) || 387); setIsEditing(false); }}
                onKeyPress={(e) => e.key === 'Enter' && setIsEditing(false)}
                autoFocus className="text-8xl font-bold text-gray-900 border-b-4 border-gray-900 outline-none bg-transparent text-center w-64" />
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className="text-8xl font-bold text-gray-900 border-b-4 border-transparent hover:border-gray-300">
              ${price}
            </button>
          )}
        </div>
        <p className="text-base text-gray-600">Precio para el huésped: ${Math.round(price * 1.14)} MXN</p>
      </div>
    );
  };

  const Step15WeekendPrice = ({ price, weekendPricePercentage, setWeekendPricePercentage }) => {
    const weekendPrice = Math.round(price * (1 + weekendPricePercentage / 100));
    return (
      <div className="flex flex-col w-full max-w-2xl mx-auto px-6 py-8 items-center">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Establece un precio para el fin de semana</h1>
          <p className="text-base text-gray-600">Agrega un suplemento para los viernes y sábados.</p>
        </div>
        <div className="text-7xl font-bold text-gray-900 mb-8">${weekendPrice} MXN</div>
        <div className="w-full max-w-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-base font-semibold text-gray-900">Suplemento de fin de semana</span>
            <div className="flex items-center gap-1">
              <input type="text" value={weekendPricePercentage}
                onChange={(e) => { const v = Math.min(99, parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0); setWeekendPricePercentage(v); }}
                className="w-16 text-right text-lg border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-900" />
              <span className="text-lg">%</span>
            </div>
          </div>
          <input type="range" min="0" max="99" value={weekendPricePercentage}
            onChange={(e) => setWeekendPricePercentage(parseInt(e.target.value))}
            className="w-full" style={{ background: `linear-gradient(to right, #222 0%, #222 ${weekendPricePercentage}%, #E5E7EB ${weekendPricePercentage}%, #E5E7EB 100%)`, height: '6px', borderRadius: '3px' }} />
        </div>
      </div>
    );
  };

  const Step16Discounts = ({ discounts, setDiscounts }) => {
    const options = [
      { id: 'new_listing', percentage: '20%', title: 'Promoción para anuncio nuevo', description: 'Descuento en tus primeras 3 reservaciones' },
      { id: 'weekly', percentage: '10%', title: 'Descuento por semana', description: 'Para estancias de 7 noches o más' },
      { id: 'monthly', percentage: '25%', title: 'Descuento mensual', description: 'Para estancias de 28 noches o más' },
    ];
    const toggle = (id) => {
      if (discounts.includes(id)) setDiscounts(discounts.filter(d => d !== id));
      else setDiscounts([...discounts, id]);
    };
    return (
      <div className="flex flex-col w-full max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Agregar descuentos</h1>
        <div className="space-y-4">
          {options.map((opt) => (
            <button key={opt.id} onClick={() => toggle(opt.id)}
              className={`w-full text-left p-6 rounded-xl border-2 transition-all ${discounts.includes(opt.id) ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-3xl font-bold ${discounts.includes(opt.id) ? 'text-gray-900' : 'text-gray-300'}`}>{opt.percentage}</span>
                  <h3 className="text-base font-semibold text-gray-900 mt-1">{opt.title}</h3>
                  <p className="text-sm text-gray-600">{opt.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const Step17Safety = ({ safetyItems, setSafetyItems }) => {
    const options = [
      { id: 'carbon_monoxide', title: 'Detector de monóxido de carbono' },
      { id: 'security_camera', title: 'Hay una cámara de seguridad exterior' },
      { id: 'decibel_monitor', title: 'Monitor de decibelios presente' },
      { id: 'weapons', title: 'Presencia de armas en la propiedad' },
    ];
    const toggle = (id) => {
      if (safetyItems.includes(id)) setSafetyItems(safetyItems.filter(s => s !== id));
      else setSafetyItems([...safetyItems, id]);
    };
    return (
      <div className="flex flex-col w-full max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Comparte los datos de seguridad</h1>
        <div className="space-y-4">
          {options.map((opt) => (
            <div key={opt.id} className="flex items-center gap-4 py-4 border-b border-gray-200">
              <button onClick={() => toggle(opt.id)}>
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${safetyItems.includes(opt.id) ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-400'}`}>
                  {safetyItems.includes(opt.id) && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
              </button>
              <span className="text-base text-gray-900">{opt.title}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleModalClose = (isHost) => { setShowIntroModal(false); setIsSuperHost(isHost); };

  const nextStep = () => {
    if (currentStep === 2 && !propertyData.propertyType) return;
    if (currentStep === 3 && !propertyData.placeType) return;
    if (currentStep === 4 && !propertyData.address) return;
    if (currentStep === 17) { handleCreateProperty(); return; }
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep === 1) navigate('/anuncio-alojamiento');
    else setCurrentStep(prev => prev - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return <Step1Intro />;
      case 2: return <Step2PropertyType propertyType={propertyData.propertyType} setPropertyType={(type) => updatePropertyData({ propertyType: type })} />;
      case 3: return <Step3PlaceType placeType={propertyData.placeType} setPlaceType={(type) => updatePropertyData({ placeType: type })} />;
      case 4: return <Step4Location address={propertyData.address} setAddress={(addr) => updatePropertyData({ address: addr })} />;
      case 5: return <Step5BasicInfo basics={propertyData.basics} setBasics={updateBasics} />;
      case 6: return <Step6IntroStep2 />;
      case 7: return <Step7Amenities amenities={propertyData.amenities} setAmenities={updateAmenities} />;
      case 8: return <Step8Photos />;
      case 9: return <Step9Title title={propertyData.title} setTitle={(title) => updatePropertyData({ title })} />;
      case 10: return <Step10Description description={propertyData.description} setDescription={(description) => updatePropertyData({ description })} />;
      case 11: return <Step11IntroStep3 />;
      case 12: return <Step12BookingPreference bookingPreference={propertyData.bookingPreference} setBookingPreference={(p) => updatePropertyData({ bookingPreference: p })} />;
      case 13: return <Step13GuestPreference guestPreference={propertyData.guestPreference} setGuestPreference={(p) => updatePropertyData({ guestPreference: p })} />;
      case 14: return <Step14Price price={propertyData.price} setPrice={(price) => updatePropertyData({ price })} />;
      case 15: return <Step15WeekendPrice price={propertyData.price} weekendPricePercentage={propertyData.weekendPricePercentage} setWeekendPricePercentage={(p) => updatePropertyData({ weekendPricePercentage: p })} />;
      case 16: return <Step16Discounts discounts={propertyData.discounts} setDiscounts={(d) => updatePropertyData({ discounts: d })} />;
      case 17: return <Step17Safety safetyItems={propertyData.safetyItems} setSafetyItems={updateSafetyItems} />;
      default: return <div className="text-center p-10"><h1 className="text-3xl font-bold">Paso {currentStep}</h1></div>;
    }
  };

  const totalSteps = 17;
  const progress = (currentStep / totalSteps) * 100;

  const isNextDisabled = () => {
    if (currentStep === 2 && !propertyData.propertyType) return true;
    if (currentStep === 3 && !propertyData.placeType) return true;
    if (currentStep === 4 && !propertyData.address) return true;
    return false;
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex-shrink-0 w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="text-xl font-bold text-[#FF385C]">airbnb</span>
          <div className="space-x-4">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full border border-gray-300">¿Tienes alguna duda?</button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full border border-gray-300">Guardar y salir</button>
          </div>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto flex justify-center">
        <div className={`w-full h-full flex justify-center ${[2, 5, 7, 9, 10, 12, 13, 16, 17].includes(currentStep) ? 'items-start pt-8' : 'items-center'}`}>
          {renderStepContent()}
        </div>
      </main>

      <footer className="flex-shrink-0 w-full bg-white border-t border-gray-200">
        <div className="px-6 py-5">
          <div className="h-1 bg-gray-200 rounded-full mb-4">
            <div className="h-1 bg-gray-900 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex justify-between items-center">
            <button onClick={prevStep} className="font-semibold py-3 px-6 rounded-lg text-gray-900 hover:bg-gray-100">Atrás</button>
            <button onClick={nextStep} disabled={isNextDisabled()}
              className={`font-semibold py-3 px-8 rounded-lg transition ${isNextDisabled() ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-black'}`}>
              {currentStep === 17 ? 'Crear anuncio' : 'Siguiente'}
            </button>
          </div>
        </div>
      </footer>

      {showIntroModal && <HostIntroModal onClose={handleModalClose} />}
    </div>
  );
}