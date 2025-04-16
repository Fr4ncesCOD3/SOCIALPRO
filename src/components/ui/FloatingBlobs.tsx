import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './FloatingBlobs.css';

// Interfaccia per le proprietà del componente
export interface FloatingBlobsProps {
  count?: number;
  baseSize?: number;
  colors?: string[];
  blurAmount?: number;
  speedFactor?: number;
  opacityRange?: [number, number];
  className?: string;
  containerId?: string;
  useSVGFilter?: boolean;
  // Proprietà aggiuntive utilizzate in Header.tsx
  minSize?: number;
  maxSize?: number;
  opacityVariation?: number;
  enableBlending?: boolean;
  density?: number;
  // Nuove proprietà per controllo animazioni
  floatDuration?: number;
  morphDuration?: number;
  pulseDuration?: number;
  splitMergeDuration?: number;
  enableSplitMerge?: boolean;
}

// Interfaccia per le proprietà di un blob
interface BlobProps {
  x: number;
  y: number;
  size: number;
  color: string;
  blur: number;
  speedFactor: number;
  isMobile: boolean;
  directionX: number;
  directionY: number;
  delayFactor: number;
  minOpacity: number;
  maxOpacity: number;
}

// Funzione più efficiente per rilevare dispositivi mobili
const isMobile = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = ['android', 'iphone', 'ipad', 'mobile', 'phone'];
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth <= 768;
  
  return (
    mobileKeywords.some(keyword => userAgent.includes(keyword)) || 
    (isTouchDevice && isSmallScreen)
  );
};

// Rilevamento di connessione lenta
const isLowPerformanceDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  
  // Controlla CPU/RAM se disponibile
  const isSlowCPU = 'hardwareConcurrency' in navigator && navigator.hardwareConcurrency < 4;
  
  // Controlla la connessione se disponibile
  const isSlowConnection = 'connection' in navigator && 
    //@ts-ignore - Nuova API non ancora in tutti i tipi TS
    (navigator.connection?.saveData || 
    //@ts-ignore
    ['slow-2g', '2g', '3g'].includes(navigator.connection?.effectiveType));
  
  return isSlowCPU || isSlowConnection || isMobile();
};

// Funzione di throttling per limitare le chiamate frequenti
const throttle = (callback: Function, delay: number) => {
  let lastCall = 0;
  return function (...args: any[]) {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return callback(...args);
  };
};

// Componente principale FloatingBlobs
const FloatingBlobs: React.FC<FloatingBlobsProps> = ({
  count = 20,
  baseSize = 100,
  colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3'],
  blurAmount = 10,
  speedFactor = 1,
  opacityRange = [0.3, 0.7],
  className = '',
  containerId = 'floating-blobs-container',
  useSVGFilter = true,
  // Valori predefiniti per le nuove proprietà
  floatDuration = 30,
  morphDuration = 12,
  pulseDuration = 15,
  splitMergeDuration = 25,
  enableSplitMerge = true
}) => {
  // Stati e ref
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false);
  const [isLowPerformance, setIsLowPerformance] = useState<boolean>(false);
  const [isInViewport, setIsInViewport] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const intersectionObserver = useRef<IntersectionObserver | null>(null);
  const resizeObserver = useRef<ResizeObserver | null>(null);
  const frameId = useRef<number | null>(null);
  const previousTime = useRef<number>(0);

  // Controlla se il dispositivo è mobile al caricamento
  useEffect(() => {
    setIsMobileDevice(isMobile());
    setIsLowPerformance(isLowPerformanceDevice());
  }, []);

  // Effetto per l'ottimizzazione del rendering
  useEffect(() => {
    let timeoutId: number;
    
    // Imposta lo stato "caricato" dopo un breve ritardo
    timeoutId = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Effetto per l'osservazione dell'intersezione
  useEffect(() => {
    if (!containerRef.current) return;
    
    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    };
    
    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        setIsInViewport(entry.isIntersecting);
      });
    };
    
    intersectionObserver.current = new IntersectionObserver(callback, options);
    intersectionObserver.current.observe(containerRef.current);
    
    return () => {
      if (intersectionObserver.current) {
        intersectionObserver.current.disconnect();
      }
    };
  }, []);

  // Effetto per l'osservazione del ridimensionamento
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };
    
    // Aggiorna le dimensioni iniziali
    updateDimensions();
    
    // Creo una singola istanza della funzione throttled
    const throttledUpdateDimensions = throttle(updateDimensions, 100);
    
    // Imposta l'observer per i cambiamenti di dimensione
    if ('ResizeObserver' in window) {
      resizeObserver.current = new ResizeObserver(throttledUpdateDimensions);
      resizeObserver.current.observe(containerRef.current);
    } else if (typeof window !== 'undefined') {
      // Fallback per browser che non supportano ResizeObserver
      (window as Window).addEventListener('resize', throttledUpdateDimensions);
    }
    
    return () => {
      if (resizeObserver.current && containerRef.current) {
        resizeObserver.current.unobserve(containerRef.current);
        resizeObserver.current.disconnect();
      } else if (typeof window !== 'undefined') {
        (window as Window).removeEventListener('resize', throttledUpdateDimensions);
      }
    };
  }, []);

  // Calcolo ottimizzato per il numero di blob in base al dispositivo
  const adjustedCount = useMemo(() => {
    const baseCount = isMobileDevice ? Math.min(8, count) : count;
    const performanceAdjustment = isLowPerformance ? 0.5 : 1;
    return Math.floor(baseCount * performanceAdjustment);
  }, [count, isMobileDevice, isLowPerformance]);

  // Generazione ottimizzata dei blob usando useMemo per evitare ricalcoli inutili
  const blobs = useMemo(() => {
    const tempBlobs: BlobProps[] = [];
    
    if (dimensions.width === 0 || dimensions.height === 0) {
      return tempBlobs;
    }
    
    // Fattore di scala basato sulle dimensioni del contenitore
    const sizeFactor = Math.min(dimensions.width, dimensions.height) / 1000;
    
    // Velocità di animazione ridotta per dispositivi a basse prestazioni
    const adjustedSpeedFactor = isMobileDevice ? speedFactor * 0.7 : speedFactor;
    const adjustedBlurAmount = isMobileDevice ? blurAmount * 0.6 : blurAmount;
    
    for (let i = 0; i < adjustedCount; i++) {
      // Posizione casuale all'interno del contenitore
      const x = Math.random() * dimensions.width;
      const y = Math.random() * dimensions.height;
      
      // Dimensione variabile per ciascun blob
      const sizeVariation = Math.random() * 0.5 + 0.75; // da 0.75 a 1.25
      const size = baseSize * sizeVariation * sizeFactor;
      
      // Colore casuale dall'array fornito
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Direzioni casuali per le animazioni
      const directionX = Math.random() > 0.5 ? 1 : -1;
      const directionY = Math.random() > 0.5 ? 1 : -1;
      
      // Fattore di ritardo per animazioni sfalsate
      const delayFactor = i / adjustedCount;
      
      // Range di opacità personalizzato
      const [minOpacity, maxOpacity] = opacityRange;
      
      tempBlobs.push({
        x,
        y,
        size,
        color,
        blur: adjustedBlurAmount,
        speedFactor: adjustedSpeedFactor,
        isMobile: isMobileDevice,
        directionX,
        directionY,
        delayFactor,
        minOpacity,
        maxOpacity
      });
    }
    
    return tempBlobs;
  }, [
    adjustedCount,
    baseSize,
    colors,
    dimensions,
    isMobileDevice,
    isLowPerformance,
    blurAmount,
    speedFactor,
    opacityRange
  ]);

  // Renderer ottimizzato che utilizza requestAnimationFrame solo quando necessario
  const renderBlobs = useCallback(() => {
    return blobs.map((blob, index) => {
      const blobStyle: React.CSSProperties = {
        width: `${blob.size}px`,
        height: `${blob.size}px`,
        backgroundColor: blob.color,
        left: `${blob.x}px`,
        top: `${blob.y}px`,
        // Variabili CSS per controllare le animazioni
        '--speed-factor': blob.speedFactor,
        '--direction-x': blob.directionX,
        '--direction-y': blob.directionY,
        '--delay-factor': blob.delayFactor,
        '--min-opacity': blob.minOpacity,
        '--max-opacity': blob.maxOpacity,
        '--float-duration': `${floatDuration}s`,
        '--morph-duration': `${morphDuration}s`,
        '--pulse-duration': `${pulseDuration}s`,
        '--split-merge-duration': `${splitMergeDuration}s`,
        '--blob-color': blob.color,
        animationDelay: `${blob.delayFactor * 5}s`
      } as React.CSSProperties;
      
      return (
        <div
          key={index}
          className="floating-blob"
          style={blobStyle}
          data-index={index}
          aria-hidden="true"
        />
      );
    });
  }, [
    blobs, 
    floatDuration, 
    morphDuration, 
    pulseDuration, 
    splitMergeDuration
  ]);

  // Ottimizzazioni di rendering condizionali
  const containerStyle: React.CSSProperties = useMemo(() => ({
    visibility: isInViewport || !('IntersectionObserver' in window) ? 'visible' : 'hidden',
    contentVisibility: 'auto',
    containIntrinsicSize: '100vh',
  }), [isInViewport]);

  // Classe condizionale per il contenitore
  const containerClassName = `floating-blobs-container ${className} ${isLoaded ? 'loaded' : ''}`;

  // SVG Filter per l'effetto Metaball/Goo avanzato
  const svgFilter = useMemo(() => {
    if (!useSVGFilter) return null;
    
    return (
      <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" 
              result="goo" 
            />
            <feBlend in="SourceGraphic" in2="goo" operator="atop" result="mix" />
            <feComposite in="mix" in2="SourceGraphic" operator="in" result="final" />
          </filter>
          <filter id="goo-mobile">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 15 -6" 
              result="goo" 
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
    );
  }, [useSVGFilter]);

  return (
    <>
      {svgFilter}
      <div
        id={containerId}
        ref={containerRef}
        className={containerClassName}
        style={{
          ...containerStyle,
          '--animation-enabled': enableSplitMerge ? 'running' : 'paused'
        } as React.CSSProperties}
        aria-hidden="true"
        data-mobile={isMobileDevice ? 'true' : 'false'}
        data-performance={isLowPerformance ? 'low' : 'high'}
      >
        {renderBlobs()}
      </div>
    </>
  );
};

export default React.memo(FloatingBlobs); 