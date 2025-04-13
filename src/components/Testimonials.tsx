import React, { useState, useEffect } from 'react'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: "Sarah Johnson",
    company: "TechStart Inc.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    quote: "SocialPro transformed our social media presence. Their strategies helped us connect with our audience in ways we never thought possible. Our engagement rates have skyrocketed!",
    rating: 5
  },
  {
    name: "Michael Chen",
    company: "GreenEats",
    image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    quote: "The ROI we've seen from SocialPro's campaigns is incredible. They truly understand our brand and have helped us reach new heights in customer acquisition and retention.",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    company: "FitLife Gym",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    quote: "SocialPro's team is not just skilled, they're passionate about what they do. Their creative approach to our social media strategy has helped us stand out in a crowded market.",
    rating: 5
  }
]

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 10000) // Change testimonial every 10 seconds

    return () => clearInterval(timer)
  }, [])

  return (
    <section id="testimonials" className="py-20 bg-blue-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">What Our Clients Say</h2>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-4">
              <img className="h-12 w-12 rounded-full object-cover mr-4" src={testimonials[currentTestimonial].image} alt={testimonials[currentTestimonial].name} />
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
        </div>
      </div>
    </section>
  )
}

export default Testimonials