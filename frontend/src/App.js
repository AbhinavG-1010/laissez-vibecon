import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import LandingPage from './components/LandingPage';
import SignInPage from './components/SignInPage';
import Dashboard from './components/Dashboard';
import { Toaster } from './components/ui/sonner';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

// Private route component to protect dashboard
function PrivateRoute({ children }) {
  const { ready, authenticated } = usePrivy();

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}

export default App;
