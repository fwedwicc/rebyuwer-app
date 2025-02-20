import React, { useState, useEffect } from 'react'
import * as motion from "motion/react-client"
import { AnimatePresence } from "motion/react"
import api from '../utils/api'
import { Link } from 'react-router-dom'

const Home = () => {
  const [user, setUser] = useState(null)
  const [cardSets, setCardSets] = useState([])

  // Card Sets Form
  const [cardSetLoading, setCardSetLoading] = useState(false)
  const [cardSetError, setCardSetError] = useState('')
  const [cardSetFormData, setCardSetFormData] = useState({
    name: ''
  })

  // Handle the logout func
  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) {
      return
    }
    localStorage.removeItem('token')
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

  // Delete Card Set
  const handleDeleteCardSet = async (id) => {
    if (!window.confirm("Are you sure you want to delete this card set?")) {
      return
    }
    try {
      await api.delete(`/cardSet/${id}`)
      setCardSets(cardSets.filter((set) => set._id !== id))
    } catch (error) {
      console.log('Error fetching cards:', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className='w-full max-w-md'
    >
      <h1>Home Peyds</h1>
      <button onClick={handleLogout} className='rounded-md px-3 py-1.5 border'>Logout</button>
      {/* Greeting */}
      <h2>Hello {user?.username}</h2>
      {/* Add Card Set Form */}
      <form onSubmit={handleCardSetSubmit} className='border p-4'>
        <input
          type="text"
          placeholder="Name"
          value={cardSetFormData.name}
          onChange={(e) => setCardSetFormData({ ...cardSetFormData, name: e.target.value })}
          className='rounded-md px-3 py-1.5 border'
        />
        {/* Error Message */}
        {cardSetError && <p>{cardSetError}</p>}
        {/* Submit Button */}
        <button type="submit" disabled={cardSetLoading} className='rounded-md px-3 py-1.5 border'>
          {cardSetLoading ? 'Submitting...' : 'Add card set'}
        </button>
      </form>
      {/* Card Sets */}
      <div className='border p-4'>
        <AnimatePresence initial={false}>
          {Array.isArray(cardSets) && cardSets.length > 0 ? (
            cardSets.map((set) => (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0,
                  transition: { duration: 0.3 },
                }}
                transition={{
                  duration: 0.4,
                  scale: { type: "spring", visualDuration: 0.4, bounce: 0.3 },
                }}
                layout
                key={set._id}
                className='block border p-4'
              >
                <p>Name: {set.name}</p>
                <p>Card count: {set.cards.length}</p>
                <Link to={`/card-set/${set._id}`} className='rounded-md px-3 py-1.5 border'>View</Link>
                <button onClick={() => handleDeleteCardSet(set._id)} className='rounded-md px-3 py-1.5 border'>Delete</button>
              </motion.div>
            ))
          ) : (
            <li>No card set available</li>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default Home
