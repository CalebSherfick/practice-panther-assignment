import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import AuthPage from './components/AuthPage';
import CustomersPage from './components/CustomersPage';
import CustomerDetailsPage from './components/CustomerDetailsPage';
import "./App.css";

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to="/customers" replace /> : <AuthPage />} 
      />
      <Route 
        path="/customers" 
        element={user ? <CustomersPage /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/customers/:customerId" 
        element={user ? <CustomerDetailsPage /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/" 
        element={<Navigate to={user ? "/customers" : "/login"} replace />} 
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
