import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from '@dr.pogodin/react-helmet';
import App from './App.tsx';
import { wakeUpBackend } from './services/api.ts';
import './index.css';

// Ping the backend immediately so Render free tier wakes up before user logs in
wakeUpBackend();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>,
);
