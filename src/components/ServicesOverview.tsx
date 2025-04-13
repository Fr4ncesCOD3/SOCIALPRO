import React, { useState, useEffect } from 'react'
import { BarChart, Globe, Share2, Users, TrendingUp, Zap } from 'lucide-react'
import { Chart } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const ServicesOverview = () => {
  const [activeService, setActiveService] = useState(0)
  const [chartData, setChartData] = useState(null)

  const services = [
    {
      icon: <BarChart className="h-12 w-12 text-blue-500" />,
      title: "Social Media Analysis",
      description: "Gain deep insights into your social media performance with our advanced analytics tools.",
      details: "Our social media analysis service provides comprehensive reports on engagement rates, audience demographics, and content performance. We use cutting-edge AI to identify trends and opportunities for growth.",
      features: [
        "Real-time performance tracking",
        "Competitor analysis",
        "Sentiment analysis",
        "Content optimization recommendations",
        "Custom reporting dashboards"
      ]
    },
    // ... (other services remain the same)
  ]

  useEffect(() => {
    // Simulated data fetch
    const fetchChartData = async () => {
      // In a real application, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setChartData({
        labels: ['Engagement', 'Reach', 'Conversions', 'ROI'],
        datasets: [
          {
            label: 'Before SocialPro',
            data: [65, 59, 80, 81],
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
          {
            label: 'After SocialPro',
            data: [95, 89, 110, 121],
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
          },
        ],
      })
    }
    fetchChartData()
  }, [activeService])

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <div
              key={index}
              className={`bg-gray-50 rounded-lg p-6 cursor-pointer transition-all duration-300 ${activeService === index ? 'shadow-lg scale-105' : 'hover:shadow-md'}`}
              onClick={() => setActiveService(index)}
            >
              <div className="flex items-center justify-center mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
        <div className="bg-blue-50 rounded-lg p-6 animate-fadeIn">
          <h4 className="text-2xl font-semibold text-blue-800 mb-4">{services[activeService].title}</h4>
          <p className="text-blue-700 mb-4">{services[activeService].details}</p>
          <h5 className="text-xl font-semibold text-blue-800 mb-2">Key Features:</h5>
          <ul className="list-disc list-inside text-blue-700 mb-6">
            {services[activeService].features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          {chartData && (
            <div className="mt-8">
              <h5 className="text-xl font-semibold text-blue-800 mb-4">Performance Improvement</h5>
              <Chart type='bar' data={chartData} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ServicesOverview