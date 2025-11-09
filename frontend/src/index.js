import React from 'react';
import ReactDOM from 'react-dom/client';
import { PrivyProvider } from '@privy-io/react-auth';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PrivyProvider
      appId={process.env.REACT_APP_PRIVY_APP_ID || 'your-privy-app-id'}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#000000',
          logo: 'https://your-logo-url.com/logo.png',
        },
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>
);