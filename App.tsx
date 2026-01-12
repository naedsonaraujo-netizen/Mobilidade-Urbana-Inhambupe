
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import UserRegisterScreen from './screens/UserRegisterScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import MototaxiScreen from './screens/MototaxiScreen';
import GasScreen from './screens/GasScreen';
import ServerRegisterScreen from './screens/ServerRegisterScreen';
import ServiceSelectionScreen from './screens/ServiceSelectionScreen';
import ServerDashboardScreen from './screens/ServerDashboardScreen';
import RefillCreditsScreen from './screens/RefillCreditsScreen';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const auth = localStorage.getItem('is_logged_in');
    const role = localStorage.getItem('user_role');
    setIsLoggedIn(auth === 'true');
    setUserRole(role);
  }, [location]);

  if (isLoggedIn === null) return <div className="min-h-screen bg-[#050a1e]"></div>;

  const getRedirectPath = () => {
    return userRole === 'server' ? '/server-dashboard' : '/';
  };

  return (
    <div className="min-h-screen bg-[#050a1e]">
      <Routes>
        <Route 
          path="/" 
          element={isLoggedIn && userRole === 'server' ? <Navigate to="/server-dashboard" replace /> : <HomeScreen />} 
        />
        <Route path="/register-user" element={<UserRegisterScreen />} />
        <Route path="/register-server" element={<ServerRegisterScreen />} />
        <Route path="/select-service" element={<ServiceSelectionScreen />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to={getRedirectPath()} replace /> : <LoginScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/mototaxi" element={<MototaxiScreen />} />
        <Route path="/gas" element={<GasScreen />} />
        <Route path="/server-dashboard" element={<ServerDashboardScreen />} />
        <Route path="/refill-credits" element={<RefillCreditsScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
