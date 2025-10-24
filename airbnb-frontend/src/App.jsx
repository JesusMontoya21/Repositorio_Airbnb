import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PropertyDetails from './pages/PropertyDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import MyProperties from './pages/MyProperties';
import CreateProperty from './pages/CreateProperty';
import MyBookings from './pages/MyBookings';
import ProtectedRoute from './components/ProtectedRoute';
import Services from "./pages/Services";
import Experiences from "./pages/Experiences";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/services" element={<Services />} />
              <Route path="/experiences" element={<Experiences />} />
              <Route
                path="/my-properties"
                element={
                  <ProtectedRoute>
                    <MyProperties />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/create-property"
                element={
                  <ProtectedRoute>
                    <CreateProperty />
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
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;