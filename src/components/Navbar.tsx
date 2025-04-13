import React, { useState, useEffect } from 'react'
import { Menu, X, Home, Briefcase, BarChart2, Star, DollarSign, BookOpen, Mail, User, LogIn, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import AuthModal from './AuthModal'

const Navbar = ({ user, onAuthClick, onLogout, onDashboardClick }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    closed: { opacity: 0, y: -20 },
    open: { opacity: 1, y: 0 }
  }

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="#" className={`text-2xl font-bold ${isScrolled ? 'text-blue-600' : 'text-white'}`}>SocialPro</a>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink href="#home" isScrolled={isScrolled}>Home</NavLink>
              <NavLink href="#services" isScrolled={isScrolled}>Services</NavLink>
              <NavLink href="#engagement-simulator" isScrolled={isScrolled}>Simulator</NavLink>
              <NavLink href="#testimonials" isScrolled={isScrolled}>Testimonials</NavLink>
              <NavLink href="#pricing" isScrolled={isScrolled}>Pricing</NavLink>
              <NavLink href="#blog" isScrolled={isScrolled}>Blog</NavLink>
              <NavLink href="#contact" isScrolled={isScrolled}>Contact</NavLink>
              {user ? (
                <>
                  <button onClick={onDashboardClick} className={`px-3 py-2 rounded-md text-sm font-medium ${isScrolled ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'} hover:bg-opacity-80 transition-colors duration-300`}>
                    Dashboard
                  </button>
                  <button onClick={onLogout} className={`px-3 py-2 rounded-md text-sm font-medium ${isScrolled ? 'bg-red-600 text-white' : 'bg-white text-red-600'} hover:bg-opacity-80 transition-colors duration-300`}>
                    Logout
                  </button>
                </>
              ) : (
                <button onClick={onAuthClick} className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isScrolled 
                    ? 'bg-white text-blue-600 hover:bg-blue-100' 
                    : 'bg-white text-blue-600 hover:bg-opacity-80'
                } transition-colors duration-300`}>
                  Login
                </button>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${isScrolled ? 'text-blue-600' : 'text-white'} hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <motion.div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black bg-opacity-70 backdrop-filter backdrop-blur-lg">
              <MobileNavLink href="#home" icon={Home} variants={itemVariants}>Home</MobileNavLink>
              <MobileNavLink href="#services" icon={Briefcase} variants={itemVariants}>Services</MobileNavLink>
              <MobileNavLink href="#engagement-simulator" icon={BarChart2} variants={itemVariants}>Simulator</MobileNavLink>
              <MobileNavLink href="#testimonials" icon={Star} variants={itemVariants}>Testimonials</MobileNavLink>
              <MobileNavLink href="#pricing" icon={DollarSign} variants={itemVariants}>Pricing</MobileNavLink>
              <MobileNavLink href="#blog" icon={BookOpen} variants={itemVariants}>Blog</MobileNavLink>
              <MobileNavLink href="#contact" icon={Mail} variants={itemVariants}>Contact</MobileNavLink>
              {user ? (
                <>
                  <MobileNavLink href="#" onClick={onDashboardClick} icon={User} variants={itemVariants}>Dashboard</MobileNavLink>
                  <MobileNavLink href="#" onClick={onLogout} icon={LogOut} variants={itemVariants}>Logout</MobileNavLink>
                </>
              ) : (
                <MobileNavLink href="#" onClick={onAuthClick} icon={LogIn} variants={itemVariants}>Login</MobileNavLink>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

const NavLink = ({ href, children, isScrolled }) => (
  <a
    href={href}
    className={`px-3 py-2 rounded-md text-sm font-medium ${
      isScrolled ? 'text-gray-800 hover:bg-gray-200' : 'text-white hover:bg-white hover:text-blue-600'
    } transition-colors duration-300`}
  >
    {children}
  </a>
)

const MobileNavLink = ({ href, children, onClick, variants, icon: Icon }) => {
  const iconVariants = {
    initial: { rotateY: 0 },
    animate: { 
      rotateY: 360,
      transition: { 
        duration: 5,
        repeat: Infinity, 
        ease: "easeInOut"
      }
    }
  }

  return (
    <motion.a
      href={href}
      onClick={onClick}
      variants={variants}
      className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white hover:text-black transition-colors duration-300 flex items-center"
    >
      <motion.div
        variants={iconVariants}
        initial="initial"
        animate="animate"
        className="mr-3 perspective-1000"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <Icon className="h-5 w-5" />
      </motion.div>
      {children}
    </motion.a>
  )
}

export default Navbar
