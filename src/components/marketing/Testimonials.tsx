import React, { useState, useEffect } from 'react'
import { Star, User } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'

const testimonials = [
  {
    name: "Sarah Johnson",
    company: "TechStart Inc.",
    initials: "SJ",
    bgColor: "#4F46E5", // indigo-600
    quote: "SocialPro transformed our social media presence. Their strategies helped us connect with our audience in ways we never thought possible. Our engagement rates have skyrocketed!",
    rating: 5
  },
  {
    name: "Michael Chen",
    company: "GreenEats",
    initials: "MC",
    bgColor: "#059669", // emerald-600
    quote: "The ROI we've seen from SocialPro's campaigns is incredible. They truly understand our brand and have helped us reach new heights in customer acquisition and retention.",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    company: "FitLife Gym",
    initials: "ER",
    bgColor: "#DC2626", // red-600
    quote: "SocialPro's team is not just skilled, they're passionate about what they do. Their creative approach to our social media strategy has helped us stand out in a crowded market.",
    rating: 5
  }
]

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const { t } = useLanguage()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 10000) // Change testimonial every 10 seconds

    return () => clearInterval(timer)
  }, [])

  return (
    <section id="testimonials" className="py-20 bg-blue-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">{t('marketing.testimonials.title')}</h2>
        <p className="text-xl text-center text-gray-600 mb-12">{t('marketing.testimonials.subtitle')}</p>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-4">
              <div 
                className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold mr-4"
                style={{ backgroundColor: testimonials[currentTestimonial].bgColor }}
              >
                {testimonials[currentTestimonial].initials}
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900">{testimonials[currentTestimonial].name}</h4>
                <p className="text-gray-600">{testimonials[currentTestimonial].company}</p>
              </div>
            </div>
            <p className="text-gray-700 text-lg italic mb-4">"{testimonials[currentTestimonial].quote}"</p>
            <div className="flex">
              {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-3 w-3 rounded-full mx-1 ${index === currentTestimonial ? 'bg-blue-500' : 'bg-gray-300'}`}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              {t('marketing.testimonials.cta')}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials