import React, { useState, useEffect } from 'react'
import api from '../utils/api'

const Home = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: ''
  })

  // Handle the logout func
  const handleLogout = () => {
    localStorage.removeItem('token')
    alert('Logged out successfully')
    window.location.href = '/login'
  }

  // Fetch the current user's data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/user/me')
        setUser(response.data)
      } catch (error) {
        console.log('Error fetching user data:', error)
      }
    }

    fetchUser()
    const interval = setInterval(fetchUser, 5000)
    return () => clearInterval(interval)
  }, [])

  // HandleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError('')

    try {
      await api.post('/cardSet', formData)
      setFormData({
        name: ''
      })
    } catch (err) {
      setError(err.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Home Peyds</h1>
      <button onClick={handleLogout}>Logout</button>
      {/* Greeting */}
      <h2>Hello {user?.username}</h2>
      {/* Form */}
      <form onSubmit={handleSubmit} className='border border-yellow-500 p-4'>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        {/* Error Message */}
        {error && <p>{error}</p>}
        {/* Submit Button */}
        <button type="submit" disabled={loading} className='rounded-md px-3 py-1.5 border'>
          {loading ? 'Submitting...' : 'Add card set'}
        </button>
      </form>
      {/* Card Sets */}
      <div className='border border-green-500 p-4'></div>
    </div>
  )
}

export default Home
