import React, { useState, useEffect } from 'react'

const Blog = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPosts([
        {
          id: 1,
          title: "5 Strategies to Boost Your Social Media Engagement",
          excerpt: "Learn how to increase your social media engagement with these proven strategies...",
          author: "Jane Doe",
          date: "2023-05-15"
        },
        {
          id: 2,
          title: "The Impact of AI on Social Media Marketing",
          excerpt: "Discover how artificial intelligence is revolutionizing social media marketing...",
          author: "John Smith",
          date: "2023-05-10"
        },
        {
          id: 3,
          title: "Mastering Instagram Reels for Business",
          excerpt: "Find out how to leverage Instagram Reels to grow your business and reach new audiences...",
          author: "Emily Johnson",
          date: "2023-05-05"
        }
      ])
      setLoading(false)
    }
    fetchPosts()
  }, [])

  return (
    <section id="blog" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Latest Insights</h2>
        {loading ? (
          <p className="text-center">Loading posts...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{post.author}</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="text-center mt-8">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
            View All Posts
          </button>
        </div>
      </div>
    </section>
  )
}

export default Blog