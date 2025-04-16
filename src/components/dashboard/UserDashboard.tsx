import React, { useState, useEffect, useRef } from 'react'
import { X, BarChart2, TrendingUp, Users, ChevronDown, Calendar, Star, Activity } from 'lucide-react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Chart } from 'react-chartjs-2'
import { ChartData, ChartOptions } from 'chart.js'

// Registra i componenti Chart.js necessari
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

interface User {
  name: string;
  email?: string;
  id?: string | number;
}

interface UserDashboardProps {
  user: User;
  onClose: () => void;
}

type AnalyticsDataType = {
  line: ChartData<'line'> | null;
  bar: ChartData<'bar'> | null;
}

type TimeRange = '7d' | '30d' | '90d' | '1y';

const UserDashboard: React.FC<UserDashboardProps> = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsDataType>({
    line: null,
    bar: null
  })
  const [timeRange, setTimeRange] = useState<TimeRange>('30d')
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const chartContainerRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    // Simulated data fetch
    const fetchAnalytics = async () => {
      setIsLoading(true)
      try {
        // In a real application, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Labels basati sul timeRange selezionato
        let labels;
        switch(timeRange) {
          case '7d':
            labels = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
            break;
          case '30d':
            labels = Array.from({length: 30}, (_, i) => `${i+1}`);
            break;
          case '90d':
            labels = ['Gen', 'Feb', 'Mar'];
            break;
          case '1y':
            labels = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
            break;
          default:
            labels = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu'];
        }
        
        // Genera dati casuali ma coerenti basati sul timeRange
        const multiplier = timeRange === '7d' ? 1 : timeRange === '30d' ? 1.2 : timeRange === '90d' ? 1.5 : 2;
        
        const engagementData = generateRandomData(labels.length, 4, 8, multiplier);
        const followerData = generateRandomData(labels.length, 1000, 3000, multiplier);
        const postData = generateRandomData(labels.length, 10, 30, multiplier);
        const clickData = generateRandomData(labels.length, 100, 500, multiplier);
        
        setAnalyticsData({
          line: {
            labels,
            datasets: [
              {
                label: 'Tasso di Engagement',
                data: engagementData,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: isMobile ? 2 : 3,
                pointHoverRadius: isMobile ? 4 : 6
              },
              {
                label: 'Crescita Follower',
                data: followerData,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: isMobile ? 2 : 3,
                pointHoverRadius: isMobile ? 4 : 6,
                yAxisID: 'y1'
              }
            ]
          },
          bar: {
            labels,
            datasets: [
              {
                label: 'Post Pubblicati',
                data: postData,
                backgroundColor: 'rgba(53, 162, 235, 0.7)',
                borderRadius: 4
              },
              {
                label: 'Click su Link',
                data: clickData,
                backgroundColor: 'rgba(255, 206, 86, 0.7)',
                borderRadius: 4
              }
            ]
          }
        })
      } catch (error) {
        console.error('Errore nel recupero dei dati analitici:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchAnalytics()
  }, [timeRange, isMobile])

  // Funzione per generare dati casuali ma coerenti
  const generateRandomData = (length: number, min: number, max: number, multiplier: number = 1): number[] => {
    const data = [];
    let prev = Math.random() * (max - min) + min;
    
    for (let i = 0; i < length; i++) {
      // Garantisce una variazione più naturale
      const change = (Math.random() - 0.5) * (max - min) * 0.1;
      prev = Math.max(min, Math.min(max, prev + change * multiplier));
      data.push(Number(prev.toFixed(1)));
    }
    
    return data;
  }

  // Opzioni ottimizzate per i grafici lineari con le best practice 2025
  const lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        displayColors: true
      },
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: isMobile ? 11 : 13
          }
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: isMobile ? 6 : 12,
          font: {
            size: isMobile ? 10 : 12
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        position: 'left',
        title: {
          display: true,
          text: 'Tasso di Engagement (%)',
          font: {
            size: isMobile ? 10 : 13
          }
        },
        ticks: {
          font: {
            size: isMobile ? 10 : 12
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      y1: {
        position: 'right',
        title: {
          display: true,
          text: 'Follower',
          font: {
            size: isMobile ? 10 : 13
          }
        },
        ticks: {
          font: {
            size: isMobile ? 10 : 12
          }
        },
        grid: {
          display: false
        }
      }
    }
  };

  // Opzioni ottimizzate per i grafici a barre con le best practice 2025
  const barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        displayColors: true
      },
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: isMobile ? 11 : 13
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: isMobile ? 6 : 12,
          font: {
            size: isMobile ? 10 : 12
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        ticks: {
          font: {
            size: isMobile ? 10 : 12
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm">
              <BarChart2 className="h-8 w-8 text-blue-500 mb-2" />
              <h4 className="font-semibold text-blue-700">Engagement Totale</h4>
              <p className="text-2xl font-bold">12,345</p>
              <p className="text-sm text-blue-600">+8.3% rispetto al periodo precedente</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg shadow-sm">
              <TrendingUp className="h-8 w-8 text-green-500 mb-2" />
              <h4 className="font-semibold text-green-700">Tasso di Crescita</h4>
              <p className="text-2xl font-bold">+15.7%</p>
              <p className="text-sm text-green-600">+3.2% rispetto al periodo precedente</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg shadow-sm">
              <Users className="h-8 w-8 text-purple-500 mb-2" />
              <h4 className="font-semibold text-purple-700">Nuovi Follower</h4>
              <p className="text-2xl font-bold">1,234</p>
              <p className="text-sm text-purple-600">+12.5% rispetto al periodo precedente</p>
            </div>
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg shadow-sm">
              <Activity className="h-8 w-8 text-amber-500 mb-2" />
              <h4 className="font-semibold text-amber-700">Interazioni Giornaliere</h4>
              <p className="text-2xl font-bold">432</p>
              <p className="text-sm text-amber-600">+5.7% rispetto al periodo precedente</p>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <h4 className="text-xl font-semibold mb-2 sm:mb-0">Metriche di Performance</h4>
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button 
                  className={`px-3 py-1 text-sm rounded-md ${timeRange === '7d' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                  onClick={() => setTimeRange('7d')}
                >
                  7 giorni
                </button>
                <button 
                  className={`px-3 py-1 text-sm rounded-md ${timeRange === '30d' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                  onClick={() => setTimeRange('30d')}
                >
                  30 giorni
                </button>
                <button 
                  className={`px-3 py-1 text-sm rounded-md ${timeRange === '90d' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                  onClick={() => setTimeRange('90d')}
                >
                  90 giorni
                </button>
                <button 
                  className={`px-3 py-1 text-sm rounded-md ${timeRange === '1y' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                  onClick={() => setTimeRange('1y')}
                >
                  1 anno
                </button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-80">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-500">Caricamento dati in corso...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h5 className="text-lg font-medium mb-3">Tasso di Engagement e Crescita Follower</h5>
                  <div className="h-80" ref={chartContainerRef}>
                    {analyticsData.line && (
                      <Chart type='line' data={analyticsData.line} options={lineChartOptions} />
                    )}
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h5 className="text-lg font-medium mb-3">Post Pubblicati e Click</h5>
                  <div className="h-80">
                    {analyticsData.bar && (
                      <Chart type='bar' data={analyticsData.bar} options={barChartOptions} />
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-lg font-medium">Post con Maggiore Engagement</h5>
                      <Calendar className="text-gray-400 h-5 w-5" />
                    </div>
                    <ul className="space-y-3">
                      <li className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md">
                        <div>
                          <p className="font-medium">Come migliorare le tue strategie social</p>
                          <p className="text-sm text-gray-500">21/05/2025</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold">8.7%</span>
                        </div>
                      </li>
                      <li className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md">
                        <div>
                          <p className="font-medium">10 tendenze di marketing per il 2025</p>
                          <p className="text-sm text-gray-500">15/05/2025</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold">7.2%</span>
                        </div>
                      </li>
                      <li className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md">
                        <div>
                          <p className="font-medium">Case study: Come abbiamo aumentato le conversioni</p>
                          <p className="text-sm text-gray-500">03/05/2025</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold">6.8%</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-lg font-medium">Dati Demografici</h5>
                      <Users className="text-gray-400 h-5 w-5" />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Età 18-24</span>
                          <span className="text-sm font-medium">28%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Età 25-34</span>
                          <span className="text-sm font-medium">42%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Età 35-44</span>
                          <span className="text-sm font-medium">20%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Età 45+</span>
                          <span className="text-sm font-medium">10%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-amber-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'recommendations':
        return (
          <div>
            <h4 className="text-xl font-semibold mb-4">Raccomandazioni Personalizzate</h4>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <ul className="space-y-4">
                <li className="flex gap-3 p-3 border border-green-100 rounded-lg bg-green-50">
                  <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-medium">Aumenta la frequenza di pubblicazione a 5 volte a settimana</h5>
                    <p className="text-sm text-gray-600 mt-1">I tuoi follower rispondono meglio quando pubblichi contenuti regolarmente durante la settimana lavorativa.</p>
                  </div>
                </li>
                <li className="flex gap-3 p-3 border border-blue-100 rounded-lg bg-blue-50">
                  <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h5 className="font-medium">Interagisci di più con i follower attraverso commenti e messaggi diretti</h5>
                    <p className="text-sm text-gray-600 mt-1">Abbiamo notato che i post con più interazioni generano il 35% in più di engagement complessivo.</p>
                  </div>
                </li>
                <li className="flex gap-3 p-3 border border-purple-100 rounded-lg bg-purple-50">
                  <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                    <BarChart2 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h5 className="font-medium">Utilizza gli hashtag di tendenza: #SocialMediaTips, #DigitalMarketing</h5>
                    <p className="text-sm text-gray-600 mt-1">Questi hashtag hanno mostrato una correlazione con l'aumento della visibilità per profili simili al tuo.</p>
                  </div>
                </li>
                <li className="flex gap-3 p-3 border border-amber-100 rounded-lg bg-amber-50">
                  <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                    <Activity className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h5 className="font-medium">Crea più contenuti video per un maggiore engagement</h5>
                    <p className="text-sm text-gray-600 mt-1">I contenuti video generano in media il 48% in più di engagement rispetto alle immagini statiche.</p>
                  </div>
                </li>
                <li className="flex gap-3 p-3 border border-red-100 rounded-lg bg-red-50">
                  <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                    <Users className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h5 className="font-medium">Collabora con influencer nel tuo settore</h5>
                    <p className="text-sm text-gray-600 mt-1">Le collaborazioni con influencer possono ampliare la tua portata del 75% verso nuovi potenziali follower.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-5xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="text-2xl font-medium text-gray-900">Benvenuto, {user.name}</h3>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-500 transition-colors"
              aria-label="Chiudi dashboard"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-4">
            <div className="flex border-b overflow-x-auto hide-scrollbar">
              <button
                className={`py-2 px-4 whitespace-nowrap transition-colors ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                onClick={() => setActiveTab('overview')}
                aria-selected={activeTab === 'overview'}
                role="tab"
              >
                Panoramica
              </button>
              <button
                className={`py-2 px-4 whitespace-nowrap transition-colors ${activeTab === 'analytics' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                onClick={() => setActiveTab('analytics')}
                aria-selected={activeTab === 'analytics'}
                role="tab"
              >
                Analytics
              </button>
              <button
                className={`py-2 px-4 whitespace-nowrap transition-colors ${activeTab === 'recommendations' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                onClick={() => setActiveTab('recommendations')}
                aria-selected={activeTab === 'recommendations'}
                role="tab"
              >
                Raccomandazioni
              </button>
            </div>
            <div className="mt-6" role="tabpanel">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard