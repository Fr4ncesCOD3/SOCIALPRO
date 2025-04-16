import React, { useState, useEffect, lazy, Suspense, memo } from 'react'
import { AnimatePresence, LazyMotion, domAnimation, m as motion } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import Header from './components/layout/Header'

// Importazione lazy dei componenti per migliorare performance
const ValueProposition = lazy(() => import('./components/marketing/ValueProposition'))
const ServicesOverview = lazy(() => import('./components/marketing/ServicesOverview'))
const EngagementSimulator = lazy(() => import('./components/marketing/EngagementSimulator'))
const AnimatedParallax = lazy(() => import('./components/marketing/AnimatedParallax'))
const Testimonials = lazy(() => import('./components/marketing/Testimonials'))
const PricingROI = lazy(() => import('./components/marketing/PricingROI'))
const Blog = lazy(() => import('./components/marketing/Blog'))
const Footer = lazy(() => import('./components/layout/Footer'))
const AuthModal = lazy(() => import('./components/auth/AuthModal'))
const UserDashboard = lazy(() => import('./components/dashboard/UserDashboard'))

// Tipi per l'app
interface User {
  id: string | number;
  name: string;
  email?: string;
  [key: string]: any;
}

// Componente di fallback ottimizzato durante il caricamento
const LoadingFallback = memo(() => (
  <div className="flex items-center justify-center w-full min-h-[30vh]">
    <div className="w-10 h-10 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
  </div>
))

LoadingFallback.displayName = 'LoadingFallback'

// Componente ottimizzato per la visualizzazione principale del content
const MainContent = memo(({ onContactFormOpen, user }: { onContactFormOpen: () => void, user: User | null }) => (
  <motion.div
    key="main-content"
    initial="initial"
    animate="enter"
    exit="exit"
    variants={{
      initial: { opacity: 0 },
      enter: { 
        opacity: 1,
        transition: { duration: 0.3, when: "beforeChildren" }
      },
      exit: { 
        opacity: 0,
        transition: { duration: 0.2 } 
      }
    }}
  >
    <Header onCtaClick={onContactFormOpen} />
    <main>
      <Suspense fallback={<LoadingFallback />}>
        <ValueProposition />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <ServicesOverview />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <EngagementSimulator />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <AnimatedParallax />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <Testimonials />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <PricingROI user={user} />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <Blog />
      </Suspense>
    </main>
  </motion.div>
))

MainContent.displayName = 'MainContent'

// Componente ottimizzato per la dashboard
const DashboardContent = memo(({ user, onClose }: { user: User, onClose: () => void }) => (
  <motion.div
    key="dashboard"
    initial="initial"
    animate="enter"
    exit="exit"
    variants={{
      initial: { opacity: 0 },
      enter: { 
        opacity: 1,
        transition: { duration: 0.3 } 
      },
      exit: { 
        opacity: 0,
        transition: { duration: 0.2 } 
      }
    }}
  >
    <Suspense fallback={<LoadingFallback />}>
      <UserDashboard user={user} onClose={onClose} />
    </Suspense>
  </motion.div>
))

DashboardContent.displayName = 'DashboardContent'

function App() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [showDashboard, setShowDashboard] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Check for existing session using localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        // Gestione fallback per JSON non valido
        localStorage.removeItem('user')
      }
    }
    
    // Simula precaricamento completato - ridotta a 0 per eliminare ritardi artificiali
    const timer = setTimeout(() => setIsLoaded(true), 0)
    return () => clearTimeout(timer)
  }, [])

  const handleLogin = (userData: User) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    setIsAuthModalOpen(false)
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
    setShowDashboard(false)
  }

  // Evita il rendering finché non abbiamo caricato i dati iniziali
  if (!isLoaded) {
    return <LoadingFallback />
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-gray-100">
        <Navbar 
          user={user} 
          onAuthClick={() => setIsAuthModalOpen(true)} 
          onLogout={handleLogout}
          onDashboardClick={() => setShowDashboard(true)}
        />
        
        <AnimatePresence mode="wait">
          {showDashboard && user ? (
            <DashboardContent 
              key="dashboard-view"
              user={user} 
              onClose={() => setShowDashboard(false)} 
            />
          ) : (
            <MainContent 
              key="main-content-view"
              onContactFormOpen={() => setIsContactFormOpen(true)}
              user={user}
            />
          )}
        </AnimatePresence>
        
        <Suspense fallback={<LoadingFallback />}>
          <Footer isContactFormOpen={isContactFormOpen} setIsContactFormOpen={setIsContactFormOpen} />
        </Suspense>
        
        <Suspense fallback={null}>
          {isAuthModalOpen && (
            <AuthModal 
              isOpen={isAuthModalOpen} 
              onClose={() => setIsAuthModalOpen(false)} 
              onLogin={handleLogin} 
            />
          )}
        </Suspense>
      </div>
    </LazyMotion>
  )
}

export default App