import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Auth from './components/Auth';
import Dashboard from './pages/Dashboard';
import EmotionPuzzle from './components/EmotionPuzzle';
import SecretHandshake from './components/SecretHandshake';
import Settings from './pages/Settings';
import PartnerConnection from './components/PartnerConnection';
import Spinner from './components/Spinner';
import { offlineStorage, registerSync, registerNetworkListeners } from './utils/offlineStorage';
import './index.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

const App = () => {
  useEffect(() => {
    // Initialize offline storage
    offlineStorage.init();

    // Register network listeners for background sync
    const handleOnline = async () => {
      console.log('Back online, syncing offline data...');
      await registerSync('sync-moods');
    };

    const handleOffline = () => {
      console.log('Offline mode activated');
    };

    const cleanup = registerNetworkListeners(handleOnline, handleOffline);

    return cleanup;
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/puzzle"
            element={
              <PrivateRoute>
                <EmotionPuzzle />
              </PrivateRoute>
            }
          />
          <Route
            path="/handshake"
            element={
              <PrivateRoute>
                <SecretHandshake />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          <Route
            path="/partner"
            element={
              <PrivateRoute>
                <PartnerConnection />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
