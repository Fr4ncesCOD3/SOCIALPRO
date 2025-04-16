import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { TrendingUp, Users, ThumbsUp, MessageSquare, Layers, Share2, Info, Award, BarChart, Zap, Globe } from 'lucide-react'
import NeuralParticles from '../ui/NeuralParticles'
import { useLanguage } from '../../contexts/LanguageContext'

// Registra i componenti Chart.js necessari
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface EngagementMetrics {
  followers: number;
  posts: number;
  avgLikes: number;
  avgComments: number;
  avgShares: number;
  avgSaves: number;
  platform: PlatformType;
}

type PlatformType = 'instagram' | 'facebook' | 'tiktok' | 'linkedin' | 'twitter';

interface BenchmarkData {
  platform: PlatformType;
  poor: number;
  average: number;
  good: number;
  excellent: number;
}

const EngagementSimulator: React.FC = () => {
  const { t, language } = useLanguage()
  
  // Riferimento per lo scroll al risultato
  const resultRef = useRef<HTMLDivElement>(null);

  // Stati base
  const [isOpen, setIsOpen] = useState(false)
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [platform, setPlatform] = useState<PlatformType>('instagram')
  const [isCalculating, setIsCalculating] = useState(false)
  
  // Metriche di engagement
  const [metrics, setMetrics] = useState<EngagementMetrics>({
    followers: 1000,
    posts: 30,
    avgLikes: 50,
    avgComments: 10,
    avgShares: 5,
    avgSaves: 8,
    platform: 'instagram'
  })
  
  // Risultati del calcolo
  const [engagementRate, setEngagementRate] = useState(0)
  const [engagementQuality, setEngagementQuality] = useState('')
  const [showResult, setShowResult] = useState(false)
  
  // Benchmark di engagement per piattaforma
  const benchmarkData: Record<PlatformType, BenchmarkData> = {
    instagram: { platform: 'instagram', poor: 1, average: 3, good: 6, excellent: 10 },
    facebook: { platform: 'facebook', poor: 0.5, average: 1, good: 3, excellent: 5 },
    tiktok: { platform: 'tiktok', poor: 2, average: 5, good: 10, excellent: 15 },
    linkedin: { platform: 'linkedin', poor: 0.5, average: 2, good: 4, excellent: 8 },
    twitter: { platform: 'twitter', poor: 0.3, average: 1, good: 3, excellent: 6 }
  }

  // Nuovo stato per il rilevamento del dispositivo mobile
  const [isMobile, setIsMobile] = useState(false);

  // Rileva se è un dispositivo mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Metodi per l'interazione e calcolo
  const handleInputChange = (field: keyof EngagementMetrics) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, parseInt(e.target.value) || 0)
    setMetrics(prev => ({ ...prev, [field]: value }))
  }

  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPlatform = e.target.value as PlatformType
    setPlatform(newPlatform)
    setMetrics(prev => ({ ...prev, platform: newPlatform }))
  }

  const calculateEngagement = () => {
    setIsCalculating(true)
    
    // Simula un calcolo complesso con un breve ritardo
    setTimeout(() => {
      // Calcolo ponderato dell'engagement rate basato sulla piattaforma
      let totalEngagement = 0;
      
      // Pesi diversi per interazioni diverse basate sulla piattaforma
      const weights = getPlatformWeights(metrics.platform);
      
      totalEngagement += metrics.avgLikes * weights.likes;
      totalEngagement += metrics.avgComments * weights.comments;
      
      if (showAdvancedOptions) {
        totalEngagement += metrics.avgShares * weights.shares;
        totalEngagement += metrics.avgSaves * weights.saves;
      }
      
      // Calcolo finale considerando follower e post
      const rate = (totalEngagement / (metrics.followers * metrics.posts)) * 100;
      const roundedRate = parseFloat(rate.toFixed(2));
      
      // Setta i risultati
      setEngagementRate(roundedRate);
      setEngagementQuality(getEngagementQuality(roundedRate, metrics.platform));
      setShowResult(true);
      setIsCalculating(false);
      
      // Scorri fino ai risultati
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }, 800);
  }
  
  const resetSimulator = () => {
    setMetrics({
      followers: 1000,
      posts: 30,
      avgLikes: 50,
      avgComments: 10,
      avgShares: 5,
      avgSaves: 8,
      platform: platform
    });
    setShowResult(false);
  }

  // Funzioni di utilità
  const getPlatformWeights = (platform: PlatformType) => {
    const weights = {
      instagram: { likes: 1, comments: 2, shares: 3, saves: 2.5 },
      facebook: { likes: 1, comments: 3, shares: 4, saves: 1 },
      tiktok: { likes: 1, comments: 2, shares: 5, saves: 3 },
      linkedin: { likes: 1, comments: 4, shares: 3, saves: 1.5 },
      twitter: { likes: 1, comments: 3, shares: 5, saves: 1 }
    };
    
    return weights[platform];
  }

  const getEngagementQuality = (rate: number, platform: PlatformType): string => {
    const benchmark = benchmarkData[platform];
    
    if (rate < benchmark.poor) return 'veryLow';
    if (rate < benchmark.average) return 'low';
    if (rate < benchmark.good) return 'average';
    if (rate < benchmark.excellent) return 'good';
    return 'excellent';
  }

  const getAdvice = () => {
    const quality = engagementQuality;
    const platformSpecific = getPlatformSpecificAdvice(platform);
    
    return {
      title: t(`marketing.simulator.results.quality.${quality}`),
      general: t(`marketing.simulator.results.advice.${quality}.general`),
      actions: [
        t(`marketing.simulator.results.advice.${quality}.actions.0`),
        t(`marketing.simulator.results.advice.${quality}.actions.1`),
        t(`marketing.simulator.results.advice.${quality}.actions.2`),
        t(`marketing.simulator.results.advice.${quality}.actions.3`)
      ],
      platformTip: platformSpecific
    };
  }

  const getPlatformSpecificAdvice = (platform: PlatformType): string => {
    return t(`marketing.simulator.results.platformSpecific.${platform}`);
  }

  // Dati per il grafico di benchmark
  const getBenchmarkChartData = () => {
    const benchmark = benchmarkData[platform];
    const labels = language === 'it' ? 
      ['Tuo Engagement', 'Basso', 'Medio', 'Buono', 'Eccellente'] :
      ['Your Engagement', 'Low', 'Average', 'Good', 'Excellent'];
    
    return {
      labels,
      datasets: [
        {
          label: t('marketing.simulator.results.chartLabel'),
          data: [engagementRate, benchmark.poor, benchmark.average, benchmark.good, benchmark.excellent],
          backgroundColor: [
            engagementRate < benchmark.poor ? 'rgba(239, 68, 68, 0.7)' : // red
            engagementRate < benchmark.average ? 'rgba(245, 158, 11, 0.7)' : // amber
            engagementRate < benchmark.good ? 'rgba(16, 185, 129, 0.7)' : // emerald
            engagementRate < benchmark.excellent ? 'rgba(59, 130, 246, 0.7)' : // blue
            'rgba(139, 92, 246, 0.7)', // purple
            'rgba(239, 68, 68, 0.5)',
            'rgba(245, 158, 11, 0.5)',
            'rgba(16, 185, 129, 0.5)',
            'rgba(139, 92, 246, 0.5)',
          ],
          borderColor: [
            engagementRate < benchmark.poor ? 'rgb(239, 68, 68)' : 
            engagementRate < benchmark.average ? 'rgb(245, 158, 11)' : 
            engagementRate < benchmark.good ? 'rgb(16, 185, 129)' : 
            engagementRate < benchmark.excellent ? 'rgb(59, 130, 246)' : 
            'rgb(139, 92, 246)',
            'rgb(239, 68, 68)',
            'rgb(245, 158, 11)',
            'rgb(16, 185, 129)',
            'rgb(139, 92, 246)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.raw}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: t('marketing.simulator.results.engagementRateLabel')
        }
      }
    }
  };

  return (
    <section id="engagement-simulator" className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
          initial={false}
          animate={isOpen ? { height: "auto" } : { height: isMobile ? "180px" : "220px" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {/* Header del simulatore */}
          <div 
            className={`p-4 md:p-8 cursor-pointer relative ${isOpen ? 'border-b border-gray-100' : 'bg-white'}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <NeuralParticles isOpen={isOpen} />
            
            <motion.div 
              className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4 relative z-10"
              animate={{ scale: isOpen ? 1 : 1.05 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <BarChart className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
                {isOpen ? t('marketing.simulator.title') : t('marketing.simulator.header')}
              </h2>
            </motion.div>
            
            {!isOpen && (
              <div className="text-center text-gray-600 mb-3 md:mb-5 text-sm md:text-base relative z-10">
                {t('marketing.simulator.subtitle')}
              </div>
            )}
            
            {!isOpen && (
              <motion.div 
                className="flex justify-center relative z-10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <button className="bg-blue-600 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-md flex items-center gap-2 text-sm md:text-base">
                  <Zap className="h-4 w-4 md:h-5 md:w-5" />
                  {t('marketing.simulator.startAnalysis')}
                </button>
              </motion.div>
            )}
          </div>
          
          {/* Corpo del simulatore (visibile solo quando aperto) */}
          {isOpen && (
            <div className="p-4 md:p-8">
              {/* Selezione piattaforma */}
              <div className="mb-6 md:mb-8">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
                  <Globe className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                  {t('marketing.simulator.platformSelection')}
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
                  {(["instagram", "facebook", "tiktok", "linkedin", "twitter"] as PlatformType[]).map((p) => (
                    <button
                      key={p}
                      className={`flex flex-col items-center justify-center p-2 md:p-4 rounded-xl border 
                        ${platform === p ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300 bg-white'} 
                        transition-all duration-200`}
                      onClick={() => {setPlatform(p); setMetrics(prev => ({...prev, platform: p}))}}
                      aria-label={p}
                    >
                      {p === 'instagram' && (
                        <svg
                          className="w-7 h-7 md:w-10 md:h-10 mb-1 md:mb-2 text-pink-600"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                        </svg>
                      )}
                      
                      {p === 'facebook' && (
                        <svg
                          className="w-7 h-7 md:w-10 md:h-10 mb-1 md:mb-2 text-blue-600"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                        </svg>
                      )}
                      
                      {p === 'tiktok' && (
                        <svg
                          className="w-7 h-7 md:w-10 md:h-10 mb-1 md:mb-2 text-black"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                          <path d="M16 8v4a4 4 0 0 1-4 4" />
                          <path d="M8.5 8a4 4 0 0 1 7.5-2.5" />
                          <path d="M21 8h-5" />
                          <path d="M15 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                        </svg>
                      )}
                      
                      {p === 'linkedin' && (
                        <svg
                          className="w-7 h-7 md:w-10 md:h-10 mb-1 md:mb-2 text-blue-700"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect width="4" height="12" x="2" y="9" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      )}
                      
                      {p === 'twitter' && (
                        <svg
                          className="w-7 h-7 md:w-10 md:h-10 mb-1 md:mb-2 text-blue-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                        </svg>
                      )}
                      <span className="text-xs md:text-sm font-medium capitalize">{p}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Metriche principali */}
              <div className="mb-4">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
                  <BarChart className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                  {t('marketing.simulator.metricsSection')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                  <div className="rounded-xl border border-gray-200 p-4 md:p-5 bg-white">
                    <div className="flex items-center gap-2 mb-3 md:mb-4 text-gray-700">
                      <Users className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                      <label className="block font-medium text-sm md:text-base">
                        {t('marketing.simulator.metrics.followers')}
                      </label>
                    </div>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={metrics.followers}
                      onChange={handleInputChange('followers')}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all text-base"
                      min="1"
                      placeholder={t('marketing.simulator.metrics.followers')}
                    />
                  </div>
                  
                  <div className="rounded-xl border border-gray-200 p-4 md:p-5 bg-white">
                    <div className="flex items-center gap-2 mb-3 md:mb-4 text-gray-700">
                      <Layers className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                      <label className="block font-medium text-sm md:text-base">
                        {t('marketing.simulator.metrics.postsPerMonth')}
                      </label>
                    </div>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={metrics.posts}
                      onChange={handleInputChange('posts')}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all text-base"
                      min="1"
                      placeholder={t('marketing.simulator.metrics.postsPerMonth')}
                    />
                  </div>
                  
                  <div className="rounded-xl border border-gray-200 p-4 md:p-5 bg-white">
                    <div className="flex items-center gap-2 mb-3 md:mb-4 text-gray-700">
                      <ThumbsUp className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                      <label className="block font-medium text-sm md:text-base">
                        {t('marketing.simulator.metrics.avgLikes')}
                      </label>
                    </div>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={metrics.avgLikes}
                      onChange={handleInputChange('avgLikes')}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all text-base"
                      min="0"
                      placeholder={t('marketing.simulator.metrics.avgLikes')}
                    />
                  </div>
                  
                  <div className="rounded-xl border border-gray-200 p-4 md:p-5 bg-white">
                    <div className="flex items-center gap-2 mb-3 md:mb-4 text-gray-700">
                      <MessageSquare className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                      <label className="block font-medium text-sm md:text-base">
                        {t('marketing.simulator.metrics.avgComments')}
                      </label>
                    </div>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={metrics.avgComments}
                      onChange={handleInputChange('avgComments')}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all text-base"
                      min="0"
                      placeholder={t('marketing.simulator.metrics.avgComments')}
                    />
                  </div>
                </div>
              </div>
              
              {/* Opzioni avanzate (espandibili) con stile mobile-friendly */}
              <div className="mb-6 md:mb-8">
                <button 
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 transition-colors text-sm md:text-base"
                  aria-expanded={showAdvancedOptions}
                >
                  <span>{showAdvancedOptions ? t('marketing.simulator.advancedOptions.hide') : t('marketing.simulator.advancedOptions.show')}</span>
                  <svg 
                    className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 ${showAdvancedOptions ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <AnimatePresence>
                  {showAdvancedOptions && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div className="rounded-xl border border-gray-200 p-5 bg-white">
                          <div className="flex items-center gap-2 mb-4 text-gray-700">
                            <Share2 className="h-5 w-5 text-blue-500" />
                            <label className="block font-medium">
                              {t('marketing.simulator.metrics.avgShares')}
                            </label>
                          </div>
                          <input
                            type="number"
                            value={metrics.avgShares}
                            onChange={handleInputChange('avgShares')}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all"
                            min="0"
                            placeholder={t('marketing.simulator.metrics.avgShares')}
                          />
                        </div>
                        
                        <div className="rounded-xl border border-gray-200 p-5 bg-white">
                          <div className="flex items-center gap-2 mb-4 text-gray-700">
                            <Bookmark className="h-5 w-5 text-blue-500" />
                            <label className="block font-medium">
                              {t('marketing.simulator.metrics.avgSaves')}
                            </label>
                          </div>
                          <input
                            type="number"
                            value={metrics.avgSaves}
                            onChange={handleInputChange('avgSaves')}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all"
                            min="0"
                            placeholder={t('marketing.simulator.metrics.avgSaves')}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4 bg-blue-50 rounded-lg p-4 text-sm text-blue-700 flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium mb-1">{t('marketing.simulator.advancedOptions.importance.title')}</p>
                          <p>{t('marketing.simulator.advancedOptions.importance.description').replace('{platform}', platform)}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Pulsanti azione */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                <motion.button
                  onClick={calculateEngagement}
                  className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isCalculating}
                >
                  {isCalculating ? (
                    <>
                      <svg className="animate-spin h-4 w-4 md:h-5 md:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>{t('marketing.simulator.calculating')}</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
                      <span>{t('marketing.simulator.calculateButton')}</span>
                    </>
                  )}
                </motion.button>
                
                <button
                  onClick={resetSimulator}
                  className="w-full sm:w-auto border border-gray-300 bg-white text-gray-700 font-medium py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  {t('marketing.simulator.resetButton')}
                </button>
              </div>
              
              {/* Risultati con miglioramenti per mobile */}
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    ref={resultRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="mt-8 md:mt-10 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-4 md:p-8 border border-blue-100"
                  >
                    <h3 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-4 md:mb-6 flex items-center justify-center gap-2">
                      <Award className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                      {t('marketing.simulator.results.title')}
                    </h3>
                    
                    {/* Indicatore percentuale ridimensionato per mobile */}
                    <div className="flex justify-center mb-6 md:mb-8">
                      <div className="relative">
                        <motion.div 
                          className={`w-32 h-32 md:w-44 md:h-44 rounded-full flex items-center justify-center
                            ${engagementQuality === 'veryLow' ? 'bg-red-100 text-red-800' : 
                              engagementQuality === 'low' ? 'bg-orange-100 text-orange-800' : 
                              engagementQuality === 'average' ? 'bg-green-100 text-green-800' : 
                              engagementQuality === 'good' ? 'bg-blue-100 text-blue-800' : 
                              'bg-purple-100 text-purple-800'}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                        >
                          <div className="text-center">
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 }}
                              className="text-4xl md:text-6xl font-bold"
                            >
                              {engagementRate}%
                            </motion.div>
                            <div className="text-xs md:text-sm font-medium mt-1 capitalize">
                              {t(`marketing.simulator.results.quality.${engagementQuality}`)}
                            </div>
                          </div>
                        </motion.div>
                        
                        <motion.div
                          className="absolute inset-0 rounded-full border-4 border-transparent"
                          initial={{ borderColor: 'rgba(59, 130, 246, 0)', rotate: 0 }}
                          animate={{ 
                            borderColor: [
                              'rgba(59, 130, 246, 0)',
                              engagementQuality === 'veryLow' ? 'rgba(239, 68, 68, 0.3)' : 
                              engagementQuality === 'low' ? 'rgba(245, 158, 11, 0.3)' : 
                              engagementQuality === 'average' ? 'rgba(16, 185, 129, 0.3)' : 
                              engagementQuality === 'good' ? 'rgba(59, 130, 246, 0.3)' : 
                              'rgba(139, 92, 246, 0.3)'
                            ],
                            rotate: 360 
                          }}
                          transition={{ 
                            duration: 1.5,
                            delay: 0.2,
                            ease: "easeInOut"
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Grafico benchmark con altezza responsiva */}
                    <div className="mb-6 md:mb-8">
                      <h4 className="text-base md:text-lg font-semibold text-gray-800 mb-2 md:mb-3">
                        {t('marketing.simulator.results.benchmarkTitle').replace('{platform}', platform)}
                      </h4>
                      <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200">
                        <div className="h-48 md:h-64">
                          <Bar data={getBenchmarkChartData()} options={{
                            ...chartOptions,
                            maintainAspectRatio: false,
                            responsive: true,
                            plugins: {
                              ...chartOptions.plugins,
                              legend: {
                                display: false
                              }
                            },
                            scales: {
                              ...chartOptions.scales,
                              y: {
                                ...chartOptions.scales.y,
                                title: {
                                  ...chartOptions.scales.y.title,
                                  display: !isMobile,  // Nascondi titolo su mobile
                                }
                              }
                            }
                          }} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Consigli miglioramento con stile mobile-friendly */}
                    <div className="mt-6 md:mt-8">
                      <h4 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-3 flex items-center gap-2">
                        <Zap className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                        {getAdvice().title}
                      </h4>
                      <p className="text-sm md:text-base text-gray-700 mb-4 md:mb-5">{getAdvice().general}</p>
                      
                      <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h5 className="font-medium text-gray-800 mb-3">{t('marketing.simulator.results.actionsTitle')}</h5>
                        <ul className="space-y-3">
                          {getAdvice().actions.map((action, index) => (
                            <li key={index} className="flex gap-3">
                              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                                {index + 1}
                              </div>
                              <div className="text-gray-700">{action}</div>
                            </li>
                          ))}
                          <li className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                              5
                            </div>
                            <div className="text-gray-700">{getAdvice().platformTip}</div>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    {/* Pulsante consultazione adattato a mobile */}
                    <div className="mt-8 md:mt-10 text-center">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all hover:shadow-xl hover:from-blue-700 hover:to-indigo-700"
                      >
                        {t('marketing.simulator.results.consultationButton')}
                      </motion.button>
                      <p className="text-xs md:text-sm text-gray-500 mt-2">{t('marketing.simulator.results.consultationSubtext')}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

// Componente Bookmark (importato da Lucide)
const Bookmark: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
  </svg>
);

export default EngagementSimulator