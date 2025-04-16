import React, { useState } from 'react'
import { DollarSign, Percent, Lock } from 'lucide-react'

const PricingROI = ({ user }) => {
  const [investment, setInvestment] = useState(1000)
  const [duration, setDuration] = useState(3)

  const calculateROI = (amount: number, months: number) => {
    const baseROI = 1.2 // 20% base ROI
    const scaleFactor = 1 + (amount / 10000) // Scale ROI based on investment amount
    const timeFactor = 1 + (months / 12) // Scale ROI based on duration
    return (amount * baseROI * scaleFactor * timeFactor) - amount
  }

  const estimatedROI = calculateROI(investment, duration)

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Pricing and ROI</h2>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          {user ? (
            <>
              <div className="mb-8">
                <label htmlFor="investment" className="block text-gray-700 font-semibold mb-2">
                  Investment Amount ($)
                </label>
                <input
                  type="range"
                  id="investment"
                  min="500"
                  max="10000"
                  step="500"
                  value={investment}
                  onChange={(e) => setInvestment(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-2xl font-bold text-blue-600 mt-2">
                  ${investment.toLocaleString()}
                </div>
              </div>
              <div className="mb-8">
                <label htmlFor="duration" className="block text-gray-700 font-semibold mb-2">
                  Campaign Duration (months)
                </label>
                <input
                  type="range"
                  id="duration"
                  min="1"
                  max="12"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-2xl font-bold text-blue-600 mt-2">
                  {duration} {duration === 1 ? 'month' : 'months'}
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-blue-800 mb-4">Estimated ROI</h3>
                <div className="flex items-center justify-center space-x-4">
                  <DollarSign className="h-8 w-8 text-green-500" />
                  <span className="text-4xl font-bold text-green-600">
                    ${estimatedROI.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                  <Percent className="h-8 w-8 text-blue-500" />
                  <span className="text-4xl font-bold text-blue-600">
                    {((estimatedROI / investment) * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-center text-gray-600 mt-4">
                  Estimated return on your ${investment.toLocaleString()} investment over {duration} {duration === 1 ? 'month' : 'months'}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Login to Access ROI Calculator</h3>
              <p className="text-gray-600">Sign in or create an account to use our ROI calculator and see personalized estimates.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default PricingROI