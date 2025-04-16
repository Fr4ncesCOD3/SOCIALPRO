import React, { useState, useEffect } from 'react'
import { BarChart, Globe, Share2, Users, TrendingUp, Zap, BellRing, Target, LayoutGrid, Megaphone } from 'lucide-react'
import { Chart } from 'react-chartjs-2'
import { ChartData, ChartOptions } from 'chart.js'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../../contexts/LanguageContext'

interface ServiceItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string;
  features: string[];
}

type ChartDataType = ChartData<'bar'> | null;

const ServicesOverview: React.FC = () => {
  const [activeService, setActiveService] = useState<number | null>(null)
  const [chartData, setChartData] = useState<ChartDataType>(null)
  const { t, language } = useLanguage()

  const services: ServiceItem[] = [
    {
      icon: <BarChart className="h-12 w-12 text-blue-500" />,
      title: t('marketing.services.cards.analysis.title'),
      description: t('marketing.services.cards.analysis.description'),
      details: t('marketing.services.cards.analysis.details'),
      features: [
        t('marketing.services.cards.analysis.features.0'),
        t('marketing.services.cards.analysis.features.1'),
        t('marketing.services.cards.analysis.features.2'),
        t('marketing.services.cards.analysis.features.3'),
        t('marketing.services.cards.analysis.features.4')
      ]
    },
    {
      icon: <Share2 className="h-12 w-12 text-purple-500" />,
      title: t('marketing.services.cards.contentStrategy.title'),
      description: t('marketing.services.cards.contentStrategy.description'),
      details: t('marketing.services.cards.contentStrategy.details'),
      features: [
        t('marketing.services.cards.contentStrategy.features.0'),
        t('marketing.services.cards.contentStrategy.features.1'),
        t('marketing.services.cards.contentStrategy.features.2'),
        t('marketing.services.cards.contentStrategy.features.3'),
        t('marketing.services.cards.contentStrategy.features.4')
      ]
    },
    {
      icon: <Users className="h-12 w-12 text-green-500" />,
      title: t('marketing.services.cards.communityManagement.title'),
      description: t('marketing.services.cards.communityManagement.description'),
      details: t('marketing.services.cards.communityManagement.details'),
      features: [
        t('marketing.services.cards.communityManagement.features.0'),
        t('marketing.services.cards.communityManagement.features.1'),
        t('marketing.services.cards.communityManagement.features.2'),
        t('marketing.services.cards.communityManagement.features.3'),
        t('marketing.services.cards.communityManagement.features.4')
      ]
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-red-500" />,
      title: t('marketing.services.cards.growthHacking.title'),
      description: t('marketing.services.cards.growthHacking.description'),
      details: t('marketing.services.cards.growthHacking.details'),
      features: [
        t('marketing.services.cards.growthHacking.features.0'),
        t('marketing.services.cards.growthHacking.features.1'),
        t('marketing.services.cards.growthHacking.features.2'),
        t('marketing.services.cards.growthHacking.features.3'),
        t('marketing.services.cards.growthHacking.features.4')
      ]
    },
    {
      icon: <Zap className="h-12 w-12 text-yellow-500" />,
      title: t('marketing.services.cards.socialAutomation.title'),
      description: t('marketing.services.cards.socialAutomation.description'),
      details: t('marketing.services.cards.socialAutomation.details'),
      features: [
        t('marketing.services.cards.socialAutomation.features.0'),
        t('marketing.services.cards.socialAutomation.features.1'),
        t('marketing.services.cards.socialAutomation.features.2'),
        t('marketing.services.cards.socialAutomation.features.3'),
        t('marketing.services.cards.socialAutomation.features.4')
      ]
    },
    {
      icon: <Globe className="h-12 w-12 text-teal-500" />,
      title: t('marketing.services.cards.globalBrand.title'),
      description: t('marketing.services.cards.globalBrand.description'),
      details: t('marketing.services.cards.globalBrand.details'),
      features: [
        t('marketing.services.cards.globalBrand.features.0'),
        t('marketing.services.cards.globalBrand.features.1'),
        t('marketing.services.cards.globalBrand.features.2'),
        t('marketing.services.cards.globalBrand.features.3'),
        t('marketing.services.cards.globalBrand.features.4')
      ]
    },
    {
      icon: <Target className="h-12 w-12 text-indigo-500" />,
      title: t('marketing.services.cards.advertising.title'),
      description: t('marketing.services.cards.advertising.description'),
      details: t('marketing.services.cards.advertising.details'),
      features: [
        t('marketing.services.cards.advertising.features.0'),
        t('marketing.services.cards.advertising.features.1'),
        t('marketing.services.cards.advertising.features.2'),
        t('marketing.services.cards.advertising.features.3'),
        t('marketing.services.cards.advertising.features.4')
      ]
    },
    {
      icon: <LayoutGrid className="h-12 w-12 text-pink-500" />,
      title: t('marketing.services.cards.contentProduction.title'),
      description: t('marketing.services.cards.contentProduction.description'),
      details: t('marketing.services.cards.contentProduction.details'),
      features: [
        t('marketing.services.cards.contentProduction.features.0'),
        t('marketing.services.cards.contentProduction.features.1'),
        t('marketing.services.cards.contentProduction.features.2'),
        t('marketing.services.cards.contentProduction.features.3'),
        t('marketing.services.cards.contentProduction.features.4')
      ]
    },
    {
      icon: <Megaphone className="h-12 w-12 text-orange-500" />,
      title: t('marketing.services.cards.influencerMarketing.title'),
      description: t('marketing.services.cards.influencerMarketing.description'),
      details: t('marketing.services.cards.influencerMarketing.details'),
      features: [
        t('marketing.services.cards.influencerMarketing.features.0'),
        t('marketing.services.cards.influencerMarketing.features.1'),
        t('marketing.services.cards.influencerMarketing.features.2'),
        t('marketing.services.cards.influencerMarketing.features.3'),
        t('marketing.services.cards.influencerMarketing.features.4')
      ]
    }
  ]

  // Opzioni ottimizzate per il grafico secondo le best practice 2025
  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    layout: {
      padding: {
        top: 10,
        right: 25,
        bottom: 10,
        left: 25
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 13
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}%`;
          }
        }
      }
    }
  }

  useEffect(() => {
    // Carica i dati del grafico solo quando un servizio è attivo
    if (activeService !== null) {
    const fetchChartData = async () => {
        // In una vera applicazione, questa sarebbe una chiamata API
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Dati personalizzati per ogni servizio
        const baseDataBefore = [65, 59, 80, 81];
        const baseDataAfter = [95, 89, 110, 121];
        
        // Aggiungere una variazione casuale ma coerente per ogni servizio
        const serviceVariation = (activeService + 1) * 5;
        const adjustedDataBefore = baseDataBefore.map(val => 
          Math.max(40, Math.min(85, val + (Math.random() * 10 - 5) - serviceVariation % 15))
        );
        const adjustedDataAfter = baseDataAfter.map(val => 
          Math.max(80, Math.min(130, val + (Math.random() * 15 - 5) + serviceVariation % 20))
        );
        
        // Labels personalizzati per ogni servizio
        const labelsMap: {[key: number]: string[]} = {
          0: ['Engagement', 'Reach', 'Conversions', 'ROI'],
          1: ['Interazioni', 'Condivisioni', 'Conversioni', 'ROI'],
          2: ['Membri Attivi', 'Interazioni', 'Fidelizzazione', 'Brand Awareness'],
          3: ['Crescita Follower', 'Traffico Web', 'Lead Generation', 'Conversioni'],
          4: ['Tempo Risparmiato', 'Consistenza', 'Engagement', 'Efficienza'],
          5: ['Portata Globale', 'Engagement Locale', 'Brand Coherence', 'Market Penetration'],
          6: ['CTR', 'CPC', 'ROAS', 'Conversioni'],
          7: ['Engagement Rate', 'Retention', 'Brand Recall', 'Conversioni'],
          8: ['Brand Reach', 'Engagement', 'Nuovi Follower', 'Conversioni']
        };
        
        const serviceLabels = labelsMap[activeService] || labelsMap[0];
        
      setChartData({
          labels: serviceLabels,
        datasets: [
          {
              label: language === 'it' ? 'Prima di SocialPro' : 'Before SocialPro',
              data: adjustedDataBefore,
            backgroundColor: 'rgba(53, 162, 235, 0.7)',
            borderColor: 'rgba(53, 162, 235, 1)',
            borderWidth: 1,
            borderRadius: 4,
          },
          {
              label: language === 'it' ? 'Dopo SocialPro' : 'After SocialPro',
              data: adjustedDataAfter,
            backgroundColor: 'rgba(75, 192, 192, 0.7)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      })
    }
    fetchChartData()
    } else {
      // Reset dei dati del grafico quando nessun servizio è attivo
      setChartData(null);
    }
  }, [activeService, language])

  const handleCardClick = (index: number) => {
    setActiveService(prevActive => prevActive === index ? null : index)
  }

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">{t('marketing.services.title')}</h2>
        
        {/* Filtro servizi - Best practice 2025: Fornire filtri rapidi per grandi set di card */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button 
            className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-blue-100 hover:text-blue-700 transition-all"
            onClick={() => setActiveService(null)}
          >
            {t('marketing.services.filters.allServices')}
          </button>
          <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-blue-100 hover:text-blue-700 transition-all">
            {t('marketing.services.filters.analytics')}
          </button>
          <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-blue-100 hover:text-blue-700 transition-all">
            {t('marketing.services.filters.content')}
          </button>
          <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-blue-100 hover:text-blue-700 transition-all">
            {t('marketing.services.filters.advertising')}
          </button>
          <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-blue-100 hover:text-blue-700 transition-all">
            {t('marketing.services.filters.automation')}
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className={`bg-white rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-md border border-gray-100 ${activeService === index ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
              onClick={() => handleCardClick(index)}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              aria-expanded={activeService === index}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center justify-center mb-5 bg-gray-50 w-16 h-16 rounded-lg">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="flex items-center text-blue-600 text-sm font-medium">
                {activeService === index ? t('marketing.services.detailsToggle.hide') : t('marketing.services.detailsToggle.show')}
                <motion.div 
                  animate={{ rotate: activeService === index ? 180 : 0 }}
                  className="ml-1"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
            </div>
            </motion.div>
          ))}
        </div>
        
        <AnimatePresence>
          {activeService !== null && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 shadow-md mb-12"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-lg ${
                  activeService === 0 ? 'bg-blue-100 text-blue-600' :
                  activeService === 1 ? 'bg-purple-100 text-purple-600' :
                  activeService === 2 ? 'bg-green-100 text-green-600' :
                  activeService === 3 ? 'bg-red-100 text-red-600' :
                  activeService === 4 ? 'bg-yellow-100 text-yellow-600' :
                  activeService === 5 ? 'bg-teal-100 text-teal-600' :
                  activeService === 6 ? 'bg-indigo-100 text-indigo-600' :
                  activeService === 7 ? 'bg-pink-100 text-pink-600' :
                  'bg-orange-100 text-orange-600'
                }`}>
                  {services[activeService].icon}
                </div>
                <h4 className="text-2xl font-bold text-gray-800">{services[activeService].title}</h4>
              </div>
              
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">{services[activeService].details}</p>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 mb-8">
                <h5 className="text-xl font-semibold text-gray-800 mb-4">{t('marketing.services.cards.analysis.features')}</h5>
                <ul className="grid md:grid-cols-2 gap-x-6 gap-y-3">
            {services[activeService].features.map((feature, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
            ))}
          </ul>
              </div>
              
          {chartData && (
                <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
                  <h5 className="text-xl font-semibold text-gray-800 mb-5">{t('marketing.services.chartTitle')}</h5>
                  <div className="h-[400px] w-full md:w-[90%] lg:w-[85%] mx-auto">
                <Chart type='bar' data={chartData} options={chartOptions} />
                  </div>
                  <p className="text-sm text-gray-500 text-center mt-4">{t('marketing.services.chartSubtitle')}</p>
                </div>
              )}
              
              <div className="mt-10 flex flex-wrap gap-4 justify-center">
                <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
                  {t('marketing.services.cta.quote')}
                </button>
                <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg shadow-sm border border-blue-200 hover:bg-blue-50 transition-colors">
                  {t('marketing.services.cta.learnMore')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default ServicesOverview