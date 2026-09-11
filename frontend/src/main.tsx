import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import './styles/global.css';

const root = document.getElementById('root');
if (!root) throw new Error('No se encontro el punto de montaje de AniVideos.');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
