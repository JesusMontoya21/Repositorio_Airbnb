import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext.jsx'; 
import Navbar from './components/Navbar.jsx'; 
import Footer from './components/Footer.jsx'; 
import ProtectedRoute from './components/ProtectedRoute.jsx'; 

import Home from './pages/Home.jsx'; 
import PropertyDetails from './pages/PropertyDetails.jsx'; 
import Login from './pages/Login.jsx'; 
import Register from './pages/Register.jsx'; 
import MyProperties from './pages/MyProperties.jsx'; 
import MyBookings from './pages/MyBookings.jsx'; 
import Profile from './pages/Profile.jsx';
import Services from "./pages/Services.jsx"; 
import Experiences from "./pages/Experiences.jsx"; 
import BecomeHostIntro from './pages/BecomeHostIntro.jsx'; 
import CreateProperty from './pages/CreateProperty.jsx'; 
import CreateExperience from './pages/CreateExperience.jsx';
import CreateService from './pages/CreateService.jsx';
import Favorites from './pages/Favorites.jsx';

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
  const hideLayout = ['/create-property', '/anuncio-alojamiento', '/create-experience', '/create-service'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
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
          <Route path="/create-property" element={<CreateProperty />} />
          <Route path="/create-experience" element={<CreateExperience />} />
          <Route path="/create-service" element={<CreateService />} />

          <Route path="/my-properties" element={<ProtectedRoute><MyProperties /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
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