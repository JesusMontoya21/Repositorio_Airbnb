import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Importaciones de Contexto y Componentes
import { AuthProvider } from './context/AuthContext.jsx'; 
import Navbar from './components/Navbar.jsx'; 
import Footer from './components/Footer.jsx'; 
import ProtectedRoute from './components/ProtectedRoute.jsx'; 

// Importaciones de Páginas
import Home from './pages/Home.jsx'; 
import PropertyDetails from './pages/PropertyDetails.jsx'; 
import Login from './pages/Login.jsx'; 
import Register from './pages/Register.jsx'; 
import MyProperties from './pages/MyProperties.jsx'; 
import MyBookings from './pages/MyBookings.jsx'; 
import Services from "./pages/Services.jsx"; 
import Experiences from "./pages/Experiences.jsx"; 
import BecomeHostIntro from './pages/BecomeHostIntro.jsx'; 
import CreateProperty from './pages/CreateProperty.jsx'; 
import CreateExperience from './pages/CreateExperience.jsx'; // <-- COMPONENTE AÑADIDO
import CreateService from './pages/CreateService.jsx'; // <-- NUEVO COMPONENTE AÑADIDO

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 1,
		},
	},
});

function AppLayout() {
  const location = useLocation();
  // Determina si ocultar el Navbar/Footer basado en la ruta actual
  const hideLayout = ['/create-property', '/anuncio-alojamiento', '/create-experience', '/create-service'].includes(location.pathname); // <-- RUTAS AÑADIDAS A LA LÓGICA DE OCULTAR LAYOUT

  return (
    <div className="flex flex-col min-h-screen">
      {/* Oculta Navbar en las páginas de creación (create-property, create-experience y intro) */}
      {!hideLayout && <Navbar />} 
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<Services />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/anuncio-alojamiento" element={<BecomeHostIntro />} />
          
          {/* Flujo de Creación de Alojamientos (Propiedades) */}
          {/* TEMPORALMENTE: Se elimina ProtectedRoute para que puedas ver el flujo de creación. 
              Recuerda volver a protegerla después de terminar el diseño. */}
          <Route path="/create-property" element={<CreateProperty />} />

          {/* Flujo de Creación de Experiencias */}
          <Route path="/create-experience" element={<CreateExperience />} /> {/* <-- NUEVA RUTA AGREGADA */}

          {/* Flujo de Creación de Servicios */}
          <Route path="/create-service" element={<CreateService />} /> {/* <-- NUEVA RUTA AGREGADA */}

          <Route
            path="/my-properties"
            element={
              <ProtectedRoute>
                <MyProperties />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppLayout />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}