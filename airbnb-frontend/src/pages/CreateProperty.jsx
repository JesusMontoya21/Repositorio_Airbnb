import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Componente principal del flujo de creación
export default function CreateProperty() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [isSuperHost, setIsSuperHost] = useState(false);
  
  // Estado para almacenar los datos del formulario
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

  // Funciones memoizadas para actualizar el estado
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

  // --- COMPONENTE DE MODAL ---
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
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-11/12 max-w-lg transform transition-all">
          
          <div className="relative h-64 bg-black overflow-hidden flex items-center justify-center p-4">
            {avatars.map((url, index) => (
              <div 
                key={index} 
                className="absolute rounded-full border-2 border-gray-700 overflow-hidden shadow-md"
                style={{
                  width: `${50 + (index % 4) * 5}px`,
                  height: `${50 + (index % 4) * 5}px`,
                  left: `${(index * 17 + 5) % 90}%`,
                  top: `${(index * 23 + 10) % 80}%`,
                  filter: 'grayscale(70%) opacity(80%)',
                  transform: `scale(${1 + (index % 3) * 0.1})`,
                  zIndex: index === 3 ? 10 : 0,
                }}
              >
                <img 
                  src={url} 
                  alt={`Avatar ${index}`} 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/60x60/363945/white?text=User'; }}
                />
              </div>
            ))}

            <div className="absolute w-36 h-36 rounded-full border-4 border-white shadow-2xl overflow-hidden z-20">
                <img 
                  src="https://randomuser.me/api/portraits/women/79.jpg"
                  alt="Superhost destacado" 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/144x144/FF385C/white?text=HOST'; }}
                />
            </div>
          </div>
          
          <div className="p-8 pb-4"> 
            <div className="text-left">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                Recibe asesoramiento personalizado de un Superanfitrión
              </h2>
              <p className="text-base text-gray-700 mb-8">
                Te asignaremos un anfitrión con experiencia, para que te oriente mientras pones tu casa en Airbnb. También puedes comenzar por tu cuenta y solicitar que te asignen uno si lo necesitas.
              </p>
            </div>
            
            <div className="flex justify-between items-center pt-6 border-t border-gray-200"> 
              <button
                onClick={() => onClose(false)}
                className="text-gray-900 text-base py-3 font-semibold hover:bg-transparent hover:underline transition"
              >
                Empieza por tu cuenta
              </button>
              
              <button
                onClick={() => onClose(true)}
                className="bg-[#222222] text-white py-4 px-6 rounded-xl text-base font-semibold shadow-md hover:bg-black transition"
              >
                Encuéntrame un Superanfitrión
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- PASO 1: DESCRIBE TU ESPACIO ---
  const Step1Intro = () => {
    const placeholderImageUrl = 'https://placehold.co/500x500/FFFFFF/E75B8D?text=Ilustracion+de+Casa+3D';
    
    return (
      <div className="flex w-full max-w-[1280px] h-full items-center justify-center p-8 mx-auto">
        <div className="flex w-full max-w-6xl">
          
          <div className="flex-1 flex flex-col justify-center pr-12 max-w-xl">
            <p className="text-lg font-semibold text-gray-900 mb-2">Paso 1</p>
            <h1 className="text-5xl lg:text-[48px] font-extrabold text-gray-900 leading-tight mb-8">
              Describe tu espacio
            </h1>
            <p className="text-lg text-gray-600">
              En este paso, te preguntaremos qué tipo de alojamiento compartes y si los huéspedes reservarán el espacio entero o una habitación. A continuación, indicamos la ubicación y cuántos huéspedes pueden quedarse.
            </p>
          </div>
          
          <div className="flex-1 flex justify-center items-center pl-12">
            <div className="w-[450px] h-[450px] bg-white rounded-xl shadow-xl overflow-hidden relative">
              <img 
                src={placeholderImageUrl} 
                alt="Ilustración 3D de la casa"
                className="w-full h-full object-contain p-4"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/500x500/FFFFFF/888888?text=Ilustracion+3D'; }}
              />
            </div>
          </div>
          
        </div>
      </div>
    );
  };

  // --- PASO 2: TIPO DE PROPIEDAD ---
  const Step2PropertyType = ({ propertyType, setPropertyType }) => {
    
    const HouseIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m16 2.5l-14 11.2h2v14.3h8v-10.3h8v10.3h8v-14.3h2l-14-11.2zm0 2.2l12 9.6v13.5h-5v-10.3h-14v10.3h-5v-13.5l12-9.6z"/></svg>;
    const ApartmentIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m20 19v-5h8v5zm0 2h8v5h-8zm-2-7v-5h-8v5zm-10 0v-5h-8v5zm2 2v5h8v-5zm-10 0v5h8v-5zm28-10h-28v18h28zm-2 16h-24v-14h24z"/></svg>;
    const BarnIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m22 23h2v-4h-2zm-6 0h2v-4h-2zm-6 0h2v-4h-2zm12.3-15.3l-10.3-8.7-10 8.7h3v19.3h14v-19.3h3zm-10 17.3h-2v-4h2zm4 0h-2v-4h2zm-2-6h2v-4h-2zm4 0h-2v-4h-2zm-2 2h2v-4h-2zm2-2h2v-4h-2zm-4-2h2v-4h-2zm4 0h2v-4h-2z"/></svg>;
    const BedAndBreakfastIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m10 21c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm10-10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-12 11h24v2h-24zm0 4h24v2h-24zm0-18c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm20 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>;
    const BoatIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m30 24h-28c-1.1 0-2 .9-2 2s.9 2 2 2h28c1.1 0 2-.9 2-2s-.9-2-2-2zm-12-8v-6h-4v6h-12v-12h28v12zm-2 0h-8v-4h8zm10-10h-24v-4h24z"/></svg>;
    const CabinIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m14 26v-8h4v8zm-12 4v-18l14-11 14 11v18h-28zm2 2h24v-16l-12-9.5-12 9.5z"/></svg>;
    const RVIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m29 18h-26c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h26c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-26 2h26v8h-26zm14-14h-4v-2h4zm-4 4h4v-2h-4zm-14-4h4v-2h-4zm-4 4h4v-2h-4zm24 0h4v-2h-4zm4-4h-4v-2h4z"/></svg>;
    const CastleIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m24 20v10h-16v-10h-2v12h20v-12zm-12 8h-4v-4h4zm8 0h-4v-4h4zm8 0h-4v-4h4zm-16-12h-4v-4h4zm8 0h-4v-4h4zm8 0h-4v-4h4zm-16-12h-4v-4h4zm8 0h-4v-4h4zm8 0h-4v-4h4z"/></svg>;
    const CaveIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m16 26c-6.6 0-12-5.4-12-12v-6h24v6c0 6.6-5.4 12-12 12zm0-24c-7.7 0-14 6.3-14 14v8h28v-8c0-7.7-6.3-14-14-14z"/></svg>;
    const ContainerIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m29 8h-26c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h26c1.1 0 2-.9 2-2v-18c0-1.1-.9-2-2-2zm-26 2h26v18h-26zm20 4h-4v2h4zm-6 0h-4v2h4zm-6 0h-4v2h4zm12 4h-4v2h4zm-6 0h-4v2h4zm-6 0h-4v2h4z"/></svg>;
    const DomeIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m16 2c-7.7 0-14 6.3-14 14v10h28v-10c0-7.7-6.3-14-14-14zm-14 12h28v12h-28z"/></svg>;
    const WindmillIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m16 2c-.6 0-1 .4-1 1v12h-12c-.6 0-1 .4-1 1s.4 1 1 1h12v12c0 .6.4 1 1 1s1-.4 1-1v-12h12c.6 0 1-.4 1-1s-.4-1-1-1h-12v-12c0-.6-.4-1-1-1zm6 16c-3.3 0-6 2.7-6 6v6h-12c-1.1 0-2-.9-2-2v-18l8-6 6 4v16z"/></svg>;
    const TreehouseIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m16 2c-.6 0-1 .4-1 1v12h-4c-1.7 0-3 1.3-3 3v8c0 1.7 1.3 3 3 3h8c1.7 0 3-1.3 3-3v-8c0-1.7-1.3-3-3-3h-4v-12c0-.6-.4-1-1-1zm-4 15h8v8h-8z"/></svg>;
    const TentIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m16 2-14 28h28zm-11 26l11-22 11 22z"/></svg>;
    const RiadIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m16 2-14 11.2v16.8h28v-16.8zm-12 15h24v10h-24zm12-11.5l11 8.8v7.7h-22v-7.7zm2 2h-4v4h4zm-4-1h-2v-4h2zm6 0h-2v-4h2zm-2 2h-4v-2h4zm-2-1h-4v-2h4z"/></svg>;
    const TraditionalHouseIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m16 2-14 11.2v16.8h28v-16.8zm-12 15h24v10h-24zm12-11.5l11 8.8v7.7h-22v-7.7zm4 4h-8v4h8z"/></svg>;
    const TrulloIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m16 2c-5.5 0-10 4.5-10 10v18h20v-18c0-5.5-4.5-10-10-10zm0 2c4.4 0 8 3.6 8 8v16h-16v-16c0-4.4 3.6-8 8-8z"/></svg>;
    const StoneHouseIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m24 16h-16c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-10c0-1.1-.9-2-2-2zm-16 2h16v10h-16zm8-16c-5.5 0-10 4.5-10 10h20c0-5.5-4.5-10-10-10z"/></svg>;
    const ShepherdsHutIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m27 18h-22c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h22c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-22 2h22v8h-22zm10 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm24-10h-28v-4h28z"/></svg>;

    const types = [
      { id: 'house', label: 'Casa', icon: HouseIcon },
      { id: 'apartment', label: 'Departamento', icon: ApartmentIcon },
      { id: 'barn', label: 'Granero', icon: BarnIcon },
      { id: 'bed_and_breakfast', label: 'Bed and breakfast', icon: BedAndBreakfastIcon },
      { id: 'boat', label: 'Barco', icon: BoatIcon },
      { id: 'cabin', label: 'Cabaña', icon: CabinIcon },
      { id: 'rv', label: 'Casa rodante', icon: RVIcon },
      { id: 'private_home', label: 'Casa particular', icon: HouseIcon },
      { id: 'castle', label: 'Castillo', icon: CastleIcon },
      { id: 'cave', label: 'Cueva', icon: CaveIcon },
      { id: 'container', label: 'Contenedor', icon: ContainerIcon },
      { id: 'cycladic_house', label: 'Casa griega', icon: StoneHouseIcon },
      { id: 'dammuso', label: 'Dammuso', icon: StoneHouseIcon },
      { id: 'dome', label: 'Domo', icon: DomeIcon },
      { id: 'earthen_home', label: 'Casa enterrada', icon: CaveIcon },
      { id: 'farm', label: 'Granja', icon: BarnIcon },
      { id: 'guest_house', label: 'Casa de huéspedes', icon: BedAndBreakfastIcon },
      { id: 'hotel', label: 'Hotel', icon: ApartmentIcon },
      { id: 'houseboat', label: 'Casa flotante', icon: BoatIcon },
      { id: 'kezhan', label: 'Kezhan', icon: TraditionalHouseIcon },
      { id: 'minsu', label: 'Minsu', icon: TraditionalHouseIcon },
      { id: 'riad', label: 'Riad', icon: RiadIcon },
      { id: 'ryokan', label: 'Ryokan', icon: TraditionalHouseIcon },
      { id: 'shepherds_hut', label: 'Cabaña de pastor', icon: ShepherdsHutIcon },
      { id: 'tent', label: 'Tienda de campaña', icon: TentIcon },
      { id: 'tiny_home', label: 'Minicasa', icon: RVIcon },
      { id: 'tower', label: 'Torre', icon: CastleIcon },
      { id: 'treehouse', label: 'Casa del árbol', icon: TreehouseIcon },
      { id: 'trullo', label: 'Trullo', icon: TrulloIcon },
      { id: 'windmill', label: 'Molino de viento', icon: WindmillIcon },
      { id: 'yurt', label: 'Yurta', icon: DomeIcon },
    ];
    
    const handleSelection = (id) => {
      setPropertyType(id);
    };

    return (
      <div className="flex flex-col w-full max-w-2xl px-6 mx-auto pb-8 pt-1"> 
        <div className="flex-shrink-0 mb-8 text-left"> 
          <h1 className="text-4xl md:text-4xl font-extrabold text-gray-900 leading-tight"> 
            ¿Cuál de estas opciones describe mejor tu alojamiento?
          </h1>
        </div>

        <div className="w-full">
          <div className="grid grid-cols-3 gap-4"> 
            {types.map((type) => (
              <button
                key={type.id}
                onClick={() => handleSelection(type.id)}
                className={`
                  flex flex-col items-start justify-start p-4 
                  h-[100px] 
                  border-2 rounded-xl text-left transition-all
                  ${propertyType === type.id
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-900'
                  }
                  focus:outline-none focus:ring-4 focus:ring-gray-900 focus:ring-opacity-150
                `}
              >
                {type.icon({ 
                  className: "w-6 h-6 text-gray-900 mb-2",
                  strokeWidth: "1.5", 
                  fill: "none",
                  stroke: "currentColor"
                })}
                <span className="text-base font-semibold text-gray-900">{type.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // --- PASO 3: TIPO DE LUGAR ---
  const Step3PlaceType = ({ placeType, setPlaceType }) => {
    
    const EntirePlaceIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m16 3 14 11.2V29H2V14.2ZM16 5.2 4 14.8v12h10V18h4v8h10v-12.8Z"/></svg>;
    const PrivateRoomIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M28 2H4a2 2 0 00-2 2v24a2 2 0 002 2h24a2 2 0 002-2V4a2 2 0 00-2-2zM4 28V4h24v24H4zM10 10h12v8H10zM12 12v4h8v-4h-8z"/></svg>;
    const SharedRoomIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M28 10H16a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V12a2 2 0 00-2-2zM16 12h12v10H16zm-12 0h-2a2 2 0 00-2 2v10a2 2 0 002 2h2v-14zM24 14h-4v2h4zm-6 0h-4v2h4zm0 4h-4v2h4zm6 0h-4v2h4z"/></svg>;

    const types = [
      { 
        id: 'entire_place', 
        label: 'Un alojamiento entero', 
        description: 'Los huéspedes tienen toda la propiedad para ellos.',
        icon: EntirePlaceIcon 
      },
      { 
        id: 'private_room', 
        label: 'Una habitación', 
        description: 'Los huéspedes tienen su propia habitación en un alojamiento, además de acceso a espacios compartidos.', 
        icon: PrivateRoomIcon
      },
      { 
        id: 'shared_room', 
        label: 'Una habitación compartida en un hostal', 
        description: 'Los huéspedes duermen en una habitación compartida en un Hostal gestionado profesionalmente con personal disponible las 24 horas del día.', 
        icon: SharedRoomIcon
      },
    ];
    
    const handleSelection = (id) => {
      setPlaceType(id);
    };

    return (
      <div className="flex flex-col h-full w-full max-w-4xl px-8 items-center justify-center pt-16">
        <div className="flex flex-col flex-shrink-0 mb-12 w-full max-w-2xl">
          <h1 className="text-4xl font-extrabold text-gray-900 text-left">
            ¿Qué tipo de alojamiento <span className="block">ofreces a los huéspedes?</span>
          </h1>
        </div>
        
        <div className="w-full max-w-2xl space-y-4">
          {types.map((type) => (
            <button
              key={type.id}
              onClick={() => handleSelection(type.id)}
              className={`
                flex items-center justify-between p-6 w-full min-h-[120px]
                border-2 rounded-xl text-left transition-all
                ${placeType === type.id
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-900'
                }
              `}
            >
              <div className='flex-1 pr-4'>
                <span className="text-xl font-semibold text-gray-900 block mb-1">{type.label}</span>
                <p className="text-base text-gray-600">{type.description}</p>
              </div>
              
              <div className="flex-shrink-0">
                {type.icon({
                    className: "w-8 h-8 text-gray-900",
                    strokeWidth: "1.5", 
                    fill: "none",
                    stroke: "currentColor"
                })}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

// --- PASO 4: UBICACIÓN ---
  const Step4Location = ({ address, setAddress }) => {
    const PinIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M16 1a11 11 0 0 0-11 11c0 7.3 9.5 17.5 10.2 18.3l.8.7.8-.7c.7-.8 10.2-11 10.2-18.3A11 11 0 0 0 16 1zm0 15a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/></svg>;

    const handleSearchChange = (value) => {
      setAddress(value);
    };

    return (
      <div className="flex flex-col w-full max-w-4xl mx-auto px-10 pt-6 pb-8">
        {/* Título y subtítulo */}
        <div className="mb-5 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¿Dónde se encuentra tu espacio?
          </h1>
          <p className="text-sm text-gray-600">
            Solo compartiremos la dirección con los huéspedes después de que hayan hecho la reservación.
          </p>
        </div>

        {/* Mapa con barra de búsqueda */}
        <div className="relative w-full h-[380px]">
          <div className="w-full h-full bg-[#E8E4DA] rounded-2xl relative overflow-hidden">
            {/* Simulación del mapa de Google Maps */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#F5F3EE] to-[#E8E4DA]">
              {/* Líneas simulando calles */}
              <svg className="absolute inset-0 w-full h-full opacity-30">
                <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#9CA3AF" strokeWidth="2"/>
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#9CA3AF" strokeWidth="2"/>
                <line x1="0" y1="70%" x2="100%" y2="70%" stroke="#9CA3AF" strokeWidth="3"/>
                <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#9CA3AF" strokeWidth="2"/>
                <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#9CA3AF" strokeWidth="2"/>
                <line x1="70%" y1="0" x2="70%" y2="100%" stroke="#9CA3AF" strokeWidth="2"/>
              </svg>
              
              {/* Pin central */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full">
                <PinIcon className="w-10 h-10 text-[#FF385C]" />
              </div>

              {/* Marca de agua de Google Maps */}
              <div className="absolute bottom-4 left-4 bg-white px-2 py-1 rounded text-xs text-gray-600 opacity-70">
                Google
              </div>
            </div>

            {/* Barra de búsqueda flotante */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-[calc(100%-3rem)] max-w-md">
              <div className="bg-white rounded-full shadow-lg px-5 py-3 flex items-center gap-3">
                <PinIcon className="w-5 h-5 text-gray-700 flex-shrink-0" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Ingresa tu dirección"
                  className="flex-1 outline-none text-base text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

// --- PASO 5: DATOS BÁSICOS ---
const Step5BasicInfo = ({ basics, setBasics }) => {
  // Definición de los límites mínimos
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
    const minValue = item ? item.min : 0; 
    
    if (basics[field] > minValue) {
      setBasics({ ...basics, [field]: basics[field] - decrement });
    }
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-10 py-8"> 
      
      {/* Título y subtítulo con más espacio */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900 mb-4">
          Agrega algunos datos básicos de tu espacio
        </h1>
        <p className="text-base text-gray-600">
          Más adelante, podrás incluir otros detalles, como los tipos de camas.
        </p>
      </div>

      {/* Lista de contadores */}
      <div className="space-y-8">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-6 border-b border-gray-200">
            <span className="text-lg font-medium text-gray-900">{item.label}</span>
            
            <div className="flex items-center gap-4">
              {/* Botón decrementar */}
              <button
                onClick={() => handleDecrement(item.id)}
                disabled={basics[item.id] <= item.min}
                className={`w-8 h-8 rounded-full border transition-all flex items-center justify-center
                  ${basics[item.id] <= item.min
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-400 text-gray-600 hover:border-gray-900 hover:text-gray-900'
                  }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                </svg>
              </button>

              {/* Número */}
              <span className="text-lg font-normal text-gray-900 w-8 text-center">
                {item.id === 'bathrooms' ? basics[item.id].toFixed(1) : basics[item.id]}
              </span>

              {/* Botón incrementar */}
              <button
                onClick={() => handleIncrement(item.id)}
                className="w-8 h-8 rounded-full border border-gray-400 text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-all flex items-center justify-center"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
  // --- PASO 6: INTRO PASO 2 ---
  const Step6IntroStep2 = () => {
    const placeholderImageUrl = 'https://placehold.co/600x600/FFFFFF/E75B8D?text=Casa+3D+Isometrica';
    
    return (
      <div className="flex w-full max-w-[1280px] h-full items-center justify-center p-8 mx-auto">
        <div className="flex w-full max-w-6xl">
          
          {/* Columna de Texto (Izquierda) */}
          <div className="flex-1 flex flex-col justify-center pr-12 max-w-xl">
            <p className="text-lg font-semibold text-gray-900 mb-2">Paso 2</p>
            <h1 className="text-5xl lg:text-[48px] font-extrabold text-gray-900 leading-tight mb-8">
              Haz que tu espacio se destaque
            </h1>
            <p className="text-lg text-gray-600">
              En este paso, agregarás algunos de los servicios que ofrece tu alojamiento y subirás un mínimo de 5 fotos. Luego crearás un título y una descripción.
            </p>
          </div>
          
          {/* Columna de Imagen (Derecha) */}
          <div className="flex-1 flex justify-center items-center pl-12">
            <div className="w-[500px] h-[500px] bg-white rounded-xl overflow-hidden relative">
              <img 
                src={placeholderImageUrl} 
                alt="Ilustración 3D isométrica de casa"
                className="w-full h-full object-contain"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/500x500/FFFFFF/888888?text=Casa+Isometrica'; }}
              />
            </div>
          </div>
          
        </div>
      </div>
    );
  };

  // --- PASO 7: AMENIDADES ---
  const Step7Amenities = ({ amenities, setAmenities }) => {
    // Iconos para amenidades
    const WiFiIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 20a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM1.88 9.88a1 1 0 0 1 0-1.42 21.98 21.98 0 0 1 28.24 0 1 1 0 0 1 0 1.42l-1.42 1.42a1 1 0 0 1-1.38 0 18 18 0 0 0-22.64 0 1 1 0 0 1-1.38 0zm5.66 5.66a1 1 0 0 1 0-1.42 12.98 12.98 0 0 1 16.92 0 1 1 0 0 1 0 1.42l-1.42 1.42a1 1 0 0 1-1.38 0 9 9 0 0 0-11.32 0 1 1 0 0 1-1.38 0z"/></svg>;
    const TVIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M29 27V9H3v18zm0-20a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zM7 21H5v2h2zm0-4H5v2h2zm0-4H5v2h2z"/></svg>;
    const KitchenIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M26 1a5 5 0 0 1 5 5c0 6.39-1.6 13.19-4 14.7V31h-2V20.7c-2.36-1.48-4-8.31-4-14.7a5 5 0 0 1 5-5zm-9 0v18.12c2.32.55 4 3 4 5.88 0 3.27-2.18 6-5 6s-5-2.73-5-6c0-2.87 1.68-5.33 4-5.88V1zM2 1h1c4.47 0 6 6.88 6 18.5V31h-2V19.5C7 10.09 5.89 3 2.16 3H2zm14 20c-1.6 0-3 1.75-3 4s1.4 4 3 4 3-1.75 3-4-1.4-4-3-4zM26 3a3 3 0 0 0-3 3c0 5.45 1.28 11.44 3 12.87 1.72-1.43 3-7.42 3-12.87a3 3 0 0 0-3-3z"/></svg>;
    const WasherIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M26 2a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4zm0 2H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM16 7a9 9 0 1 1 0 18 9 9 0 0 1 0-18zm0 2a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/></svg>;
    const ParkingIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M26 2a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4zm0 2H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM16 8c2.7 0 5 2.3 5 5s-2.3 5-5 5h-3v6h-3V8zm0 3h-3v4h3c1.12 0 2-.88 2-2s-.88-2-2-2z"/></svg>;
    const ACIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M17 1v4.03l4.03-2.32 1 1.73L17 7.34v6.93l6-3.47V5l-4.03 2.32-1-1.73L22 3.27l4.03 2.32V12h2v5h-2v2.3l3 1.73-1 1.74-3-1.73-3 1.73-1-1.74 3-1.73V17H2v-2h22v-2H2V8h22V5.6l-6 3.47 1 1.73 3-1.73 3 1.73zm-2 23.27l1 1.73-4.03 2.32L12 30l4.03-2.32-1-1.73L11 28.27 7 25.93l1-1.73 3 1.73V19h2v6.93z"/></svg>;
    const WorkspaceIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M26 2a2 2 0 0 1 2 1.85V16h4v2h-4v12a2 2 0 0 1-1.85 2H6a2 2 0 0 1-2-1.85V4a2 2 0 0 1 1.85-2H6zm0 2H6v26h20zM16 7a9 9 0 1 1 0 18 9 9 0 0 1 0-18zm-5.84 7.5c-.48 0-.82.26-.97.62-.16.38-.06.84.23 1.24.64.91 2.02 1.64 3.58 1.64s2.94-.73 3.58-1.64c.29-.4.39-.86.23-1.24a1.04 1.04 0 0 0-.97-.62zm8.9 0c-.48 0-.82.26-.97.62-.16.38-.06.84.23 1.24.64.91 2.02 1.64 3.58 1.64.19 0 .38-.02.57-.05a8.99 8.99 0 0 1-3.4-3.45z"/></svg>;
    
    const PoolIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M28 6v2H4V6zm-2 8c.6 0 1.12.22 1.53.58.4.37.7.87.87 1.42.17.55.2 1.13.1 1.67L28 20H4l-.5-2.33c-.1-.54-.07-1.12.1-1.67.17-.55.47-1.05.87-1.42A2.34 2.34 0 0 1 6 14zm0 2c-.23 0-.4.08-.53.2-.14.13-.23.3-.27.48L25 24h2l-.2-.8c-.04-.18-.13-.35-.27-.48A.84.84 0 0 0 26 22.8zm-20 0c-.23 0-.4.08-.53.2-.14.13-.23.3-.27.48L5 24h2l-.2-.8c-.04-.18-.13-.35-.27-.48A.84.84 0 0 0 6 22.8zM4 28v-2h24v2z"/></svg>;
    const JacuzziIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M7 2v4h2V2zm4 0v6h2V2zm4 0v4h2V2zM3 10.5A2.5 2.5 0 0 1 5.5 8h21a2.5 2.5 0 0 1 2.5 2.5V12h1v2h-1v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V14H2v-2h1zm2 1.5v15h22V12zm17.83 2c.35.6.59 1.28.67 2 .09.77 0 1.54-.23 2.23-.24.68-.62 1.3-1.1 1.78A3.9 3.9 0 0 1 20 22c-.35.6-.59 1.28-.67 2-.09.77 0 1.54.23 2.23.24.68.62 1.3 1.1 1.78.48.47 1.03.83 1.62 1.04l-.56 1.9A7.2 7.2 0 0 1 19 29.5c-.84-.35-1.6-.87-2.24-1.52A7.3 7.3 0 0 1 15.23 25a7.85 7.85 0 0 1-.23-3.77c.17-1.3.65-2.51 1.38-3.54a5.9 5.9 0 0 1 2.96-2.16 5.76 5.76 0 0 1 3.5-.06l-.01.03z"/></svg>;
    const PatioIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M13 1a5 5 0 0 1 5 5v2h-2V6a3 3 0 0 0-6 0v2H8V6a5 5 0 0 1 5-5zm13 8v22h-2v-8h-6v8H8v-8H2v-8zm-2 2H8v4h16zm-15 6h4v6h-4zm6 0h4v6h-4zm6 0h4v6h-4z"/></svg>;
    const BBQIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M27 2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2v2h1v14h-2V16h-2v14h-2V16h-2v14h-2V16h-2v14h-2V16h-2v14H8V16H6v14H4V16h1v-2H3a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2H3v8h24zM7 5v2H5V5zm4 0v2H9V5zm4 0v2h-2V5z"/></svg>;
    const OutdoorDiningIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 1c2.7 0 5 2.3 5 5v2h5c1.7 0 3 1.3 3 3v3h-2v-3c0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1v3H1v-3c0-1.7 1.3-3 3-3h5V6c0-2.7 2.3-5 5-5zm0 2c-1.6 0-3 1.4-3 3v2h6V6c0-1.6-1.4-3-3-3zm-9 15h2v12h-2zm8 0h2v12h-2zm8 0h2v12h-2zm8 0h2v12h-2z"/></svg>;
    const OutdoorFireplaceIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 1c4 0 8 2 8 8v2c0 4-3 6-6 7v13h-4V18c-3-1-6-3-6-7v-2c0-6 4-8 8-8zm0 2c-2.5 0-6 1.2-6 6v2c0 2.7 2 4.3 4.5 5.2l.5.2v-4.4c-.8-1.2-1.5-2.6-1.8-4.2a8 8 0 0 1 5.6-2.3c-.6.7-1.1 1.5-1.3 2.3h-.8c-1.1 0-2 .9-2 2v1c0 1.1.9 2 2 2h2.6c1.2 0 2.5-.4 3.4-1.2l.3-.3v-.5c0-4.8-3.5-6-6-6z"/></svg>;
    
    const SmokeDetectorIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 2a14 14 0 1 1 0 28 14 14 0 0 1 0-28zm0 2a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm0 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zm0 2a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm0 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>;
    const FirstAidIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M26 2a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4zm0 2H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm-9 4v5h5v4h-5v5h-4v-5H8v-4h5V8z"/></svg>;
    const FireExtinguisherIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M20 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM14 6v2a8 8 0 0 1-6 7.75V30h8V15.75A8 8 0 0 1 10 8V6zm-2 2H8v1a6 6 0 0 0 4 5.66zm8-6v4h2v20h-2v2h8v-2h-2V6h2V4h-8z"/></svg>;
    const SecurityCameraIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M25.41 11l-4.7-4.7L28 0l4 4zM16 14a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm0 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM2 15a9 9 0 0 1 9-9h10a9 9 0 0 1 9 9v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3zm2 0v12c0 .55.45 1 1 1h22c.55 0 1-.45 1-1V15a7 7 0 0 0-7-7H11a7 7 0 0 0-7 7z"/></svg>;

    const AnimalIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M13 16a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm6 0a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM8 9a4 4 0 0 1 3.9 3.2c.5-.2 1-.2 1.6-.2 1.7 0 3.3.6 4.5 1.6 1.2-1 2.8-1.6 4.5-1.6.5 0 1.1.1 1.6.2A4 4 0 0 1 28 9a4 4 0 1 1 0 8c-.5 0-1-.1-1.4-.2-.4 2.8-2.5 5-5.1 5.6-.4 1.2-1.2 2.2-2.3 2.8-1 .6-2.2.8-3.4.6-1.2-.2-2.2-.8-3-1.8s-1.2-2.2-1-3.4c-2.6-.6-4.7-2.8-5.1-5.6A4 4 0 0 1 8 9zm0 2c-.5 0-1 .2-1.4.6-.4.3-.6.8-.6 1.4 0 1.1.9 2 2 2h.5v.5c0 2 1 3.8 2.7 4.8l.4.2h.5c.3 0 .5-.2.5-.5v-.5-.5l-.4-.2c-.8-.4-1.4-1-1.8-1.8l-.2-.4h.5c.3 0 .5 0 .8.2.2.1.4.3.6.5l.3.3h.5c.3 0 .5-.2.5-.5v-.5-.4l-.3-.3c-.8-.8-1.9-1.3-3-1.3-.5 0-1 .1-1.5.3l-.5.2V13c0-1.1.9-2 2-2s2 .9 2 2v.5h1V13c0-.5-.2-1-.6-1.4-.3-.4-.8-.6-1.4-.6z"/></svg>;
    const CarIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M26 15a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-20 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM9.5 4A6.5 6.5 0 0 1 16 10.5v.5H0v-.5A6.5 6.5 0 0 1 6.5 4zm0 2A4.5 4.5 0 0 0 5 14.5V15h2v-.5A6.5 6.5 0 0 1 13.5 8zm13 0a4.5 4.5 0 0 1 4.5 4.5v.5h-2v-.5A6.5 6.5 0 0 0 18.5 8zm-8 8h13l2.01 4.02c.3.6.49 1.3.49 2v3a2 2 0 0 1-2 2h-1v2h-2v-2H8v2H6v-2H5a2 2 0 0 1-2-2v-3c0-.7.19-1.4.49-2L5.5 16h13zm0 2H7.24l-1.5 3H28.26l-1.5-3H14.5z"/></svg>;
    const SmokeIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M27 12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2v-2h2v-8h-2v-2zm-4 0v2h-2v-2zm-4-5a3 3 0 0 1 3 3v2h-2v-2a1 1 0 0 0-1-1h-2v-2zm-8 0v2h-2v-2zm11 5a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2v-2h2v-8h-2v-2zM11 2a7 7 0 0 1 7 7v2a7 7 0 0 1-7 7H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm0 2H4v12h7a5 5 0 0 0 5-5V9a5 5 0 0 0-5-5z"/></svg>;
    const DishwasherIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M26 2a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4zm0 2H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM16 8a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM8 5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>;
    const OutdoorShowerIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 1a1 1 0 0 1 1 1v4.1a8 8 0 0 1 7 7.9v1a8 8 0 0 1-8 8 8 8 0 0 1-8-8v-1a8 8 0 0 1 7-7.9V2a1 1 0 0 1 1-1zm0 7a6 6 0 0 0-6 6v1a6 6 0 0 0 12 0v-1a6 6 0 0 0-6-6zm-5 17a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>;
    
    const GymIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M28 14v4h-2v-4zm-4 0v4h-2v-4zm-16 0v4H6v-4zM4 14v4H2v-4zm6-4a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1zm14 0a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1zm-12 1H9v8h3zm14 0h-3v8h3zm-14-5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm14 0a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM12 8H8v14h4zm14 0h-4v14h4z"/></svg>;
    const BeachAccessIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 1a15 15 0 1 1 0 30 15 15 0 0 1 0-30zm0 2a13 13 0 1 0 0 26 13 13 0 0 0 0-26zm6.36 3.05L23.78 7.5 16 15.3 8.22 7.5l1.42-1.45L16 12.4zm-1.42 2.83l1.42 1.45L16 16.7l-6.36-6.37 1.42-1.45L16 14.26zm-1.42 2.82l1.42 1.45L16 17.52l-4.94-4.94 1.42-1.45L16 15.1z"/></svg>;
    const LakeAccessIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M28 20c-1.4 0-2.4.4-3.2.8-.8.4-1.3.6-2.3.6s-1.5-.2-2.3-.6c-.8-.4-1.8-.8-3.2-.8s-2.4.4-3.2.8c-.8.4-1.3.6-2.3.6s-1.5-.2-2.3-.6c-.8-.4-1.8-.8-3.2-.8v-2c1.4 0 2.4.4 3.2.8.8.4 1.3.6 2.3.6s1.5-.2 2.3-.6c.8-.4 1.8-.8 3.2-.8s2.4.4 3.2.8c.8.4 1.3.6 2.3.6s1.5-.2 2.3-.6c.8-.4 1.8-.8 3.2-.8v2zm0 4c-1.4 0-2.4.4-3.2.8-.8.4-1.3.6-2.3.6s-1.5-.2-2.3-.6c-.8-.4-1.8-.8-3.2-.8s-2.4.4-3.2.8c-.8.4-1.3.6-2.3.6s-1.5-.2-2.3-.6c-.8-.4-1.8-.8-3.2-.8v-2c1.4 0 2.4.4 3.2.8.8.4 1.3.6 2.3.6s1.5-.2 2.3-.6c.8-.4 1.8-.8 3.2-.8s2.4.4 3.2.8c.8.4 1.3.6 2.3.6s1.5-.2 2.3-.6c.8-.4 1.8-.8 3.2-.8v2zM16 2l8 8-8 8-8-8 8-8zm0 2.83L10.83 10 16 15.17 21.17 10 16 4.83z"/></svg>;
    const HighChairIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M21 4a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM11 15v2H8v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V17h-3v-2h5v12a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5V15h5z"/></svg>;
    const FireplaceIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 1c4 0 8 2 8 8v2c0 4-3 6-6 7v13h-4V18c-3-1-6-3-6-7V9c0-6 4-8 8-8zm0 2c-2.5 0-6 1.2-6 6v2c0 2.7 2 4.3 4.5 5.2l.5.2v-4.4c-.8-1.2-1.5-2.6-1.8-4.2a8 8 0 0 1 5.6-2.3c-.6.7-1.1 1.5-1.3 2.3h-.8c-1.1 0-2 .9-2 2v1c0 1.1.9 2 2 2h2.6c1.2 0 2.5-.4 3.4-1.2l.3-.3v-.5c0-4.8-3.5-6-6-6zM28 24v6H4v-6h2v4h20v-4h2z"/></svg>;
    const TVStreamingIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M29 4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM29 6H3v14h26V6zM6 25a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>;
    const SoundSystemIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M28 2a2 2 0 0 1 2 2v24a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2H4v24h24V4zm-12 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm0 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm0 12a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>;
    
    const CoffeeIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M26 10h2a4 4 0 0 1 0 8h-2v2a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V10a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2zm0 2v4h2a2 2 0 0 0 0-4zM8 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8zM4 26v2h24v-2zM11 2v4H9V2zm4 0v4h-2V2zm4 0v4h-2V2z"/></svg>;
    const MicrowaveIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M29 6a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm0 2H3v16h26V8zm-5 2v2h-2v-2zm0 4v2h-2v-2zm0 4v2h-2v-2zm-4-8v8H4v-8z"/></svg>;
    const RefrigeratorIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M25 2a2 2 0 0 1 2 2v24a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2H7v24h18V4zm-3 17v5h-2v-5zm0-17v8h-2V4z"/></svg>;
    const WineGlassesIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M17 2v6.1A8 8 0 0 1 24 16v1a8 8 0 0 1-7 7.9V29h4v2H11v-2h4v-4.1A8 8 0 0 1 8 17v-1a8 8 0 0 1 7-7.9V2h2zm0 8a6 6 0 0 0-6 6v1a6 6 0 0 0 12 0v-1a6 6 0 0 0-6-6z"/></svg>;
    const ToasterIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M28 6a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm0 2H4v16h24V8zm-4 2v12H8V10zm-2 2H10v8h12z"/></svg>;
    const BlenderIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M21 2v4h5v2h-5v8a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6V8H0V6h3V2h18zm-2 2h-14v4h14zm-4 8a4 4 0 0 0 4 4h6v-8H15z m1 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-8 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm4 5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>;
    const BakingSheetIcon = (props) => <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M30 8v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2zm-2 0H4v16h24V8zM8 12a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm8 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm8 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/></svg>;

    const amenitiesList = [
      {
        title: 'Existen los servicios preferidos por los huéspedes. ¿Los tienes?',
        items: [
          { id: 'wifi', label: 'Wifi', icon: WiFiIcon },
          { id: 'tv', label: 'TV', icon: TVIcon },
          { id: 'kitchen', label: 'Cocina', icon: KitchenIcon },
          { id: 'washer', label: 'Lavadora', icon: WasherIcon },
          { id: 'parking', label: 'Estacionamiento gratuito en las instalaciones', icon: ParkingIcon },
          { id: 'ac', label: 'Aire acondicionado', icon: ACIcon },
          { id: 'workspace', label: 'Área para trabajar', icon: WorkspaceIcon },
        ]
      },
      {
        title: '¿Ofreces algún servicio especial?',
        items: [
          { id: 'pool', label: 'Alberca', icon: PoolIcon },
          { id: 'jacuzzi', label: 'Jacuzzi', icon: JacuzziIcon },
          { id: 'patio', label: 'Patio', icon: PatioIcon },
          { id: 'bbq', label: 'Parrilla para BBQ', icon: BBQIcon },
          { id: 'outdoor_dining', label: 'Área para comer al aire libre', icon: OutdoorDiningIcon },
          { id: 'outdoor_fireplace', label: 'Chimenea exterior', icon: OutdoorFireplaceIcon },
        ]
      },
      {
        title: '¿Cuentas con alguno de estos artículos administrativos de seguridad?',
        items: [
          { id: 'smoke_detector', label: 'Detector de humo', icon: SmokeDetectorIcon },
          { id: 'first_aid', label: 'Botiquín', icon: FirstAidIcon },
          { id: 'fire_extinguisher', label: 'Extintor de incendios', icon: FireExtinguisherIcon },
          { id: 'security_camera', label: 'Cámara de seguridad exterior', icon: SecurityCameraIcon },
        ]
      }
    ];

    const toggleAmenity = (id) => {
      if (amenities.includes(id)) {
        setAmenities(amenities.filter(a => a !== id));
      } else {
        setAmenities([...amenities, id]);
      }
    };

    return (
      <div className="flex flex-col w-full max-w-3xl mx-auto px-8 py-12">
        {/* Título principal */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Cuéntale a los huéspedes todo lo que tu espacio tiene para ofrecer
          </h1>
          <p className="text-base text-gray-600">
            Puedes agregar servicios adicionales después de publicar tu anuncio.
          </p>
        </div>

        {/* Secciones de amenidades */}
        <div className="space-y-12">
          {amenitiesList.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {/* Título de sección */}
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                {section.title}
              </h2>

              {/* Grid de amenidades */}
              <div className="grid grid-cols-3 gap-4">
                {section.items.map((amenity) => (
                  <button
                    key={amenity.id}
                    onClick={() => toggleAmenity(amenity.id)}
                    className={`
                      flex flex-col items-start justify-start p-5
                      h-[100px]
                      border-2 rounded-xl text-left transition-all
                      ${amenities.includes(amenity.id)
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-900'
                      }
                    `}
                  >
                    {amenity.icon({
                      className: "w-6 h-6 text-gray-900 mb-2"
                    })}
                    <span className="text-sm font-medium text-gray-900 leading-tight">
                      {amenity.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Divisor entre secciones */}
              {sectionIndex < amenitiesList.length - 1 && (
                <div className="mt-8 border-b border-gray-200"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

// --- PASO 8: AGREGAR FOTOS ---
const Step8Photos = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Modal para subir fotos
  const UploadPhotosModal = ({ onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-11/12 max-w-2xl">
          
          {/* Header del modal */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Sube las fotos</h2>
            <p className="text-gray-600 mt-1">No seleccionaste ningún elemento.</p>
          </div>

          {/* Área de drag and drop */}
          <div className="p-8">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-gray-400 transition-colors">
              <p className="text-lg font-semibold text-gray-700 mb-2">Arrastra y suelta</p>
              <p className="text-gray-600 mb-4">o busca fotos</p>
              <button className="bg-gray-900 text-white py-3 px-6 rounded-lg text-base font-semibold hover:bg-black transition">
                Explorar
              </button>
            </div>
          </div>

          {/* Footer del modal */}
          <div className="p-6 border-t border-gray-200 flex justify-between items-center">
            <button
              onClick={onClose}
              className="text-gray-900 text-base py-3 px-6 font-semibold hover:bg-gray-100 rounded-lg transition"
            >
              Listo
            </button>
            
            <button
              onClick={onClose}
              className="bg-[#222222] text-white py-3 px-6 rounded-lg text-base font-semibold shadow-md hover:bg-black transition"
            >
              Subir
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-6 py-8">
      
      {/* Título principal - Centrado */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Agrega algunas fotos de tu alojamiento de la categoría minicasa
        </h1>
        <p className="text-base text-gray-600">
          Para empezar, necesitarás 5 fotos. Después podrás agregar más o hacer cambios.
        </p>
      </div>

      {/* Recuadro con línea punteada y botón */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-24 text-center hover:border-gray-400 transition-colors">
        <button 
          onClick={() => setShowUploadModal(true)}
          className="bg-gray-900 text-white py-4 px-8 rounded-lg text-base font-semibold hover:bg-black transition"
        >
          Agrega fotos
        </button>
      </div>

      {/* Modal para subir fotos */}
      {showUploadModal && <UploadPhotosModal onClose={() => setShowUploadModal(false)} />}

    </div>
  );
};

// --- PASO 9: TÍTULO DEL ALOJAMIENTO ---
const Step9Title = ({ title, setTitle }) => {
  const maxLength = 50;
  const currentLength = title ? title.length : 0;

  const handleTitleChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setTitle(value);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-6 py-8">
      
      {/* Título principal */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Ponle un título a tu alojamiento de la categoría minicasa
        </h1>
        <p className="text-base text-gray-600">
          Los títulos cortos funcionan mejor. No te preocupes, siempre puedes cambiarlo más tarde.
        </p>
      </div>

      {/* Área del input del título */}
      <div className="relative">
        <textarea
          value={title}
          onChange={handleTitleChange}
          placeholder=""
          className="w-full min-h-[200px] p-6 text-lg font-normal text-gray-900 placeholder-gray-400 border border-gray-300 rounded-xl resize-none focus:outline-none focus:border-gray-900 focus:ring-0"
          rows="6"
        />
        
        {/* Contador de caracteres */}
        <div className="absolute bottom-6 right-6 text-sm text-gray-500 font-normal">
          {currentLength}/{maxLength}
        </div>
      </div>

    </div>
  );
};

// --- PASO 10: DESCRIPCIÓN DEL ALOJAMIENTO ---
const Step10Description = ({ description, setDescription }) => {
  const maxLength = 500;
  const currentLength = description ? description.length : 0;

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setDescription(value);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-6 py-8">
      
      {/* Título principal */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Crea tu descripción
        </h1>
        <p className="text-base text-gray-600">
          Explica qué hace que tu alojamiento sea especial.
        </p>
      </div>

      {/* Área del textarea de descripción */}
      <div className="relative mb-4">
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          placeholder=""
          className="w-full min-h-[240px] p-6 text-lg font-normal text-gray-900 placeholder-gray-400 border border-gray-300 rounded-xl resize-none focus:outline-none focus:border-gray-900 focus:ring-0"
          rows="8"
        />
      </div>

      {/* Contador de caracteres */}
      <div className="text-sm text-gray-600 font-normal">
        {currentLength}/{maxLength}
      </div>

    </div>
  );
};

// --- PASO 11: INTRODUCCIÓN PASO 3 ---
const Step11IntroStep3 = () => {
  const placeholderImageUrl = 'https://placehold.co/600x600/FFFFFF/E75B8D?text=Ilustracion+Casa+3D';
  
  return (
    <div className="flex w-full max-w-[1280px] h-full items-center justify-center p-8 mx-auto">
      <div className="flex w-full max-w-6xl">
        
        <div className="flex-1 flex flex-col justify-center pr-12 max-w-xl">
          <p className="text-lg font-semibold text-gray-900 mb-2">Paso 3</p>
          <h1 className="text-5xl lg:text-[48px] font-extrabold text-gray-900 leading-tight mb-8">
            Terminar y publicar
          </h1>
          <p className="text-lg text-gray-600">
            Por último, tendrás que definir tus preferencias en las reservaciones, establecer los precios y publicar el anuncio.
          </p>
        </div>
        
        <div className="flex-1 flex justify-center items-center pl-12">
          <div className="w-[500px] h-[500px] bg-white rounded-xl shadow-xl overflow-hidden relative">
            <img 
              src={placeholderImageUrl} 
              alt="Ilustración 3D de casa moderna"
              className="w-full h-full object-contain p-8"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x600/FFFFFF/888888?text=Ilustracion+3D'; }}
            />
          </div>
        </div>
        
      </div>
    </div>
  );
};

// --- PASO 12: PREFERENCIAS DE RESERVACIÓN ---
const Step12BookingPreference = ({ bookingPreference, setBookingPreference }) => {
  
  // Icono de calendario con check
  const CalendarCheckIcon = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M38 6H34V4H32V6H16V4H14V6H10C8.9 6 8 6.9 8 8V40C8 41.1 8.9 42 10 42H38C39.1 42 40 41.1 40 40V8C40 6.9 39.1 6 38 6ZM38 40H10V16H38V40ZM10 14V8H14V10H16V8H32V10H34V8H38V14H10Z" fill="currentColor"/>
      <path d="M21 28L19 26L17 28L21 32L29 24L27 22L21 28Z" fill="currentColor"/>
    </svg>
  );

  // Icono de rayo
  const LightningIcon = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M27 4L15 26H24L21 44L33 22H24L27 4Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-6 py-8">
      
      {/* Título principal */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Elige tus preferencias para las reservaciones
        </h1>
        <p className="text-base text-gray-600">
          Puedes modificar esto en cualquier momento.{' '}
          <a href="#" className="underline text-gray-900 hover:text-gray-700">
            Más información
          </a>
        </p>
      </div>

      {/* Opciones de reservación */}
      <div className="space-y-4">
        
        {/* Opción 1: Aprobar primeras 5 reservaciones */}
        <button
          onClick={() => setBookingPreference('approve_first')}
          className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
            bookingPreference === 'approve_first'
              ? 'border-gray-900 bg-white'
              : 'border-gray-200 bg-white hover:border-gray-400'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Aprueba tus 5 primeras reservaciones
                </h3>
                <span className="bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded">
                  Recomendado
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Para empezar, revisa las solicitudes de reservación y luego cambia a Reservación inmediata para que los huéspedes puedan reservar automáticamente.
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 text-gray-900">
              <CalendarCheckIcon />
            </div>
          </div>
        </button>

        {/* Opción 2: Reservación inmediata */}
        <button
          onClick={() => setBookingPreference('instant_book')}
          className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
            bookingPreference === 'instant_book'
              ? 'border-gray-900 bg-white'
              : 'border-gray-200 bg-white hover:border-gray-400'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Utiliza la Reservación inmediata
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Deja que los huéspedes hagan reservaciones automáticas.
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 text-gray-900">
              <LightningIcon />
            </div>
          </div>
        </button>

      </div>

    </div>
  );
};

// --- PASO 13: PREFERENCIA DE HUÉSPEDES ---
const Step13GuestPreference = ({ guestPreference, setGuestPreference }) => {
  
  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-6 py-8">
      
      {/* Título principal */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Elige a quién quieres recibir en tu primera reservación
        </h1>
        <p className="text-base text-gray-600">
          Después de tu primer huésped, cualquiera va a poder reservar tu alojamiento.{' '}
          <a href="#" className="underline text-gray-900 hover:text-gray-700">
            Más información
          </a>
        </p>
      </div>

      {/* Opciones de huéspedes */}
      <div className="space-y-4">
        
        {/* Opción 1: Cualquier huésped */}
        <button
          onClick={() => setGuestPreference('any_guest')}
          className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
            guestPreference === 'any_guest'
              ? 'border-gray-900 bg-white'
              : 'border-gray-200 bg-white hover:border-gray-400'
          }`}
        >
          <div className="flex items-start gap-4">
            {/* Radio button */}
            <div className="flex-shrink-0 mt-1">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                guestPreference === 'any_guest'
                  ? 'border-gray-900'
                  : 'border-gray-400'
              }`}>
                {guestPreference === 'any_guest' && (
                  <div className="w-3 h-3 rounded-full bg-gray-900"></div>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                Cualquier huésped en Airbnb
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Para recibir reservaciones más pronto, admite a cualquier miembro de la comunidad de Airbnb.
              </p>
            </div>
          </div>
        </button>

        {/* Opción 2: Huésped con experiencia */}
        <button
          onClick={() => setGuestPreference('experienced_guest')}
          className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
            guestPreference === 'experienced_guest'
              ? 'border-gray-900 bg-white'
              : 'border-gray-200 bg-white hover:border-gray-400'
          }`}
        >
          <div className="flex items-start gap-4">
            {/* Radio button */}
            <div className="flex-shrink-0 mt-1">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                guestPreference === 'experienced_guest'
                  ? 'border-gray-900'
                  : 'border-gray-400'
              }`}>
                {guestPreference === 'experienced_guest' && (
                  <div className="w-3 h-3 rounded-full bg-gray-900"></div>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                Un huésped que lleve tiempo en la plataforma
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                En tu primera reservación, recibe a una persona que tenga buenas evaluaciones y que te podrá dar consejos para mejorar como anfitrión.
              </p>
            </div>
          </div>
        </button>

      </div>

    </div>
  );
};

// --- PASO 14: CONFIGURAR PRECIO ---
const Step14Price = ({ price, setPrice }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(price.toString());
  const [showPriceInfoModal, setShowPriceInfoModal] = useState(false);
  
  // Calcular precio con impuestos (aproximadamente 14% más)
  const priceWithTaxes = Math.round(price * 1.14);
  
  const handlePriceClick = () => {
    setIsEditing(true);
  };
  
  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(value);
  };
  
  const handleInputBlur = () => {
    const numValue = parseInt(inputValue) || 387;
    setPrice(numValue);
    setInputValue(numValue.toString());
    setIsEditing(false);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  // Modal de información de precios
  const PriceInfoModal = ({ onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
          
          {/* Header del modal */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-base font-semibold text-gray-900">
              Más información sobre los precios
            </h2>
            <div className="w-8"></div> {/* Espaciador para centrar el título */}
          </div>

          {/* Contenido del modal */}
          <div className="px-6 py-6 overflow-y-auto">
            
            {/* Párrafo introductorio */}
            <p className="text-sm text-gray-700 mb-6 leading-relaxed">
              Tú eliges el precio y puedes cambiarlo cuando quieras. No podemos garantizarte que vayas a recibir reservaciones.
            </p>

            {/* Sección: Precio por noche */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Precio por noche
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                El precio que te recomendamos se basa en factores como la ubicación y las amenidades de tu alojamiento, la demanda de los huéspedes y otros anuncios similares.
              </p>
            </div>

            {/* Sección: Información del precio para el huésped */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Información del precio para el huésped
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Cuando estableces un precio y se muestra al desglose, la tarifa de servicio para huéspedes y los impuestos correspondientes aplicados pueden variar en función de los detalles de la reservación (como la duración de la estancia o el número de viajeros).
              </p>
            </div>

            {/* Sección: Comparar anuncios similares */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Comparar anuncios similares
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Para determinar qué anuncios son similares al tuyo, tomamos en cuenta ciertas variables, como la ubicación, el tipo de alojamiento, el número de habitaciones, las amenidades clave, los requisitos establecidos, las calificaciones y los anuncios que suelen consultar los huéspedes además del tuyo. Además, evitamos incluir alojamientos que no tengan mucha actividad. Por ejemplo, nunca te mostraremos un anuncio que no se haya reservado durante el último año o que no tenga disponibilidad. El precio promedio por noche se muestra tanto para los que están reservados como para los que están disponibles. Cuando eliges un rango de fechas, un alojamiento puede aparecer en el mapa como reservado y sin precio, y solo tiene algunas noches que no están disponibles.
              </p>
            </div>

          </div>

        </div>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-6 py-8 items-center">
      
      {/* Título principal */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Configura un precio base para los días entre semana
        </h1>
        <p className="text-base text-gray-600">
          Sugerencia: ${price} Luego establecerás uno para el fin de semana.
        </p>
      </div>

      {/* Precio grande y editable */}
      <div className="mb-8 flex items-center justify-center">
        {isEditing ? (
          <div className="flex items-center">
            <span className="text-8xl font-bold text-gray-900">$</span>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyPress={handleKeyPress}
              autoFocus
              className="text-8xl font-bold text-gray-900 border-b-4 border-gray-900 outline-none bg-transparent text-center w-64"
            />
          </div>
        ) : (
          <button
            onClick={handlePriceClick}
            className="text-8xl font-bold text-gray-900 hover:text-gray-700 transition cursor-text border-b-4 border-transparent hover:border-gray-300"
          >
            ${price}
          </button>
        )}
      </div>

      {/* Precio para el huésped */}
      <div className="mb-12">
        <button className="flex items-center gap-2 text-base text-gray-700 hover:text-gray-900">
          <span>Precio para el huésped (sin impuestos): ${priceWithTaxes} MXN</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Botón ver anuncios similares */}
      <div className="mb-6">
        <button className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-900 rounded-full text-sm font-semibold text-gray-900 hover:bg-gray-50 transition">
          <svg className="w-5 h-5 text-[#FF385C]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          Ver anuncios similares
        </button>
      </div>

      {/* Enlace más información */}
      <div>
        <button 
          onClick={() => setShowPriceInfoModal(true)}
          className="text-sm text-gray-700 underline hover:text-gray-900"
        >
          Más información sobre los precios
        </button>
      </div>

      {/* Modal de información */}
      {showPriceInfoModal && <PriceInfoModal onClose={() => setShowPriceInfoModal(false)} />}

    </div>
  );
};

// --- PASO 15: PRECIO FIN DE SEMANA ---
const Step15WeekendPrice = ({ price, weekendPricePercentage, setWeekendPricePercentage }) => {
  const [inputValue, setInputValue] = useState(weekendPricePercentage.toString());
  
  // Calcular precio del fin de semana con el suplemento
  const weekendPrice = Math.round(price * (1 + weekendPricePercentage / 100));
  
  // Calcular precio con impuestos (aproximadamente 14% más)
  const priceWithTaxes = Math.round(weekendPrice * 1.14);
  
  const handleInputChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    let numValue = parseInt(value) || 0;
    
    // Limitar entre 0 y 99
    if (numValue > 99) numValue = 99;
    
    setInputValue(numValue.toString());
    setWeekendPricePercentage(numValue);
  };
  
  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value);
    setInputValue(value.toString());
    setWeekendPricePercentage(value);
  };
  
  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-6 py-8 items-center">
      
      {/* Estilos para el slider */}
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #222222;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.2);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #222222;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.2);
        }
        
        input[type="range"]::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 3px;
        }
        
        input[type="range"]::-moz-range-track {
          height: 6px;
          border-radius: 3px;
        }
      `}</style>
      
      {/* Título principal */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Establece un precio para el fin de semana
        </h1>
        <p className="text-base text-gray-600">
          Agrega un suplemento para los viernes y los sábados.
        </p>
      </div>

      {/* Precio grande que cambia con el slider */}
      <div className="mb-8 flex items-center justify-center">
        <div className="text-7xl font-bold text-gray-900">
          $ {weekendPrice} MXN
        </div>
      </div>

      {/* Precio para el huésped */}
      <div className="mb-16">
        <button className="flex items-center gap-2 text-base text-gray-700 hover:text-gray-900">
          <span>Precio para el huésped (sin impuestos): ${priceWithTaxes} MXN</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Suplemento de fin de semana */}
      <div className="w-full max-w-xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Suplemento de fin de semana
            </h3>
            <p className="text-sm text-gray-600">
              Sugerencia: intenta con un 6%.
            </p>
          </div>
          
          {/* Input de porcentaje */}
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              className="w-16 text-right text-lg font-normal text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-900"
            />
            <span className="text-lg text-gray-900">%</span>
          </div>
        </div>

        {/* Slider */}
        <div className="relative w-full">
          <input
            type="range"
            min="0"
            max="99"
            value={weekendPricePercentage}
            onChange={handleSliderChange}
            className="w-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #222222 0%, #222222 ${weekendPricePercentage}%, #E5E7EB ${weekendPricePercentage}%, #E5E7EB 100%)`,
              height: '6px',
              borderRadius: '3px'
            }}
          />
          
          {/* Etiquetas del slider */}
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-600">0%</span>
            <span className="text-xs text-gray-600">99%</span>
          </div>
        </div>
      </div>

    </div>
  );
};

// --- PASO 16: AGREGAR DESCUENTOS ---
const Step16Discounts = ({ discounts, setDiscounts }) => {
  
  const discountOptions = [
    {
      id: 'new_listing',
      percentage: '20%',
      title: 'Promoción para anuncio nuevo',
      description: 'Ofrece un 20% de descuento en tus primeras 3 reservaciones'
    },
    {
      id: 'last_minute',
      percentage: '18%',
      title: 'Descuento de último minuto',
      description: 'Para las estancias reservadas con 14 días de anticipación o menos'
    },
    {
      id: 'weekly',
      percentage: '10%',
      title: 'Descuento por semana',
      description: 'Para estancias de 7 noches o más'
    },
    {
      id: 'monthly',
      percentage: '25%',
      title: 'Descuento mensual',
      description: 'Para estancias de 28 noches o más'
    }
  ];

  const toggleDiscount = (discountId) => {
    if (discounts.includes(discountId)) {
      setDiscounts(discounts.filter(id => id !== discountId));
    } else {
      setDiscounts([...discounts, discountId]);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-6 py-8">
      
      {/* Título principal */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Agregar descuentos
        </h1>
        <p className="text-base text-gray-600">
          Destaca tu alojamiento para conseguir reservaciones más rápido y obtener tus primeras evaluaciones.
        </p>
      </div>

      {/* Opciones de descuento */}
      <div className="space-y-4 mb-6">
        {discountOptions.map((option) => {
          const isSelected = discounts.includes(option.id);
          
          return (
            <button
              key={option.id}
              onClick={() => toggleDiscount(option.id)}
              className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 bg-white hover:border-gray-400'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Porcentaje */}
                  <div className="flex-shrink-0">
                    <span className={`text-3xl font-bold ${
                      isSelected ? 'text-gray-900' : 'text-gray-300'
                    }`}>
                      {option.percentage}
                    </span>
                  </div>
                  
                  {/* Texto */}
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      {option.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {option.description}
                    </p>
                  </div>
                </div>

                {/* Checkbox */}
                <div className="flex-shrink-0 ml-4">
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-gray-900 border-gray-900'
                      : 'bg-white border-gray-400'
                  }`}>
                    {isSelected && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Nota final */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Solo se aplicará un descuento por estancia.{' '}
          <a href="#" className="underline text-gray-900 hover:text-gray-700">
            Más información
          </a>
        </p>
      </div>

    </div>
  );
};

// --- MODAL DE CÁMARAS DE SEGURIDAD ---
const CameraInfoModal = ({ onClose, onContinue, cameraDescription, setCameraDescription }) => {
  const maxLength = 300;
  const remainingChars = maxLength - cameraDescription.length;
  
  const handleCameraDescriptionChange = useCallback((e) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setCameraDescription(value);
    }
  }, [setCameraDescription, maxLength]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header del modal */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition -ml-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido del modal */}
        <div className="px-6 py-6 overflow-y-auto flex-1">
          
          {/* Título */}
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Informa a los huéspedes sobre las cámaras de seguridad exteriores
          </h2>
          
          {/* Subtítulo */}
          <p className="text-sm text-gray-600 mb-6">
            Describe la zona que graba cada cámara, como el patio o la alberca.{' '}
            <a href="#" className="underline text-gray-900 hover:text-gray-700">
              Más información
            </a>
          </p>

          {/* Textarea */}
          <div className="mb-2">
            <textarea
              value={cameraDescription}
              onChange={handleCameraDescriptionChange}
              placeholder=""
              className="w-full min-h-[120px] p-4 text-base font-normal text-gray-900 placeholder-gray-400 border border-gray-300 rounded-xl resize-none focus:outline-none focus:border-gray-900 focus:ring-0"
              rows="5"
              autoFocus
            />
          </div>

          {/* Contador de caracteres */}
          <div className="text-right text-sm text-gray-600 mb-6">
            {remainingChars} caracteres disponibles
          </div>

        </div>

        {/* Footer del modal */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onContinue}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg text-base font-semibold hover:bg-black transition"
          >
            Continuar
          </button>
        </div>

      </div>
    </div>
  );
};

// --- PASO 17: DATOS DE SEGURIDAD ---
const Step17Safety = ({ safetyItems, setSafetyItems, cameraDescription, setCameraDescription }) => {
  const [showCameraModal, setShowCameraModal] = useState(false);
  
  const safetyOptions = [
    {
      id: 'carbon_monoxide',
      title: 'Detector de monóxido de carbono',
      description: 'Los anfitriones con alojamientos en México deben instalar un detector o se retendrá un monto de su cobro.'
    },
    {
      id: 'security_camera',
      title: 'Hay una cámara de seguridad exterior',
      description: null
    },
    {
      id: 'decibel_monitor',
      title: 'Monitor de decibelios presente',
      description: null
    },
    {
      id: 'weapons',
      title: 'Presencia de armas en la propiedad',
      description: null
    }
  ];

  const toggleSafetyItem = useCallback((itemId) => {
    if (itemId === 'security_camera') {
      if (!safetyItems.includes(itemId)) {
        // Si se está activando, mostrar el modal
        setShowCameraModal(true);
      } else {
        // Si se está desactivando, remover del array y limpiar descripción
        setSafetyItems(safetyItems.filter(id => id !== itemId));
        setCameraDescription('');
      }
    } else {
      // Para otros items, toggle normal
      if (safetyItems.includes(itemId)) {
        setSafetyItems(safetyItems.filter(id => id !== itemId));
      } else {
        setSafetyItems([...safetyItems, itemId]);
      }
    }
  }, [safetyItems, setSafetyItems, setCameraDescription]);

  const handleCameraModalContinue = useCallback(() => {
    // Solo marcar el checkbox si hay descripción
    if (cameraDescription.trim()) {
      if (!safetyItems.includes('security_camera')) {
        setSafetyItems([...safetyItems, 'security_camera']);
      }
      setShowCameraModal(false);
    } else {
      // Si no hay descripción, asegurar que no esté marcado
      setSafetyItems(safetyItems.filter(id => id !== 'security_camera'));
    }
  }, [cameraDescription, safetyItems, setSafetyItems]);

  const handleCameraModalClose = useCallback(() => {
    setShowCameraModal(false);
    // Si no hay descripción, asegurar que no esté marcado
    if (!cameraDescription.trim()) {
      setSafetyItems(safetyItems.filter(id => id !== 'security_camera'));
    }
  }, [cameraDescription, safetyItems, setSafetyItems]);

  const handleEditCamera = useCallback(() => {
    setShowCameraModal(true);
  }, []);

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-6 py-8">
      
      {/* Título principal */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Comparte los datos de seguridad
        </h1>
        
        {/* Pregunta con ícono de información */}
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-base font-semibold text-gray-900">
            ¿Tu alojamiento tiene alguno de estos?
          </h2>
          <button className="text-gray-600 hover:text-gray-900">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </button>
        </div>

        {/* Opciones de seguridad */}
        <div className="space-y-4 mb-12">
          {safetyOptions.map((option) => {
            const isChecked = safetyItems.includes(option.id);
            const isCamera = option.id === 'security_camera';
            
            return (
              <div key={option.id}>
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleSafetyItem(option.id)}
                    className="flex-shrink-0 mt-1"
                  >
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                      isChecked
                        ? 'bg-gray-900 border-gray-900'
                        : 'bg-white border-gray-400'
                    }`}>
                      {isChecked && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                  
                  {/* Texto */}
                  <button
                    onClick={() => toggleSafetyItem(option.id)}
                    className="flex-1 text-left"
                  >
                    <div className="text-base text-gray-900 mb-1">
                      {option.title}
                    </div>
                    {option.description && (
                      <div className="text-sm text-gray-600">
                        {option.description}
                      </div>
                    )}
                  </button>
                </div>

                {/* Mostrar descripción de cámara si está marcado y hay descripción */}
                {isCamera && isChecked && cameraDescription && (
                  <div className="ml-10 mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-700 mb-3">
                      {cameraDescription}
                    </p>
                    <button
                      onClick={handleEditCamera}
                      className="text-sm font-semibold text-gray-900 px-4 py-2 border border-gray-900 rounded-lg hover:bg-gray-100 transition"
                    >
                      Editar
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Separador */}
      <div className="border-t border-gray-200 my-8"></div>

      {/* Nota legal */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Debes tener en cuenta lo siguiente
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          No puede haber cámaras de seguridad que monitoreen los interiores del alojamiento, aunque estén apagadas. Debes informar la presencia de todas las cámaras de seguridad que haya en los exteriores de tu espacio.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          Asegúrate de que cumples con la{' '}
          <a href="#" className="underline text-gray-900 hover:text-gray-700">
            legislación local
          </a>
          {' '}y de revisar la{' '}
          <a href="#" className="underline text-gray-900 hover:text-gray-700">
            Política contra la Discriminación
          </a>
          , así como la relativa a las{' '}
          <a href="#" className="underline text-gray-900 hover:text-gray-700">
            tarifas para anfitriones y huéspedes
          </a>
          .
        </p>
      </div>

      {/* Modal de cámaras */}
      {showCameraModal && (
        <CameraInfoModal 
          onClose={handleCameraModalClose}
          onContinue={handleCameraModalContinue}
          cameraDescription={cameraDescription}
          setCameraDescription={setCameraDescription}
        />
      )}

    </div>
  );
};

  // Esta función se llama al cerrar el modal
  const handleModalClose = (isHost) => {
    setShowIntroModal(false);
    setIsSuperHost(isHost);
  };

  // Función de navegación para el footer
  const nextStep = () => {
    // Validaciones
    if (currentStep === 2 && !propertyData.propertyType) {
      console.error("Por favor, selecciona un tipo de propiedad antes de continuar.");
      return;
    }
    if (currentStep === 3 && !propertyData.placeType) {
      console.error("Por favor, selecciona un tipo de lugar antes de continuar.");
      return;
    }
    if (currentStep === 4 && !propertyData.address) {
      console.error("Por favor, ingresa una dirección antes de continuar.");
      return;
    }
    
    // Si estamos en el paso 17 (último paso), crear el anuncio
    if (currentStep === 17) {
      console.log("¡Anuncio creado! Datos recopilados:", propertyData);
      // Aquí puedes hacer una llamada a la API para guardar los datos
      // navigate('/success'); // Redirigir a página de éxito
      alert("¡Felicidades! Tu anuncio ha sido creado exitosamente.");
      return;
    }
    
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep === 1) {
      navigate('/anuncio-alojamiento'); 
    } else {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  // Renderiza el contenido del paso actual
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1Intro />;
      case 2:
        return (
          <Step2PropertyType 
            propertyType={propertyData.propertyType}
            setPropertyType={(type) => updatePropertyData({ propertyType: type })}
          />
        );
      case 3:
        return (
          <Step3PlaceType 
            placeType={propertyData.placeType}
            setPlaceType={(type) => updatePropertyData({ placeType: type })}
          />
        );
      case 4:
        return (
          <Step4Location
            address={propertyData.address}
            setAddress={(addr) => updatePropertyData({ address: addr })}
          />
        );
      case 5:
        return (
          <Step5BasicInfo
            basics={propertyData.basics}
            setBasics={updateBasics}
          />
        );
      case 6:
        return <Step6IntroStep2 />;
      case 7:
        return (
          <Step7Amenities
            amenities={propertyData.amenities}
            setAmenities={updateAmenities}
          />
        );
      case 8:
        return <Step8Photos />;
      case 9:
        return (
          <Step9Title
            title={propertyData.title}
            setTitle={(title) => updatePropertyData({ title })}
          />
        );
      case 10:
        return (
          <Step10Description
            description={propertyData.description}
            setDescription={(description) => updatePropertyData({ description })}
          />
        );
      case 11:
        return <Step11IntroStep3 />;
      case 12:
        return (
          <Step12BookingPreference
            bookingPreference={propertyData.bookingPreference}
            setBookingPreference={(preference) => updatePropertyData({ bookingPreference: preference })}
          />
        );
      case 13:
        return (
          <Step13GuestPreference
            guestPreference={propertyData.guestPreference}
            setGuestPreference={(preference) => updatePropertyData({ guestPreference: preference })}
          />
        );
      case 14:
        return (
          <Step14Price
            price={propertyData.price}
            setPrice={(price) => updatePropertyData({ price })}
          />
        );
      case 15:
        return (
          <Step15WeekendPrice
            price={propertyData.price}
            weekendPricePercentage={propertyData.weekendPricePercentage}
            setWeekendPricePercentage={(percentage) => updatePropertyData({ weekendPricePercentage: percentage })}
          />
        );
      case 16:
        return (
          <Step16Discounts
            discounts={propertyData.discounts}
            setDiscounts={(discounts) => updatePropertyData({ discounts })}
          />
        );
      case 17:
        return (
          <Step17Safety
            safetyItems={propertyData.safetyItems}
            setSafetyItems={updateSafetyItems}
            cameraDescription={propertyData.cameraDescription}
            setCameraDescription={updateCameraDescription}
          />
        );
      default:
        return (
          <div className="text-center p-10">
            <h1 className="text-3xl font-bold">¡Paso {currentStep} - En desarrollo!</h1>
            <p className="mb-6">Datos recopilados: {JSON.stringify(propertyData)}</p>
            <button 
              onClick={() => navigate('/my-properties')}
              className="mt-6 bg-[#FF385C] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#E31C5F] transition"
            >
              Continuar
            </button>
          </div>
        );
    }
  };

  const totalSteps = 17; 
  const progress = (currentStep / totalSteps) * 100;

  // Lógica para deshabilitar el botón "Siguiente"
  const isNextDisabled = () => {
    if (currentStep === 2 && !propertyData.propertyType) return true;
    if (currentStep === 3 && !propertyData.placeType) return true;
    if (currentStep === 4 && !propertyData.address) return true;
    return false;
  };
  
  return (
    <div className="flex flex-col h-screen">
      {/* Header de progreso */}
      <header className="flex-shrink-0 w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="text-xl font-bold text-[#FF385C]">airbnb</span>
          <div className="space-x-4">
            <button 
              onClick={() => console.log('¿Tienes alguna duda?')} 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full transition border border-gray-300"
            >
              ¿Tienes alguna duda?
            </button>
            <button 
              onClick={() => console.log('Guardar y salir')} 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full transition border border-gray-300"
            >
              Guardar y salir
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-grow overflow-y-auto flex justify-center"> 
        <div className={`w-full h-full flex justify-center ${
          [2, 5, 7, 9, 10, 12, 13, 16, 17].includes(currentStep) ? 'items-start pt-8' : 'items-center'
        }`}>
          {renderStepContent()}
        </div>
      </main>

      {/* Footer con navegación y progreso */}
      <footer className="flex-shrink-0 w-full bg-white border-t border-gray-200">
        <div className="px-6 py-5"> 
          {/* Barra de Progreso */}
          <div className="h-1 bg-gray-200 rounded-full mb-4">
            <div 
              className="h-1 bg-gray-900 rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center">
            
            {/* Botón Atrás */}
            <div className='flex items-center'>
              <button
                onClick={prevStep}
                className="font-semibold py-3 px-6 rounded-lg transition text-gray-900 hover:bg-gray-100"
              >
                Atrás
              </button>
            </div>

            {/* Botón Siguiente o Crear anuncio */}
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
              {currentStep === 17 ? 'Crear anuncio' : 'Siguiente'}
            </button>
            
          </div>
        </div>
      </footer>
      
      
      {/* Modal de Introducción */}
      {showIntroModal && <HostIntroModal onClose={handleModalClose} />}
    </div>
  );
}