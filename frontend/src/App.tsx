import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';
import Dashboard from "./pages/admin/Dashoboard";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import DashboardUser from "./pages/user/DashboardUser";
import Users from "./pages/admin/Users";
import Requests from './pages/admin/Requests';
import Slots from './pages/admin/slots';
import SlotsNew from './pages/admin/AddSlot';

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
<Route path="/dashboard-user" element={
  <ProtectedAdminRoute>
    <DashboardUser />
  </ProtectedAdminRoute>

} />
<Route path="/users" element={
  <ProtectedAdminRoute>
    <Users />
  </ProtectedAdminRoute>

} />
<Route path="/requests" element={
  <ProtectedAdminRoute>
    <Requests />
  </ProtectedAdminRoute>

} />

<Route path="/slots" element={
  <ProtectedAdminRoute>
    <Slots />
  </ProtectedAdminRoute>

} />
<Route path="/slots/new" element={
  <ProtectedAdminRoute>
    <SlotsNew />
  </ProtectedAdminRoute>

} />
      </Routes>
    </AuthProvider>

  );
}

export default App;
