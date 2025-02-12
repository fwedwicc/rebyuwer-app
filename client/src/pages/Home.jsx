import React, { useState, useEffect } from 'react'
import api from '../utils/api'

const Home = () => {
  const [user, setUser] = useState(null)
  const [cardSets, setCardSets] = useState([])
  const [cards, setCards] = useState({})
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

  // Fetch Card Set
  useEffect(() => {
    const fetchCardSets = async () => {
      try {
        const response = await api.get('/cardSet')
        setCardSets(response.data)
      } catch (error) {
        console.log('Error fetching cards:', error)
      }
    }

    fetchCardSets()
    const interval = setInterval(fetchCardSets, 5000)
    return () => clearInterval(interval)
  }, [])

  // Fetch Cards for Each Card Set
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const fetchedCards = {}

        await Promise.all(
          cardSets.map(async (set) => {
            const response = await api.get(`/card/${set._id}`)
            fetchedCards[set._id] = response.data.data // Store cards by cardSetId
          })
        )

        setCards(fetchedCards) // Update state with fetched cards
      } catch (error) {
        console.error('Error fetching cards:', error.response || error)
      }
    }

    if (cardSets.length > 0) {
      fetchCards()
    }
  }, [cardSets])

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
      <div className='border border-green-500 p-4'>
        {Array.isArray(cardSets) && cardSets.length > 0 ? (
          cardSets.map((set) => (
            <li key={set._id}>
              <p>Name: {set.name}</p>
              {/* Cards */}
              {Array.isArray(cards[set._id]) && cards[set._id].length > 0 ? (
                <ul>
                  {cards[set._id].map((card) => (
                    <li key={card._id}>
                      <p>{card.question}</p>
                      <p>{card.answer}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No cards available</p>
              )}
            </li>
          ))
        ) : (
          <li>No card set available</li>
        )}
      </div>
    </div>
  )
}

export default Home
