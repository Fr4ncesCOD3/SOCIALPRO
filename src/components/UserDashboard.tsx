import React, { useState, useEffect } from 'react'
import { X, BarChart2, TrendingUp, Users } from 'lucide-react'
import { Chart } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const UserDashboard = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [analyticsData, setAnalyticsData] = useState(null)

  useEffect(() => {
    // Simulated data fetch
    const fetchAnalytics = async () => {
      // In a real application, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAnalyticsData({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Engagement Rate',
            data: [4.5, 5.2, 5.7, 6.1, 6.8, 7.2],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          },
          {
            label: 'Follower Growth',
            data: [1000, 1200, 1450, 1800, 2200, 2600],
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1
          }
        ]
      })
    }
    fetchAnalytics()
  }, [])

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="text-2xl font-medium text-gray-900">Welcome, {user.name}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-4">
            <div className="flex border-b">
              <button
                className={`py-2 px-4 ${activeTab === 'overview' ? 'border-b-2 border-blue-500' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`py-2 px-4 ${activeTab === 'analytics' ? 'border-b-2 border-blue-500' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                Analytics
              </button>
              <button
                className={`py-2 px-4 ${activeTab === 'recommendations' ? 'border-b-2 border-blue-500' : ''}`}
                onClick={() => setActiveTab('recommendations')}
              >
                Recommendations
              </button>
            </div>
            <div className="mt-4">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <BarChart2 className="h-8 w-8 text-blue-500 mb-2" />
                    <h4 className="font-semibold">Total Engagement</h4>
                    <p className="text-2xl font-bold">12,345</p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-green-500 mb-2" />
                    <h4 className="font-semibold">Growth Rate</h4>
                    <p className="text-2xl font-bold">+15.7%</p>
                  </div>
                  <div className="bg-purple-100 p-4 rounded-lg">
                    <Users className="h-8 w-8 text-purple-500 mb-2" />
                    <h4 className="font-semibold">New Followers</h4>
                    <p className="text-2xl font-bold">1,234</p>
                  </div>
                </div>
              )}
              {activeTab === 'analytics' && analyticsData && (
                <div>
                  <h4 className="text-xl font-semibold mb-4">Performance Metrics</h4>
                  <Chart type='line' data={analyticsData} />
                </div>
              )}
              {activeTab === 'recommendations' && (
                <div>
                  <h4 className="text-xl font-semibold mb-4">Personalized Recommendations</h4>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Increase posting frequency to 5 times per week</li>
                    <li>Engage with followers more through comments and direct messages</li>
                    <li>Use trending hashtags: #SocialMediaTips, #DigitalMarketing</li>
                    <li>Create more video content for higher engagement</li>
                    <li>Collaborate with influencers in your industry</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard