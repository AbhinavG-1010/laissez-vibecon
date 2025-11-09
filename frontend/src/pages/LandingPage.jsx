import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '../components/ui/button';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_design-refresh-81/artifacts/hbva0jbg_laissez-logo.png';

export default function LandingPage() {
  const navigate = useNavigate();
  const { login, authenticated, ready } = usePrivy();

  useEffect(() => {
    if (ready && authenticated) {
      navigate('/dashboard');
    }
  }, [ready, authenticated, navigate]);

  const handleSignIn = async () => {
    try {
      await login({ loginMethods: ['google'] });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleBookDemo = () => {
    // Placeholder - do nothing for now
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
      {/* Logo */}
      <div className="mb-12">
        <img 
          src={LOGO_URL} 
          alt="Laissez" 
          className="h-24 w-auto"
          data-testid="landing-logo"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={handleSignIn}
          data-testid="sign-in-button"
          className="px-12 py-6 text-lg bg-white text-black hover:bg-gray-200 rounded-full font-medium"
        >
          Sign In
        </Button>
        <Button
          onClick={handleBookDemo}
          data-testid="book-demo-button"
          variant="outline"
          className="px-12 py-6 text-lg border-2 border-white text-white hover:bg-white hover:text-black rounded-full font-medium"
        >
          Book a Demo
        </Button>
      </div>
    </div>
  );
}
