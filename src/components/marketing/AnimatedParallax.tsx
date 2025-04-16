import React, { memo, useMemo } from 'react';
import { motion, LazyMotion, domAnimation, m } from 'framer-motion';
import { FaChartLine, FaRobot, FaUserFriends, FaTrophy, FaHeadset } from 'react-icons/fa';
import df from '../../assets/images/df.jpg';

// Componente ottimizzato per ogni feature
const Feature = memo(({ icon: Icon, text, index }: { icon: React.ElementType, text: string, index: number }) => {
  return (
    <m.div 
      key={index}
      className="flex items-center space-x-3"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Icon className="text-2xl text-blue-300" />
      <span>{text}</span>
    </m.div>
  );
});

Feature.displayName = 'Feature';

// Componente ottimizzato per le forme animate
const AnimatedShape = memo(({ index }: { index: number }) => {
  const style = useMemo(() => {
    return {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      willChange: 'transform, opacity',
    };
  }, []);
  
  const shapeClass = useMemo(() => {
    return `animated-shape ${
      index % 3 === 0 ? 'shape-circle' : index % 3 === 1 ? 'shape-square' : 'shape-triangle'
    }`;
  }, [index]);
  
  return <div className={shapeClass} style={style} />;
});

AnimatedShape.displayName = 'AnimatedShape';

const AnimatedParallax = () => {
  const features = useMemo(() => [
    { icon: FaChartLine, text: "Expertise in social media marketing" },
    { icon: FaRobot, text: "AI-powered analytics and insights" },
    { icon: FaUserFriends, text: "Tailored strategies for your brand" },
    { icon: FaTrophy, text: "Proven track record of success" },
    { icon: FaHeadset, text: "24/7 dedicated support team" }
  ], []);

  const shapes = useMemo(() => 
    Array.from({ length: 8 }, (_, index) => (
      <AnimatedShape key={index} index={index} />
    )), []);

  return (
    <LazyMotion features={domAnimation}>
      <section className="py-20 overflow-hidden relative text-white">
        <div className="absolute inset-0 bg-gradient-animate" style={{ willChange: 'background-position' }}></div>
        <div className="absolute inset-0 bg-black opacity-30"></div>
        
        {shapes}
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <m.div 
              className="md:w-1/2 mb-8 md:mb-0"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-white">Why Choose SocialPro?</h2>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <Feature 
                    key={index}
                    icon={feature.icon} 
                    text={feature.text} 
                    index={index}
                  />
                ))}
              </div>
            </m.div>
            
            <m.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src={df} 
                alt="Social Media Marketing" 
                className="rounded-lg shadow-2xl"
                loading="lazy"
                width="675"
                height="450"
                style={{ aspectRatio: '675/450' }}
              />
            </m.div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
};

export default memo(AnimatedParallax);
