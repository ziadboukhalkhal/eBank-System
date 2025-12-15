import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import AgentDashboard from './pages/AgentDashboard';
import ClientDashboard from './pages/ClientDashboard';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? (
          user.role === 'AGENT_GUICHET' ? 
            <Navigate to="/agent" /> : 
            <Navigate to="/client" />
        ) : <Login />} 
      />
      <Route
        path="/agent/*"
        element={
          <PrivateRoute role="AGENT_GUICHET">
            <AgentDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/client/*"
        element={
          <PrivateRoute role="CLIENT">
            <ClientDashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;