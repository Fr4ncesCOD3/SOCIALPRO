import React from 'react'
import { TrendingUp, Target, Zap } from 'lucide-react'

const ValueProposition = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Why Choose SocialPro?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<TrendingUp className="h-12 w-12 text-blue-500" />}
            title="Cutting-edge Strategies"
            description="Stay ahead with our innovative approaches to social media and web growth."
          />
          <FeatureCard
            icon={<Target className="h-12 w-12 text-blue-500" />}
            title="Targeted Campaigns"
            description="Reach your ideal audience with precision-targeted advertising campaigns."
          />
          <FeatureCard
            icon={<Zap className="h-12 w-12 text-blue-500" />}
            title="Rapid Results"
            description="See tangible improvements in your digital presence within weeks."
          />
        </div>
      </div>
    </section>
  )
}

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-center justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
)

export default ValueProposition