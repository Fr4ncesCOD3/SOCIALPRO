import React from 'react'
import { motion } from 'framer-motion'
import { FaChartLine, FaRobot, FaUserFriends, FaTrophy, FaHeadset } from 'react-icons/fa'

const AnimatedParallax = () => {
  const features = [
    { icon: FaChartLine, text: "Expertise in social media marketing" },
    { icon: FaRobot, text: "AI-powered analytics and insights" },
    { icon: FaUserFriends, text: "Tailored strategies for your brand" },
    { icon: FaTrophy, text: "Proven track record of success" },
    { icon: FaHeadset, text: "24/7 dedicated support team" }
  ]

  return (
    <section className="py-20 overflow-hidden relative text-white">
      <div className="absolute inset-0 bg-gradient-animate"></div>
      <div className="absolute inset-0 bg-black opacity-30"></div>
      {[...Array(10)].map((_, index) => (
        <div
          key={index}
          className={`animated-shape ${
            index % 3 === 0 ? 'shape-circle' : index % 3 === 1 ? 'shape-square' : 'shape-triangle'
          }`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        ></div>
      ))}
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            className="md:w-1/2 mb-8 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-white">Why Choose SocialPro?</h2>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <feature.icon className="text-2xl text-blue-300" />
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
              alt="Social Media Marketing" 
              className="rounded-lg shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AnimatedParallax
