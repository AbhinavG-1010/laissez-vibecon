import React, { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
  const { ready, authenticated, login } = usePrivy();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && authenticated) {
      navigate('/dashboard');
    }
  }, [ready, authenticated, navigate]);

  const handleSignIn = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 border-2 border-foreground flex items-center justify-center">
              <span className="text-2xl font-bold">Z</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground tracking-tight">LAISSEZ</h1>
          </div>
          <div className="w-full border-2 border-foreground p-8 bg-card" style={{ borderRadius: 0 }}>
            <h2 className="text-2xl font-semibold mb-4 text-center">Sign In</h2>
            <p className="text-muted-foreground text-center mb-6">
              Connect your wallet or sign in with email
            </p>
            <button
              onClick={handleSignIn}
              className="w-full py-3 px-4 border-2 border-foreground bg-background hover:bg-foreground hover:text-background transition-all font-medium"
              style={{ borderRadius: 0 }}
            >
              Continue with Privy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;

