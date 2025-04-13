import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const caseStudies = [
  {
    title: "E-commerce Growth Explosion",
    client: "FashionFrenzy",
    challenge: "FashionFrenzy, an up-and-coming online clothing retailer, was struggling to stand out in a crowded market and drive sales through social media.",
    solution: "We implemented a multi-faceted social media strategy, including influencer partnerships, user-generated content campaigns, and targeted social media advertising.",
    results: [
      "300% increase in social media engagement",
      "150% boost in website traffic from social channels",
      "200% growth in online sales attributed to social media"
    ],
    image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "B2B Lead Generation Success",
    client: "TechSolutions Inc.",
    challenge: "TechSolutions Inc., a B2B software company, was finding it difficult to generate quality leads through traditional marketing methods.",
    solution: "We developed a comprehensive LinkedIn strategy, combining thought leadership content, employee advocacy, and targeted LinkedIn advertising campaigns.",
    results: [
      "500% increase in LinkedIn followers",
      "250% growth in qualified leads generated through LinkedIn",
      "40% reduction in cost per lead compared to previous methods"
    ],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "Local Business Expansion",
    client: "GreenThumb Nursery",
    challenge: "GreenThumb Nursery, a local plant shop, wanted to expand its customer base and compete with larger chain stores.",
    solution: "We created a hyper-local social media strategy, focusing on Instagram and Facebook to showcase products, share gardening tips, and promote in-store events.",
    results: [
      "400% increase in Instagram followers",
      "180% boost in foot traffic attributed to social media",
      "250% growth in sales from social media promotions"
    ],
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
]

const CaseStudies = () => {
  const [currentStudy, setCurrentStudy] = useState(0)

  const nextStudy = () => {
    setCurrentStudy((prev) => (prev + 1) % caseStudies.length)
  }

  const prevStudy = () => {
    setCurrentStudy((prev) => (prev - 1 + caseStudies.length) % caseStudies.length)
  }

  const study = caseStudies[currentStudy]

  return (
    <section id="case-studies" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Case Studies</h2>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img className="h-48 w-full object-cover md:w-48" src={study.image} alt={study.client} />
            </div>
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{study.client}</div>
              <h3 className="mt-1 text-2xl font-semibold text-gray-900">{study.title}</h3>
              <p className="mt-2 text-gray-600">{study.challenge}</p>
              <p className="mt-2 text-gray-600">{study.solution}</p>
              <h4 className="mt-4 text-lg font-semibold text-gray-900">Results:</h4>
              <ul className="mt-2 list-disc list-inside text-gray-600">
                {study.results.map((result, index) => (
                  <li key={index}>{result}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-gray-100 px-4 py-3 sm:px-6 flex justify-between">
            <button
              onClick={prevStudy}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:border-indigo-300 focus:shadow-outline-indigo active:bg-indigo-200 transition ease-in-out duration-150"
            >
              <ChevronLeft className="h-5 w-5 mr-1" /> Previous
            </button>
            <button
              onClick={nextStudy}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:border-indigo-300 focus:shadow-outline-indigo active:bg-indigo-200 transition ease-in-out duration-150"
            >
              Next <ChevronRight className="h-5 w-5 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CaseStudies