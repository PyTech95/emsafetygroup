import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { startAutoUpdate } from './lib/freshness';
import './index.css';

// fuori da React: continua a funzionare anche se una versione vecchia della pagina va in errore
startAutoUpdate();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
