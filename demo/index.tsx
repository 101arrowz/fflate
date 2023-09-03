import React from 'react';
import App from './App';
import { createRoot } from 'react-dom/client';

if (process.env.NODE_ENV == 'production') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(new URL('sw.ts', import.meta.url), { type: 'module' });
  }
}

createRoot(document.getElementById('app')!).render(<App />);