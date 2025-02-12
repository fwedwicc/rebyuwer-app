import React, { useState, useEffect } from 'react'
import api from '../utils/api'
import { Link } from 'react-router-dom'

const Home = () => {
  const [user, setUser] = useState(null)
  const [cardSets, setCardSets] = useState([])
  const [cards, setCards] = useState({})

  // Card Sets Form
  const [cardSetLoading, setCardSetLoading] = useState(false)
  const [cardSetError, setCardSetError] = useState('')
  const [cardSetFormData, setCardSetFormData] = useState({
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

  // Card Set Submit
  const handleCardSetSubmit = async (e) => {
    e.preventDefault()

    setCardSetLoading(true)
    setCardSetError('')

    try {
      await api.post('/cardSet', cardSetFormData)
      setCardSetFormData({
        name: ''
      })
    } catch (err) {
      setCardSetError(err.response.data.message)
    } finally {
      setCardSetLoading(false)
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

  return (
    <div>
      <h1>Home Peyds</h1>
      <button onClick={handleLogout}>Logout</button>
      {/* Greeting */}
      <h2>Hello {user?.username}</h2>
      {/* Add Card Set Form */}
      <form onSubmit={handleCardSetSubmit} className='border border-yellow-500 p-4'>
        <input
          type="text"
          placeholder="Name"
          value={cardSetFormData.name}
          onChange={(e) => setCardSetFormData({ ...cardSetFormData, name: e.target.value })}
        />
        {/* Error Message */}
        {cardSetError && <p>{cardSetError}</p>}
        {/* Submit Button */}
        <button type="submit" disabled={cardSetLoading} className='rounded-md px-3 py-1.5 border'>
          {cardSetLoading ? 'Submitting...' : 'Add card set'}
        </button>
      </form>
      {/* Card Sets */}
      <div className='border border-green-500 p-4'>
        {Array.isArray(cardSets) && cardSets.length > 0 ? (
          cardSets.map((set) => (
            <Link key={set._id} to={`/card-set/${set._id}`} className='block border border-blue-500 p-4'>
              <p>Name: {set.name}</p>
              <p>Card count: {set.cards.length}</p>
            </Link>
          ))
        ) : (
          <li>No card set available</li>
        )}
      </div>
    </div>
  )
}

export default Home
