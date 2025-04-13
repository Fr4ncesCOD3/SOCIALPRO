import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Header from './components/Header'
import ValueProposition from './components/ValueProposition'
import ServicesOverview from './components/ServicesOverview'
import EngagementSimulator from './components/EngagementSimulator'
import Testimonials from './components/Testimonials'
import PricingROI from './components/PricingROI'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import UserDashboard from './components/UserDashboard'
import Blog from './components/Blog'
import AnimatedParallax from './components/AnimatedParallax'

function App() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [showDashboard, setShowDashboard] = useState(false)

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    setIsAuthModalOpen(false)
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
    setShowDashboard(false)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar 
        user={user} 
        onAuthClick={() => setIsAuthModalOpen(true)} 
        onLogout={handleLogout}
        onDashboardClick={() => setShowDashboard(true)}
      />
      {showDashboard && user ? (
        <UserDashboard user={user} onClose={() => setShowDashboard(false)} />
      ) : (
        <>
          <Header onCtaClick={() => setIsContactFormOpen(true)} />
          <main>
            <ValueProposition />
            <ServicesOverview />
            <EngagementSimulator />
            <AnimatedParallax />
            <Testimonials />
            <PricingROI user={user} />
            <Blog />
          </main>
        </>
      )}
      <Footer isContactFormOpen={isContactFormOpen} setIsContactFormOpen={setIsContactFormOpen} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLogin={handleLogin} />
    </div>
  )
}

export default App