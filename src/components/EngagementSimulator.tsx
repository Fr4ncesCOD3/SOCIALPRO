import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NeuralParticles from './NeuralParticles'

const EngagementSimulator = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [followers, setFollowers] = useState(1000)
  const [posts, setPosts] = useState(30)
  const [avgLikes, setAvgLikes] = useState(50)
  const [avgComments, setAvgComments] = useState(10)
  const [engagementRate, setEngagementRate] = useState(0)

  useEffect(() => {
    const calculateEngagement = () => {
      const totalEngagement = (avgLikes + avgComments) * posts
      const rate = (totalEngagement / (followers * posts)) * 100
      setEngagementRate(parseFloat(rate.toFixed(2)))
    }

    calculateEngagement()
  }, [followers, posts, avgLikes, avgComments])

  const handleInputChange = (setter) => (e) => {
    const value = Math.max(0, parseInt(e.target.value) || 0)
    setter(value)
  }

  const getAdvice = () => {
    if (engagementRate < 1) {
      return "Il tuo engagement rate è molto basso. Prova a interagire di più con i tuoi follower e a creare contenuti più coinvolgenti."
    } else if (engagementRate < 3) {
      return "Il tuo engagement rate è nella media. Continua a migliorare la qualità dei tuoi contenuti e a interagire con la tua audience."
    } else if (engagementRate < 6) {
      return "Ottimo lavoro! Il tuo engagement rate è sopra la media. Continua così e cerca di mantenere questa performance."
    } else {
      return "Fantastico! Il tuo engagement rate è eccezionale. Analizza cosa sta funzionando bene e replica queste strategie."
    }
  }

  return (
    <section id="engagement-simulator" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
          initial={false}
          animate={isOpen ? { height: "auto" } : { height: "200px" }}
          transition={{ duration: 0.3 }}
        >
          <div 
            className={`p-8 cursor-pointer relative ${isOpen ? '' : 'bg-white'}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <NeuralParticles isOpen={isOpen} />
            <h2 className="text-3xl font-bold text-center mb-4 relative z-10">
              {isOpen ? "Simulatore di Engagement" : "Prova EngagementPro"}
            </h2>
            {!isOpen && (
              <div className="flex justify-center relative z-10">
                <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300">
                  Espandi il simulatore
                </button>
              </div>
            )}
          </div>
          {isOpen && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {[
                  { label: 'Followers', value: followers, setter: setFollowers },
                  { label: 'Numero di post nell\'ultimo mese', value: posts, setter: setPosts },
                  { label: 'Media Like per Post', value: avgLikes, setter: setAvgLikes },
                  { label: 'Media Commenti per Post', value: avgComments, setter: setAvgComments }
                ].map(({ label, value, setter }) => (
                  <div key={label}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {label}
                    </label>
                    <input
                      type="number"
                      value={value}
                      onChange={handleInputChange(setter)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      min="0"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Engagement Rate Previsto</h3>
                <div className="flex items-center justify-center">
                  <motion.div 
                    className="bg-blue-500 rounded-full flex items-center justify-center text-white font-bold"
                    initial={{ scale: 0, width: 0, height: 0 }}
                    animate={{ 
                      scale: 1,
                      width: `${Math.max(30, Math.min(engagementRate * 10, 300))}px`,
                      height: `${Math.max(30, Math.min(engagementRate * 10, 300))}px`,
                    }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <motion.span
                      key={engagementRate}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.3 }}
                      className="text-4xl"
                    >
                      {engagementRate}%
                    </motion.span>
                  </motion.div>
                </div>
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Consigli</h4>
                  <p className="text-gray-600">{getAdvice()}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default EngagementSimulator