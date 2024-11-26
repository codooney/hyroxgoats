import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize stores
import { useProfileStore } from './store/profileStore';
import { useWorkoutStore } from './store/workoutStore';

// Hydrate stores
useProfileStore.persist.rehydrate();
useWorkoutStore.persist.rehydrate();

// Register service worker for production only
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  import('virtual:pwa-register').then(({ registerSW }) => {
    registerSW();
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);