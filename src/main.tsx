import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LazyMotion, domAnimation } from 'framer-motion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  BarController,
  RadialLinearScale,
  ArcElement
} from 'chart.js'
import App from './App.tsx'
import './index.css'
import { LanguageProvider } from './contexts/LanguageContext'

// Registra tutti i controller necessari di Chart.js globalmente
ChartJS.register(
  // Scales
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  
  // Elements
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  
  // Controllers
  LineController,
  BarController,
  
  // Decorators
  Title,
  Tooltip,
  Legend
)

// Configurazione globale per Chart.js
ChartJS.defaults.responsive = true;
ChartJS.defaults.maintainAspectRatio = false;

// Configurazione sicurezza per dati sensibili
ChartJS.defaults.plugins.tooltip.callbacks = {
  ...ChartJS.defaults.plugins.tooltip.callbacks,
  label: function(context) {
    // Sanitizza i dati mostrati nei tooltip
    const value = context.parsed?.y || 0;
    return `${context.dataset.label}: ${typeof value === 'number' ? value.toLocaleString() : value}`;
  }
};

// Implementazione della cache delle immagini per migliorare le prestazioni
const imageCache = new Set<string>();

// Funzione di precaricamento per elementi critici
const preloadCriticalAssets = () => {
  // Precarica le immagini cruciali
  const criticalImages: string[] = [
    // Aggiungi qui URL delle immagini cruciali per l'interfaccia iniziale
    // Esempio: "/images/logo.webp"
  ];
  
  criticalImages.forEach(src => {
    if (!imageCache.has(src)) {
      const img = new Image();
      img.src = src;
      img.onerror = () => {
        console.warn(`Impossibile precaricare l'immagine: ${src}`);
        imageCache.delete(src);
      };
      imageCache.add(src);
    }
  });
};

// Funzione per verificare token e credenziali scadute
const checkAuthStatus = () => {
  try {
    const tokenData = localStorage.getItem('user');
    if (tokenData) {
      const parsedData = JSON.parse(tokenData);
      // Implementare verifica token scaduto
      // Se scaduto: localStorage.removeItem('user');
    }
  } catch (e) {
    // Gestione fallback per JSON non valido o altro errore
    localStorage.removeItem('user');
    console.error('Errore nella validazione token', e);
  }
};

// Aggiungi classe per gestire prefers-reduced-motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('reduce-motion');
}

// Implementazione di un Event Bus leggero per comunicazione tra componenti
export const eventBus = {
  events: {} as Record<string, Array<(...args: any[]) => void>>,
  subscribe(event: string, callback: (...args: any[]) => void) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    return () => this.unsubscribe(event, callback);
  },
  unsubscribe(event: string, callback: (...args: any[]) => void) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  },
  emit(event: string, ...args: any[]) {
    if (this.events[event]) {
      this.events[event].forEach(callback => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Errore nell'event handler per "${event}":`, error);
        }
      });
    }
  }
};

// Miglioramento della performance con l'utilizzo di requestIdleCallback
const startApp = () => {
  const root = document.getElementById('root');
  if (!root) return;

  // Verifica stato auth
  checkAuthStatus();

  createRoot(root).render(
    <StrictMode>
      <LazyMotion features={domAnimation} strict>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </LazyMotion>
    </StrictMode>,
  );

  // Precarica gli asset quando il browser è inattivo
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(preloadCriticalAssets);
  } else {
    // Fallback per browser che non supportano requestIdleCallback
    setTimeout(preloadCriticalAssets, 200);
  }
};

// Accesso sicuro alla variabile di ambiente
const isProduction = import.meta.env.PROD;

// Registrazione del Service Worker per migliorare il caricamento offline
if ('serviceWorker' in navigator && isProduction) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Avvia l'app
startApp();
