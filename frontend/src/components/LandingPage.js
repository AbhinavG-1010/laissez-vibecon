import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 border-2 border-foreground flex items-center justify-center">
            <span className="text-2xl font-bold">Z</span>
          </div>
          <h1 className="text-5xl font-bold text-foreground tracking-tight">LAISSEZ</h1>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={() => navigate('/signin')}
            size="lg"
            className="px-8 py-6 text-lg border-2 border-foreground bg-background hover:bg-foreground hover:text-background transition-all"
            style={{ borderRadius: 0 }}
          >
            Sign In
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-6 text-lg border-2 border-foreground hover:bg-foreground hover:text-background transition-all"
            style={{ borderRadius: 0 }}
          >
            Book a Demo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

