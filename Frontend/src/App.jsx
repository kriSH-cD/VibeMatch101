import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './lib/useAuth';
import LoadingSpinner from './components/ui/LoadingSpinner';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import SetupProfile from './pages/SetupProfile';
import Feed from './pages/Feed';
import Discover from './pages/Discover';
import UserProfile from './pages/UserProfile';
import MyProfile from './pages/MyProfile';
import EditProfile from './pages/EditProfile';
import Messages from './pages/Messages';
import Chat from './pages/Chat';
import AdminDashboard from './pages/AdminDashboard';

// A simple protective wrapper that verifies authentication natively
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/setup-profile" element={<SetupProfile />} />
        
        <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
        <Route path="/discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
        <Route path="/profile/me" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
        <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/profile/:id" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/chat/:id" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
