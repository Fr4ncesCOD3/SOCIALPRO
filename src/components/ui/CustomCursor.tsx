import React, { useEffect, useRef, useState, useCallback } from 'react';
import './CustomCursor.css';

interface CursorType {
  x: number;
  y: number;
  width: number;
  height: number;
}

const CustomCursor = () => {
  const cursorOuterRef = useRef<HTMLDivElement>(null);
  const cursorInnerRef = useRef<HTMLDivElement>(null);
  const cursorPositionRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
  const cursorTargetRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const isHoveringRef = useRef<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const isTouchDeviceRef = useRef<boolean>(false);

  // Configurazione del cursore
  const config = {
    lerp: 0.15, // Fattore di Linear Interpolation - più alto = più reattivo, meno fluido
    dotsTrail: 8, // Numero di puntini per l'effetto trail
    easing: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t, // Funzione di easing
  };

  // Funzione di LERP (Linear Interpolation) per fluidità
  const lerp = useCallback((start: number, end: number, factor: number): number => {
    return start * (1 - factor) + end * factor;
  }, []);

  // Gestisce il movimento del mouse
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      
      // Aggiorna la posizione target
      cursorTargetRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    },
    [isVisible]
  );

  // Gestisce l'hover su elementi interattivi
  const handleElementHover = useCallback(() => {
    isHoveringRef.current = true;
    document.body.classList.add('cursor-hover');
  }, []);

  // Gestisce l'uscita dall'hover
  const handleElementLeave = useCallback(() => {
    isHoveringRef.current = false;
    document.body.classList.remove('cursor-hover');
  }, []);

  // Aggiorna la posizione del cursore con LERP per movimenti fluidi
  const updateCursorPosition = useCallback(() => {
    // Applica LERP per ottenere movimento fluido
    cursorPositionRef.current = {
      x: lerp(cursorPositionRef.current.x, cursorTargetRef.current.x, config.lerp),
      y: lerp(cursorPositionRef.current.y, cursorTargetRef.current.y, config.lerp),
    };

    // Calcola la distanza per l'effetto magnetico
    const distX = cursorTargetRef.current.x - cursorPositionRef.current.x;
    const distY = cursorTargetRef.current.y - cursorPositionRef.current.y;
    
    if (cursorInnerRef.current && cursorOuterRef.current) {
      // Aggiorna la posizione del cursore interno (segue esattamente la posizione del mouse)
      cursorInnerRef.current.style.transform = `translate3d(${cursorTargetRef.current.x}px, ${
        cursorTargetRef.current.y
      }px, 0)`;
      
      // Aggiorna la posizione del cursore esterno (si muove con LERP per un effetto più fluido)
      cursorOuterRef.current.style.transform = `translate3d(${cursorPositionRef.current.x}px, ${
        cursorPositionRef.current.y
      }px, 0)`;

      // Aggiungi un leggero effetto di inclinazione basato sulla direzione
      const tiltX = distX * 0.05;
      const tiltY = distY * 0.05;
      cursorOuterRef.current.style.transform += ` rotateX(${tiltY}deg) rotateY(${-tiltX}deg)`;
    }

    // Continua l'animazione
    rafRef.current = requestAnimationFrame(updateCursorPosition);
  }, [lerp, config.lerp]);

  // Aggiungi gli eventi listeners
  useEffect(() => {
    // Verifica se è un dispositivo touch
    isTouchDeviceRef.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Non mostrare il cursore personalizzato su dispositivi touch
    if (isTouchDeviceRef.current) return;
    
    // Aggiungi listener per il mouse
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Aggiungi listener per gli elementi interattivi
    const interactiveElements = document.querySelectorAll('a, button, input, [role="button"], [data-cursor="interactive"]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleElementHover);
      el.addEventListener('mouseleave', handleElementLeave);
    });
    
    // Nascondi il cursore nativo
    document.body.classList.add('custom-cursor-active');
    
    // Inizia l'animazione
    rafRef.current = requestAnimationFrame(updateCursorPosition);
    
    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleElementHover);
        el.removeEventListener('mouseleave', handleElementLeave);
      });
      document.body.classList.remove('custom-cursor-active');
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleMouseMove, handleElementHover, handleElementLeave, updateCursorPosition]);

  // Non renderizzare nulla su dispositivi touch
  if (isTouchDeviceRef.current) return null;

  return (
    <div className={`cursor-container ${isVisible ? 'visible' : ''}`} aria-hidden="true">
      <div className="cursor-outer" ref={cursorOuterRef}>
        <svg viewBox="0 0 100 100">
          <circle className="cursor-circle" cx="50" cy="50" r="40" />
        </svg>
      </div>
      <div className="cursor-inner" ref={cursorInnerRef}></div>
    </div>
  );
};

export default CustomCursor; 