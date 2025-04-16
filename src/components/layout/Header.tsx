import React, { useEffect, useRef, useCallback, memo, useState, useMemo, lazy, Suspense } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Header.css';
import FloatingBlobs from '../ui/FloatingBlobs';
import { useLanguage } from '../../contexts/LanguageContext';

interface HeaderProps {
  onCtaClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCtaClick }) => {
  const blobsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isReducedMotion = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [isVisible, setIsVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();

  // Preparazione per TypeAnimation - si aspetta una sequenza piatta
  const animatedSlogans = useMemo(() => {
    return [
      t('header.animatedSlogans.line1'), 2000, // Linea 1 + pausa
      t('header.animatedSlogans.line2'), 2000, // Linea 2 + pausa
      t('header.animatedSlogans.line3'), 2000, // Linea 3 + pausa
      t('header.animatedSlogans.line4'), 2000, // Linea 4 + pausa
      t('header.animatedSlogans.line5'), 2000, // Linea 5 + pausa
      t('header.animatedSlogans.line6'), 2000, // Linea 6 + pausa
    ];
  }, [t, language]); // Ricalcola quando cambia la lingua o t

  // Colori per i metaball che si combinano in modo fluido
  const metaballColors = useMemo(() => [
    'rgba(76, 29, 149, 0.6)',  // Viola
    'rgba(59, 130, 246, 0.6)', // Blu
    'rgba(236, 72, 153, 0.6)', // Rosa
    'rgba(16, 185, 129, 0.6)'  // Verde
  ], []);

  useEffect(() => {
    // Aggiungiamo listener per reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion.current = e.matches;
    };
    mediaQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      mediaQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);

  const handleButtonClick = useCallback(() => {
    // Trova l'elemento del form nel footer
    const footerForm = document.getElementById('footer-form');
    if (footerForm) {
      // Utilizziamo scrollIntoView con behavior smooth
      footerForm.scrollIntoView({ 
        behavior: isReducedMotion.current ? 'auto' : 'smooth',
        block: 'start' 
      });
    }
    // Chiama anche la funzione onCtaClick passata come prop
    onCtaClick();
  }, [onCtaClick]);

  // Colori principali del sito
  const siteColors = [
    '#1D4ED8', // Blu principale
    '#3b5bdb', // Blu secondario
    '#74b9ff', // Blu chiaro
    '#0984e3', // Azzurro
    '#4c6ef5', // Indaco
    '#5f3dc4', // Viola
    '#7950f2', // Viola chiaro
    '#12b886', // Verde acqua
    '#40c057', // Verde
    '#82c91e'  // Verde lime
  ];

  // Ottimizza LCP con loading anticipato
  useEffect(() => {
    // Impostare come visibile dopo il primo render
    setIsVisible(true);
    
    // Precarica immagini critiche
    const preloadImages = () => {
      const images = document.querySelectorAll('.floating-blob');
      if (images.length > 0) {
        images.forEach(img => {
          if (img instanceof HTMLElement) {
            img.style.content = 'loaded';
          }
        });
      }
    };
    
    preloadImages();
    
    // Rimuovere eventuali animazioni dopo il caricamento iniziale
    const timer = setTimeout(() => {
      if (headerRef.current) {
        headerRef.current.classList.add('loaded');
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <header 
      className={`header-container ${isVisible ? 'visible' : 'hidden'}`} 
      ref={headerRef}
      style={{ 
        willChange: 'transform', 
        contentVisibility: 'auto'
      }}
    >
      <div ref={blobsRef} className="absolute inset-0 z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" version="1.1">
          <defs>
            {/* Filtro standard per desktop */}
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
            
            {/* Filtro ottimizzato per dispositivi mobili - meno intenso */}
            <filter id="goo-mobile">
              <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 15 -5" result="goo" />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
            
            {/* Filtro per l'effetto di divisione */}
            <filter id="turbulence" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.005 0.003" numOctaves="1" seed="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>
        <div className="blobs">
          {/* Blob primari che si muovono e si fondono */}
          <div className="metaballs-container">
            <div className="metaball metaball-1" style={{ background: metaballColors[0] }}></div>
            <div className="metaball metaball-2" style={{ background: metaballColors[1] }}></div>
            <div className="metaball metaball-3" style={{ background: metaballColors[2] }}></div>
            <div className="metaball metaball-4" style={{ background: metaballColors[3] }}></div>
          </div>
          
          {/* Blob fissi di grandi dimensioni */}
          <div className="fixed-blobs">
            <div 
              className="fixed-blob" 
              style={{
                width: '500px',
                height: '500px',
                left: '15%',
                top: '20%',
                background: `radial-gradient(circle at center, ${siteColors[0]} 0%, rgba(29, 78, 216, 0) 70%)`,
                filter: 'blur(60px)',
                opacity: 0.6,
                mixBlendMode: 'screen',
                animation: 'moveBlob1 40s infinite alternate'
              }}
            ></div>
            <div 
              className="fixed-blob" 
              style={{
                width: '450px',
                height: '450px',
                right: '20%',
                top: '30%',
                background: `radial-gradient(circle at center, ${siteColors[5]} 0%, rgba(95, 61, 196, 0) 70%)`,
                filter: 'blur(60px)',
                opacity: 0.6,
                mixBlendMode: 'screen',
                animation: 'moveBlob2 45s infinite alternate-reverse'
              }}
            ></div>
          </div>
          
          {/* Blob dinamici che riempiono lo spazio */}
          <FloatingBlobs 
            count={12} 
            minSize={120} 
            maxSize={280} 
            opacityVariation={0.7}
            colors={siteColors}
            enableBlending={true}
            density={1.5}
            className="blobs"
          />
        </div>
      </div>

      <div ref={contentRef} className="relative z-10 flex flex-col items-center">
        <h1 
          ref={titleRef} 
          className="text-5xl md:text-7xl font-bold mb-4 text-center interactive-text"
        >
          Social<span className="text-blue-400">Pro</span>
        </h1>
        <div 
          ref={subtitleRef} 
          className="h-20 mb-8 interactive-text"
          aria-label="Slogan animato SocialPro" // Migliora accessibilità
        >
          <TypeAnimation
            sequence={animatedSlogans}
            wrapper="p"
            speed={50}
            className="text-xl md:text-2xl text-center"
            repeat={Infinity}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            ref={buttonRef}
            onClick={handleButtonClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 interactive-button"
          >
            {t('header.startNow')}
          </button>
          <button
            className="bg-transparent border-2 border-blue-400 text-blue-100 hover:text-white hover:border-white font-bold py-3 px-8 rounded-lg transition duration-300 interactive-button"
            onClick={() => {
              // Navigare ai servizi
              window.location.href = '/servizi';
            }}
          >
            {t('header.discoverServices')}
          </button>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);