import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../utils/api'

const Cards = () => {
  const { id } = useParams() // Get card set ID from URL
  const [cards, setCards] = useState([])
  const [cardSetDetails, setCardSetDetails] = useState([])
  const [cardLoading, setCardLoading] = useState(false)
  const [cardError, setCardError] = useState('')
  const [cardFormData, setCardFormData] = useState({
    question: '',
    answer: ''
  })

  // Fetch Card Set Details
  useEffect(() => {
    const fetchCardSetDetails = async () => {
      try {
        const response = await api.get(`/cardSet`)
        const currentCardSet = response.data.find(set => set._id === id) // Find by ID
        setCardSetDetails(currentCardSet)
      } catch (error) {
        console.log('Error fetching cards:', error)
      }
    }

    fetchCardSetDetails()
    const interval = setInterval(fetchCardSetDetails, 5000)
    return () => clearInterval(interval)
  }, [id])

  // Fetch Cards for the Given Card Set
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await api.get(`/card/${id}`)
        setCards(response.data.data)
      } catch (error) {
        console.error('Error fetching cards:', error.response || error)
      }
    }

    fetchCards()
  }, [id])

  // Handle Input Change
  const handleCardInputChange = (e) => {
    setCardFormData({
      ...cardFormData,
      [e.target.name]: e.target.value
    })
  }

  // Handle Card Submission
  const handleCardSubmit = async (e) => {
    e.preventDefault()
    setCardLoading(true)
    setCardError('')

    try {
      await api.post(`/card/${id}`, cardFormData)
      setCardFormData({ question: '', answer: '' }) // Reset form

      // Fetch updated cards after submission
      const response = await api.get(`/card/${id}`)
      setCards(response.data.data)
    } catch (err) {
      setCardError(err.response.data.message)
    } finally {
      setCardLoading(false)
    }
  }

  // Delete Card
  const handleDeleteCard = async (cardId) => {
    try {
      await api.delete(`/card/${id}/${cardId}`)

      setCards((prevCards) => prevCards.filter((card) => card._id !== cardId))
    } catch (error) {
      console.error('Error deleting card:', error)
    }
  }

  return (
    <div>
      <p>Name: {cardSetDetails.name}</p>
      {/* Add Cards Form */}
      <form onSubmit={handleCardSubmit}>
        <input
          type="text"
          name="question"
          placeholder="Question"
          value={cardFormData.question}
          onChange={handleCardInputChange}
          className='rounded-md px-3 py-1.5 border'
        />
        <input
          type="text"
          name="answer"
          placeholder="Answer"
          value={cardFormData.answer}
          onChange={handleCardInputChange}
          className='rounded-md px-3 py-1.5 border'
        />
        {/* Error Message */}
        {cardError && <p>{cardError}</p>}
        {/* Submit */}
        <button type="submit" disabled={cardLoading} className='rounded-md px-3 py-1.5 border'>
          {cardLoading ? 'Submitting...' : 'Add Card'}
        </button>
      </form>
      {/* Cards List */}
      {Array.isArray(cards) && cards.length > 0 ? (
        <ul>
          {cards.map((card) => (
            <li key={card._id} className='border p-2'>
              <p>Front: {card.question}</p>
              <p>Back: {card.answer}</p>
              <button
                onClick={() => handleDeleteCard(card._id)}
                className='rounded-md px-3 py-1.5 border'>Delete Card</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No cards available</p>
      )}
    </div>
  )
}

export default Cards
