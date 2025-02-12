import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../utils/api'

const Cards = () => {
  const { id } = useParams() // Get card set ID from URL
  const [cards, setCards] = useState([])
  const [cardLoading, setCardLoading] = useState(false)
  const [cardError, setCardError] = useState('')
  const [cardFormData, setCardFormData] = useState({
    question: '',
    answer: ''
  })

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

  return (
    <div>
      <h1>Card Set</h1>
      {/* Add Cards Form */}
      <form onSubmit={handleCardSubmit}>
        <input
          type="text"
          name="question"
          placeholder="Question"
          value={cardFormData.question}
          onChange={handleCardInputChange}
        />
        <input
          type="text"
          name="answer"
          placeholder="Answer"
          value={cardFormData.answer}
          onChange={handleCardInputChange}
        />
        {/* Error Message */}
        {cardError && <p>{cardError}</p>}
        {/* Submit */}
        <button type="submit" disabled={cardLoading}>
          {cardLoading ? 'Submitting...' : 'Add Card'}
        </button>
      </form>
      {/* Cards List */}
      {Array.isArray(cards) && cards.length > 0 ? (
        <ul>
          {cards.map((card) => (
            <li key={card._id}>
              <p>{card.question}</p>
              <p>{card.answer}</p>
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
