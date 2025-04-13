import React, { useState } from 'react'
import { Send, MessageCircle } from 'lucide-react'

interface FooterProps {
  isContactFormOpen: boolean
  setIsContactFormOpen: (isOpen: boolean) => void
}

const Footer: React.FC<FooterProps> = ({ isContactFormOpen, setIsContactFormOpen }) => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { text: "Welcome to SocialPro! How can we assist you today?", sender: 'bot' }
  ])
  const [userInput, setUserInput] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simulating an API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Form submitted:', { email, message })
      setEmail('')
      setMessage('')
      setIsContactFormOpen(false)
      alert('Thank you for your message. We will get back to you soon!')
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('There was an error submitting your message. Please try again.')
    }
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInput.trim()) return

    const newUserMessage = { text: userInput, sender: 'user' }
    setChatMessages(prev => [...prev, newUserMessage])
    setUserInput('')

    // Simulating a bot response
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const botResponse = { text: "Thank you for your message. One of our representatives will be with you shortly.", sender: 'bot' }
      setChatMessages(prev => [...prev, botResponse])
    } catch (error) {
      console.error('Error in chat:', error)
    }
  }

  return (
    <footer id="contact" className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <h3 className="text-2xl font-bold mb-4">SocialPro</h3>
            <p className="mb-4">Elevating your digital presence with cutting-edge strategies and unparalleled expertise.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400 transition-colors duration-300">Twitter</a>
              <a href="#" className="hover:text-blue-400 transition-colors duration-300">Facebook</a>
              <a href="#" className="hover:text-blue-400 transition-colors duration-300">LinkedIn</a>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h3 className="text-2xl font-bold mb-4">Contact Us</h3>
            {isContactFormOpen ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  required
                />
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  rows={4}
                  required
                ></textarea>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
                  Send Message <Send className="inline-block ml-2 h-4 w-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsContactFormOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
              >
                Open Contact Form
              </button>
            )}
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>&copy; 2023 SocialPro. All rights reserved.</p>
        </div>
      </div>
      {/* Live Chat Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-colors duration-300"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
      {/* Live Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-4 w-80 bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-blue-500 text-white p-4">
            <h3 className="font-bold">Live Chat</h3>
          </div>
          <div className="h-64 overflow-y-auto p-4 bg-gray-100">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'}`}>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <form onSubmit={handleChatSubmit} className="p-4 bg-white">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-2 rounded border border-gray-300"
            />
          </form>
        </div>
      )}
    </footer>
  )
}

export default Footer