import { useState } from 'react';

export default function Footer() {
  const [openSection, setOpenSection] = useState(null);
  const [showMoreDestinations, setShowMoreDestinations] = useState(false);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Sección de Inspiración para futuras escapadas
  const inspirationCategories = [
    { id: 'populares', label: 'Populares' },
    { id: 'arte', label: 'Arte y cultura' },
    { id: 'playa', label: 'Playa' },
    { id: 'montanas', label: 'Montañas' },
    { id: 'aire', label: 'Al aire libre' },
    { id: 'actividades', label: 'Actividades' }
  ];

  const [activeCategory, setActiveCategory] = useState('populares');

  const destinations = {
    populares: [
      { ciudad: 'Dallas', tipo: 'Departamentos' },
      { ciudad: 'Portland (Maine)', tipo: 'Casas en renta' },
      { ciudad: 'Cleveland', tipo: 'Departamentos' },
      { ciudad: 'Barcelona', tipo: 'Departamentos' },
      { ciudad: 'Galveston', tipo: 'Casas de campo' },
      { ciudad: 'Raleigh', tipo: 'Casas en renta' },
      { ciudad: 'Portland', tipo: 'Villas' },
      { ciudad: 'Mineápolis', tipo: 'Casas en renta' },
      { ciudad: 'Ámsterdam', tipo: 'Alojamientos para estancias largas' },
      { ciudad: 'Condado de Kauai', tipo: 'Alquileres vacacionales' },
      { ciudad: 'Filadelfia', tipo: 'Departamentos' },
      { ciudad: 'Gulf Shores', tipo: 'Alojamientos para estancias largas' },
      { ciudad: 'Tokio', tipo: 'Casas en renta' },
      { ciudad: 'Queens', tipo: 'Departamentos' },
      { ciudad: 'St. Petersburg', tipo: 'Departamentos' },
      { ciudad: 'Charlotte', tipo: 'Villas' },
      { ciudad: 'West Palm Beach', tipo: 'Casas en renta' },
    ]
  };

  const visibleDestinations = showMoreDestinations 
    ? destinations[activeCategory] 
    : destinations[activeCategory]?.slice(0, 12);

  const footerSections = [
    {
      title: 'Asistencia',
      links: [
        'Centro de Ayuda',
        'Obtén ayuda para resolver un problema de seguridad',
        'AirCover',
        'Antidiscriminación',
        'Apoyo para discapacitados',
        'Opciones de cancelación',
        'Problemas en la zona'
      ]
    },
    {
      title: 'Cómo ser anfitrión',
      links: [
        'Hazlo Airbnb',
        'Ofrece tu experiencia en Airbnb',
        'Ofrece tu servicio en Airbnb',
        'AirCover para anfitriones',
        'Recursos para hospedar',
        'Foro de la comunidad',
        'Ser un anfitrión responsable',
        'Apúntate a una clase gratuita sobre cómo ser anfitrión',
        'Busca un coanfitrión'
      ]
    },
    {
      title: 'Airbnb',
      links: [
        'Lanzamiento de verano 2025',
        'Sala de prensa',
        'Empleo',
        'Inversores',
        'Alojamientos Airbnb.org'
      ]
    }
  ];

  const GlobeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM1.5 8a6.5 6.5 0 0 1 6-6.48v1.15a5.02 5.02 0 0 0-3.37 7.2l-.89.89A6.47 6.47 0 0 1 1.5 8zm6 6.48V13.5a4 4 0 0 1-2.46-1.36l.89-.89A5.02 5.02 0 0 0 7.5 14.48zM8.5 1.52A6.5 6.5 0 0 1 14.24 7H12a5.02 5.02 0 0 0-3.5-4.48V1.52zm0 12.96V13.5a5.02 5.02 0 0 0 3.37-7.2l.89-.89A6.47 6.47 0 0 1 8.5 14.48z"/>
    </svg>
  );

  const DollarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8.5 2V1h-1v1H6a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h3a1 1 0 0 1 0 2H5v1h2.5v1h1v-1H10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7a1 1 0 0 1 0-2h4V2H8.5z"/>
    </svg>
  );

  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-16">
      {/* Sección de Inspiración para futuras escapadas */}
      <div className="bg-gray-100 py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Inspiración para futuras escapadas
          </h2>

          {/* Tabs de categorías */}
          <div className="flex gap-8 border-b border-gray-300 mb-8 overflow-x-auto">
            {inspirationCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`pb-3 text-sm font-medium whitespace-nowrap transition ${
                  activeCategory === cat.id
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid de destinos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-4">
            {visibleDestinations?.map((dest, idx) => (
              <div key={idx} className="space-y-1">
                <a href="#" className="text-sm font-medium text-gray-900 hover:underline">
                  {dest.ciudad}
                </a>
                <p className="text-sm text-gray-600">{dest.tipo}</p>
              </div>
            ))}
          </div>

          {/* Botón Mostrar más */}
          {destinations[activeCategory]?.length > 12 && (
            <button
              onClick={() => setShowMoreDestinations(!showMoreDestinations)}
              className="mt-6 px-6 py-3 bg-white border border-gray-900 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
            >
              {showMoreDestinations ? 'Mostrar menos' : 'Mostrar más'}
              <span className="ml-2">{showMoreDestinations ? '↑' : '↓'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Sección principal del footer con 3 columnas */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        {/* Desktop view */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-10">
          {footerSections.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-sm text-gray-700 hover:underline transition"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile accordion */}
        <div className="lg:hidden">
          {footerSections.map((section, idx) => (
            <div key={idx} className="border-b border-gray-200">
              <button
                onClick={() => toggleSection(idx)}
                className="w-full py-5 flex justify-between items-center text-left"
              >
                <span className="text-base font-semibold text-gray-900">
                  {section.title}
                </span>
                <span className="text-2xl text-gray-600">
                  {openSection === idx ? '−' : '+'}
                </span>
              </button>
              {openSection === idx && (
                <ul className="pb-5 space-y-3">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="text-sm text-gray-700 hover:underline transition"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Línea divisora */}
      <div className="border-t border-gray-300"></div>

      {/* Bottom bar */}
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            {/* Left side */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-sm text-gray-700">
              <span>© 2025 Airbnb, Inc.</span>
              <span className="text-gray-400">·</span>
              <a href="#" className="hover:underline">Privacidad</a>
              <span className="text-gray-400">·</span>
              <a href="#" className="hover:underline">Términos</a>
              <span className="text-gray-400">·</span>
              <a href="#" className="hover:underline">Mapa del sitio</a>
              <span className="text-gray-400">·</span>
              <a href="#" className="hover:underline">Información de la compañía</a>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Idioma */}
              <button className="flex items-center gap-2 text-sm font-semibold hover:underline">
                <GlobeIcon />
                <span>Español (MX)</span>
              </button>

              {/* Moneda */}
              <button className="flex items-center gap-2 text-sm font-semibold hover:underline">
                <DollarIcon />
                <span>MXN</span>
              </button>

              {/* Redes sociales */}
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="text-gray-900 hover:text-gray-700 transition"
                  aria-label="Facebook"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.326V1.326C24 .597 23.403 0 22.675 0z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-900 hover:text-gray-700 transition"
                  aria-label="Twitter"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-900 hover:text-gray-700 transition"
                  aria-label="Instagram"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}