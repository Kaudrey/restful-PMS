import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';
import Dashboard from "./pages/admin/Dashoboard";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        
<Route path="/dashboard" element={
  <ProtectedAdminRoute>
    <Dashboard />
  </ProtectedAdminRoute>
} />
      </Routes>
    </AuthProvider>

  );
}

export default App;
