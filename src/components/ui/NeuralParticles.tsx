import React, { useEffect, useRef } from 'react'

interface NeuralParticlesProps {
  isOpen: boolean;
}

// Definizione della classe Particle per TypeScript
interface ParticleProps {
  x: number;
  y: number;
  size: number;
  baseSize: number;
  speedX: number;
  speedY: number;
  color: string;
  update: () => void;
  draw: () => void;
}

const NeuralParticles: React.FC<NeuralParticlesProps> = ({ isOpen }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const particlesArrayRef = useRef<ParticleProps[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    // Ottimizzazione: utilizzo devicePixelRatio per display retina
    const dpr = window.devicePixelRatio || 1;
    
    // Impostazione delle dimensioni del canvas
    const resizeCanvas = () => {
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    }
    
    resizeCanvas();
    
    // Throttle del resize event per performance
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 200);
    }
    
    window.addEventListener('resize', handleResize);

    // Creazione delle particelle
    const numberOfParticles = Math.min(30, window.innerWidth / 40); // Ridotto e adattivo

    class Particle implements ParticleProps {
      x: number;
      y: number;
      size: number;
      baseSize: number;
      speedX: number;
      speedY: number;
      color: string;
      
      constructor() {
        // Non-null assertion: abbiamo già verificato che canvas non è null
        this.x = Math.random() * (canvas!.width / dpr);
        this.y = Math.random() * (canvas!.height / dpr);
        this.size = Math.random() * 4 + 1;
        this.baseSize = this.size;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        // Ottimizzazione: pre-calcolo del colore HSL
        this.color = `hsl(${Math.floor(Math.random() * 360)}, 50%, 50%)`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Riduzione condizionale della dimensione
        if (this.size > 0.3) this.size -= 0.05;

        // Logica di confine ottimizzata
        // Non-null assertion: abbiamo già verificato che canvas non è null
        const width = canvas!.width / dpr;
        const height = canvas!.height / dpr;
        
        if (this.x < 0) {
          this.x = 0;
          this.speedX *= -1;
        } else if (this.x > width) {
          this.x = width;
          this.speedX *= -1;
        }
        
        if (this.y < 0) {
          this.y = 0;
          this.speedY *= -1;
        } else if (this.y > height) {
          this.y = height;
          this.speedY *= -1;
        }
      }

      draw() {
        // Non-null assertion: abbiamo già verificato che ctx non è null
        const context = ctx!;
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
      }
    }

    function init() {
      particlesArrayRef.current = [];
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArrayRef.current.push(new Particle());
      }
    }

    let lastTime = 0;
    const fps = 60;
    const interval = 1000 / fps;
    
    function animate(timestamp: number) {
      if (!isOpen) {
        const deltaTime = timestamp - lastTime;
        
        if (deltaTime >= interval) {
          // Non-null assertions: abbiamo già verificato che canvas e ctx non sono null
          ctx!.clearRect(0, 0, canvas!.width / dpr, canvas!.height / dpr);
          
          const particles = particlesArrayRef.current;
          for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
          }
          
          lastTime = timestamp - (deltaTime % interval);
        }
        
        animationRef.current = requestAnimationFrame(animate);
      }
    }

    init();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isOpen]);

  return (
    <div className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
    </div>
  );
};

export default NeuralParticles;
