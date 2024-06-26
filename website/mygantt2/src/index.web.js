import React from 'react';
import App from './App';
import {createRoot} from 'react-dom/client';

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(<App />);
} else {
  console.error('Root element not found');
}
