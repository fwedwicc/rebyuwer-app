import React, { useState, useEffect } from 'react'
import api from '../utils/api'

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

  // Card Form
  const [cardLoading, setCardLoading] = useState(false)
  const [cardError, setCardError] = useState('')
  const [cardFormData, setCardFormData] = useState({
    question: '',
    answer: ''
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


  // Card Input
  const handleCardInputChange = (e, cardSetId) => {
    setCardFormData((prev) => ({
      ...prev,
      [cardSetId]: {
        ...prev[cardSetId],
        [e.target.name]: e.target.value
      }
    }))
  }

  // Card Submit
  const handleCardSubmit = async (e, cardSetId) => {
    e.preventDefault()

    setCardLoading(true)
    setCardError('')

    try {
      await api.post(`/card/${cardSetId}`, cardFormData[cardSetId])
      setCardFormData((prev) => ({
        ...prev,
        [cardSetId]: { question: "", answer: "" } // Reset only that set
      }))
    } catch (err) {
      setCardError(err.response.data.message)
    } finally {
      setCardLoading(false)
    }
  }

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
            <li key={set._id}>
              <p>Name: {set.name}</p>
              {/* Add Cards Form */}
              <form onSubmit={(e) => handleCardSubmit(e, set._id)}>
                <input
                  type="text"
                  name="question"
                  placeholder="Question"
                  value={cardFormData[set._id]?.question}
                  onChange={(e) => handleCardInputChange(e, set._id)}
                />
                <input
                  type="text"
                  name="answer"
                  placeholder="Answer"
                  value={cardFormData[set._id]?.answer}
                  onChange={(e) => handleCardInputChange(e, set._id)}
                />
                {/* Error Message */}
                {cardError && <p>{cardError}</p>}
                {/* Submit */}
                <button type="submit" disabled={cardLoading}>
                  {cardLoading ? "Submitting..." : "Add Card"}
                </button>
              </form>
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
