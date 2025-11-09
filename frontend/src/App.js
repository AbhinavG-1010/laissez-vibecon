import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import AgentConfigPage from './pages/AgentConfigPage';
import LinkAccountPage from './pages/LinkAccountPage';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';

function RequireAuth({ children }) {
  const { ready, authenticated, login } = usePrivy();

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Initializing authentication...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Sign in to continue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please authenticate with Google to access the Laissez platform.
            </p>
            <Button type="button" className="w-full" onClick={() => login({ loginMethods: ['google'] })}>
              Continue with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth>
            <AgentConfigPage />
          </RequireAuth>
        }
      />
      <Route path="/link" element={<LinkAccountPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
