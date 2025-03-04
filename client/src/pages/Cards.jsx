import React, { useState, useEffect, useRef } from 'react'
import * as motion from "motion/react-client"
import { AnimatePresence } from "motion/react"
import toast, { Toaster } from 'react-hot-toast'
import { Link, useParams } from 'react-router-dom'
import api from '../utils/api'

const Cards = () => {
  const { id } = useParams() // Get card set ID from URL
  const [cards, setCards] = useState([])
  const [cardSetDetails, setCardSetDetails] = useState([])
  const [cardLoading, setCardLoading] = useState(false)
  const [newCard, setNewCard] = useState(null) // Store the new empty card
  const bottomRef = useRef(null)
  const [isAddingCard, setIsAddingCard] = useState(false) // Track if a card is being added
  const [loading, setLoading] = useState(true)

  // Loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

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

  // Scroll to bottom when new card is added
  useEffect(() => {
    if (isAddingCard) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
      setIsAddingCard(false) // Reset after scrolling
    }
  }, [cards])

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
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
    setIsAddingCard(true)
  }

  // Handle Card Submission
  const handleCardSubmit = async (e) => {
    e.preventDefault()
    setCardLoading(true)

    try {
      await api.post(`/card/${id}`, newCard)
      setNewCard(null) // Reset form

      // Fetch updated cards after submission
      const response = await api.get(`/card/${id}`)
      setCards(response.data.data)
    } catch (err) {
      toast.error(err.response.data.message, {
        style: {
          border: "1px solid rgba(229, 231, 235, 0.8)", // border-neutral-200/80
          boxShadow: "0px 4px 6px rgba(229, 231, 235, 0.3)", // shadow-md shadow-neutral-200/30
          borderRadius: "2rem",
          padding: '10px',
          paddingY: '20px',
          color: '#ef4444',
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#fff',
        },
      })
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
    <>
      {loading ?
        <div className='h-screen flex justify-center items-center'>
          Launching {cardSetDetails.name}
        </div>
        : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className='md:pt-36 pt-28 md:px-48 px-4 md:pb-28 pb-4'
          >
            <Toaster position="top-right" />
            {/* Cards List */}
            <div className='md:text-base text-sm pb-4'><span className='text-stone-100'>{cards.length} cards</span> waiting—ready to start learning?
              {cards.length === 0 ? (
                // Dummy disabled button when the card set has no cards
                <span className='flex items-center md:text-base text-sm gap-2 rounded-xl px-3 py-2 opacity-50 cursor-not-allowed'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.8} stroke="currentColor" className="size-5 text-stone-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                  </svg>
                  Play
                </span>
              ) : (
                // Actual button itey
                <Link
                  to={`/play/${id}`}
                  className="flex items-center md:text-base text-sm gap-2 rounded-xl px-3 py-2 hover:bg-stone-900/50 transition-all duration-300 ease-in-out"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.8} stroke="currentColor" className="size-5 text-stone-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                  </svg>
                  Play
                </Link>
              )}
            </div>
            {Array.isArray(cards) && cards.length > 0 ? (
              <AnimatePresence initial={false}>
                {cards.map((card) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0.5,
                      transition: { duration: 0.3 },
                    }}
                    transition={{
                      duration: 0.3,
                      scale: { type: "spring", visualDuration: 0.3, bounce: 0.2 },
                    }}
                    layout
                    key={card._id}
                    className='border border-stone-800 p-2 grid md:grid-cols-2 grid-cols-1 gap-2 rounded-2xl mb-3'
                  >
                    <div className='border px-2.5 py-2 rounded-xl'>Front: {card.question}</div>
                    <div className='border px-2.5 py-2 rounded-xl'>Back: {card.answer}</div>
                    <div className='col-span-full flex justify-end'>
                      <button className='rounded-md px-3 py-1.5 border'>Edit Card</button>
                      <button
                        onClick={() => handleDeleteCard(card._id)}
                        className='rounded-md px-3 py-1.5 border'>Delete Card</button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <p>No cards available</p>
            )}

            {/* Add Card Button */}
            <button
              onClick={handleAddNewCard}
              className="rounded-md px-3 py-1.5 border mb-3"
            >
              Add Card
            </button>

            {/* New Card Input Fields */}
            <AnimatePresence initial={false}>
              {newCard && (
                <motion.div
                  className='border p-2  flex flex-col w-full'
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.5,
                    transition: { duration: 0.3 },
                  }}
                  transition={{
                    duration: 0.3,
                    scale: { type: "spring", visualDuration: 0.3, bounce: 0.2 },
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
            </AnimatePresence>
            <div ref={bottomRef} />
          </motion.div>)}
    </>
  )
}

export default Cards
