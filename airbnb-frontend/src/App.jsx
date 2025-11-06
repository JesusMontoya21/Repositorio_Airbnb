import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext.jsx'; // Corregido a .jsx
import Navbar from './components/Navbar.jsx'; // Corregido a .jsx
import Home from './pages/Home.jsx'; // Corregido a .jsx
import PropertyDetails from './pages/PropertyDetails.jsx'; // Corregido a .jsx
import Login from './pages/Login.jsx'; // Corregido a .jsx
import Register from './pages/Register.jsx'; // Corregido a .jsx
import MyProperties from './pages/MyProperties.jsx'; // Corregido a .jsx
import CreateProperty from './pages/CreateProperty.jsx'; // Corregido a .jsx
import MyBookings from './pages/MyBookings.jsx'; // Corregido a .jsx
import ProtectedRoute from './components/ProtectedRoute.jsx'; // Corregido a .jsx
import Services from "./pages/Services.jsx"; // Corregido a .jsx
import Experiences from "./pages/Experiences.jsx"; // Corregido a .jsx
import BecomeHostIntro from './pages/BecomeHostIntro.jsx'; // Corregido a .jsx
import Footer from './components/Footer.jsx'; // Corregido a .jsx

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function Layout() {
  const location = useLocation();
  
  // Rutas que NO deben mostrar Navbar y Footer
  const noLayoutRoutes = ['/anuncio-alojamiento', '/create-property']; // Agregamos /create-property aquí para que el flujo de creación tenga su propio layout
  const hideLayout = noLayoutRoutes.includes(location.pathname);

  return (
    <>
      {/* Ocultamos Navbar y Footer en rutas de flujo completo (como anuncio-alojamiento y create-property) */}
      {!hideLayout && <Navbar />} 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/services" element={<Services />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/anuncio-alojamiento" element={<BecomeHostIntro />} />
        
        {/* TEMPORALMENTE: Se elimina ProtectedRoute para que puedas ver el flujo de creación. 
            Recuerda volver a protegerla después de terminar el diseño. */}
        <Route path="/create-property" element={<CreateProperty />} />

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
      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Layout />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;