import React, { useState, useEffect } from 'react'
import * as motion from "motion/react-client"
import { AnimatePresence } from "motion/react"
import { useParams } from 'react-router-dom'
import api from '../utils/api'

const Cards = () => {
  const { id } = useParams() // Get card set ID from URL
  const [cards, setCards] = useState([])
  const [cardSetDetails, setCardSetDetails] = useState([])
  const [cardLoading, setCardLoading] = useState(false)
  const [cardError, setCardError] = useState('')
  const [newCard, setNewCard] = useState(null) // Store the new empty card

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

  // Handle Input Change for New Card
  const handleNewCardChange = (e) => {
    setNewCard({
      ...newCard,
      [e.target.name]: e.target.value
    })
  }

  // Add an empty card when clicking "Add Card"
  const handleAddNewCard = () => {
    setNewCard({ question: '', answer: '' })
  }

  // Handle Card Submission
  const handleCardSubmit = async (e) => {
    e.preventDefault()
    setCardLoading(true)
    setCardError('')

    try {
      await api.post(`/card/${id}`, newCard)
      setNewCard(null) // Reset form

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className='w-full max-w-md'
    >
      {/* Card Set Detail */}
      <p>Name: {cardSetDetails.name}</p>

      {/* Cards List */}
      {Array.isArray(cards) && cards.length > 0 ? (
        <AnimatePresence initial={false}>
          {cards.map((card) => (
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
              key={card._id}
              className='border p-2'
            >
              <p>Front: {card.question}</p>
              <p>Back: {card.answer}</p>
              <button
                onClick={() => handleDeleteCard(card._id)}
                className='rounded-md px-3 py-1.5 border'>Delete Card</button>
            </motion.div>
          ))}
        </AnimatePresence>
      ) : (
        <p>No cards available</p>
      )}

      {/* New Card Input Fields */}
      <AnimatePresence initial={false}>
        {newCard && (
          <motion.div
            className='border p-2 space-x-2'
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
          >
            <input
              type="text"
              name="question"
              placeholder="Question"
              value={newCard.question}
              onChange={handleNewCardChange}
              className='rounded-md px-3 py-1.5 border'
            />
            <input
              type="text"
              name="answer"
              placeholder="Answer"
              value={newCard.answer}
              onChange={handleNewCardChange}
              className='rounded-md px-3 py-1.5 border'
            />

            <button
              onClick={handleCardSubmit}
              className='rounded-md px-3 py-1.5 border'
              disabled={cardLoading}
            >
              {cardLoading ? 'Saving...' : 'Save Card'}
            </button>
            <button
              onClick={() => setNewCard(null)}
              className='rounded-md px-3 py-1.5 border'
            >
              Cancel
            </button>
          </motion.div>
        )}
        {/* Error Message */}
        {cardError && <p className="text-red-500">{cardError}</p>}
      </AnimatePresence>

      {/* Add Card Button */}
      <button
        onClick={handleAddNewCard}
        className="rounded-md px-3 py-1.5 border mb-3"
      >
        Add Card
      </button>
    </motion.div>
  )
}

export default Cards
