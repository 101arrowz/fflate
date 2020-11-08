import React from 'react';
import App from './App';
import { render } from 'react-dom';

if (process.env.NODE_ENV == 'production') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.ts');
  }
}

render(<App />, document.getElementById('app'));