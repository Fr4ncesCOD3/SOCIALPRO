import React, { useEffect, useRef } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { ArrowRight } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  onCtaClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCtaClick }) => {
  const cursorBlobRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const blobsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (cursorBlobRef.current) {
        const { clientX, clientY } = event;
        const blob = cursorBlobRef.current;
        const blobRect = blob.getBoundingClientRect();
        const blobCenterX = blobRect.width / 2;
        const blobCenterY = blobRect.height / 2;

        blob.style.left = `${clientX - blobCenterX}px`;
        blob.style.top = `${clientY - blobCenterY}px`;
      }
    };

    const handleBlobCollision = () => {
      const blobs = blobsRef.current?.querySelectorAll('.blob:not(.cursor-blob)');
      const content = contentRef.current;
      if (!content || !blobs) return;

      const contentRect = content.getBoundingClientRect();

      blobs.forEach((blob) => {
        const blobElement = blob as HTMLElement;
        const blobRect = blobElement.getBoundingClientRect();

        const distanceX = Math.max(contentRect.left - blobRect.right, blobRect.left - contentRect.right, 0);
        const distanceY = Math.max(contentRect.top - blobRect.bottom, blobRect.top - contentRect.bottom, 0);
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        const maxDistance = 150; // Aumentato per un effetto più graduale
        const scale = Math.min(distance / maxDistance, 1);

        if (scale < 1) {
          const centerX = (blobRect.left + blobRect.right) / 2;
          const centerY = (blobRect.top + blobRect.bottom) / 2;
          const angle = Math.atan2(centerY - (contentRect.top + contentRect.bottom) / 2, centerX - (contentRect.left + contentRect.right) / 2);
          
          const squishX = Math.cos(angle) * (1 - scale);
          const squishY = Math.sin(angle) * (1 - scale);

          blobElement.style.transform = `scale(${1 - 0.3 * (1 - scale)}) translate(${squishX * 30}px, ${squishY * 30}px)`;
        } else {
          blobElement.style.transform = 'scale(1) translate(0, 0)';
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    const intervalId = setInterval(handleBlobCollision, 50);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(intervalId);
    };
  }, []);

  const handleButtonClick = () => {
    // Trova l'elemento del form nel footer
    const footerForm = document.getElementById('footer-form');
    if (footerForm) {
      // Scorri fino al form
      footerForm.scrollIntoView({ behavior: 'smooth' });
    }
    // Chiama anche la funzione onCtaClick passata come prop
    onCtaClick();
  };

  return (
    <header className="relative bg-black text-white min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      <div ref={blobsRef} className="absolute inset-0 z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" version="1.1">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            </filter>
          </defs>
        </svg>
        <div className="blobs">
          {[...Array(15)].map((_, index) => (
            <div key={index} className={`blob blob-${index + 1}`}></div>
          ))}
          <div ref={cursorBlobRef} className="blob cursor-blob"></div>
        </div>
      </div>

      <div ref={contentRef} className="relative z-10 flex flex-col items-center">
        <h1 ref={titleRef} className="text-5xl md:text-7xl font-bold mb-4 text-center interactive-text">
          SocialPro
        </h1>
        <div ref={subtitleRef} className="h-20 mb-8 interactive-text">
          <TypeAnimation
            sequence={[
              'Elevate Your Digital Presence',
              2000,
              'Boost Your Online Engagement',
              2000,
              'Maximize Your Social Impact',
              2000,
              'Transform Your Brand Strategy',
              2000,
              'Amplify Your Reach',
              2000,
              'Revolutionize Your Social Media',
              2000,
            ]}
            wrapper="p"
            speed={50}
            className="text-xl md:text-2xl text-center"
            repeat={Infinity}
          />
        </div>
        <button
          ref={buttonRef}
          onClick={handleButtonClick}
          className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-blue-100 transition duration-300 flex items-center interactive-button"
        >
          Get Started <ArrowRight className="ml-2" />
        </button>
      </div>
    </header>
  );
};

export default Header;