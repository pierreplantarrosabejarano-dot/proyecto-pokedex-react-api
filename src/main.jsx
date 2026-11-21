import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { FavoritosProvider } from './context/FavoritosContext.jsx';

const temaGuardado = localStorage.getItem('tema-pokedex');
if (temaGuardado === 'claro' || temaGuardado === 'oscuro' || temaGuardado === 'calido') {
  document.documentElement.dataset.theme = temaGuardado;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FavoritosProvider>
      <App />
    </FavoritosProvider>
  </StrictMode>
);
