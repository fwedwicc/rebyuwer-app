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
  const [cardDeleteLoading, setCardDeleteLoading] = useState(false)

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
    setCardDeleteLoading((prev) => ({ ...prev, [cardId]: true }))
    try {
      await api.delete(`/card/${id}/${cardId}`)
      setCards((prevCards) => prevCards.filter((card) => card._id !== cardId))
    } catch (error) {
      console.error('Error deleting card:', error)
    } finally {
      setCardDeleteLoading((prev) => ({ ...prev, [cardId]: false }))
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
            {/* Play Button */}
            {cards.length === 0 ? (
              // Dummy disabled button when the card set has no cards
              <button
                className="fixed group bottom-12 right-12 rounded-full size-13 flex items-center justify-center leading-none border-t bg-indigo-900/5 border-indigo-700 transition-all duration-300 ease-in-out cursor-not-allowed overflow-hidden opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-7 text-indigo-400">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                </svg>
                <span className='size-2 rounded-full absolute bottom-0 bg-indigo-700 blur-sm' />
              </button>
            ) : (
              // Actual button itey
              <Link
                to={`/play/${id}`}
                className="fixed group bottom-12 right-12 rounded-full size-13 flex items-center justify-center leading-none border-t bg-indigo-900/5 border-indigo-700 transition-all duration-300 ease-in-out cursor-pointer overflow-hidden"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-7 transition-all duration-300 ease-in-out text-indigo-400 group-hover:size-7">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                </svg>
                <span className='size-2 rounded-full absolute bottom-0 bg-indigo-700 transition-all duration-300 ease-in-out blur-sm' />
              </Link>
            )}
            {/* Cards List */}
            <div className='md:text-base text-sm pb-4'><span className='text-stone-100'>{cards.length} cards</span> waiting—ready to start learning?</div>
            {Array.isArray(cards) && cards.length > 0 ? (
              <AnimatePresence initial={false}>
                {cards.map((card) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0.5,
                      transition: { duration: 0.2 },
                    }}
                    transition={{
                      duration: 0.2,
                      scale: { type: "spring", visualDuration: 0.2, bounce: 0.2 },
                    }}
                    layout
                    key={card._id}
                    className='border-l border-t border-stone-800/50 bg-stone-900/20 p-2 grid md:grid-cols-2 grid-cols-1 gap-2 rounded-3xl mb-3'
                  >
                    <div>
                      <p className='pb-2 pl-3 leading-none text-stone-400 text-xs'>Front</p>
                      <div className='border border-stone-900 px-3 py-2 rounded-xl'>{card.question}</div>
                    </div>
                    <div>
                      <p className='pb-2 pl-3 leading-none text-stone-400 text-xs'>Back</p>
                      <div className='border border-stone-900 px-3 py-2 rounded-xl'>{card.answer}</div>
                    </div>

                    <div className='col-span-full flex justify-end gap-2'>
                      <button
                        className="flex items-center md:text-base text-sm gap-1.5 rounded-xl px-3 py-2 bg-stone-900/50 hover:bg-stone-900/70 transition-all duration-300 ease-in-out cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.8} stroke="currentColor" className="size-5 text-stone-300">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCard(card._id)}
                        className={`${cardDeleteLoading[card._id] ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'} flex items-center md:text-base text-sm gap-1.5 rounded-xl px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 transition-all duration-300 ease-in-out`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.8} stroke="currentColor" className="size-5 text-stone-300">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                        {cardDeleteLoading[card._id] ? 'Deleting...' : 'Delete'}
                      </button>
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
              className="flex flex-col gap-1 justify-center items-center py-4 w-full rounded-3xl bg-stone-900/30 hover:bg-stone-900/40 transition duration-300 ease-in-out cursor-pointer mb-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.8} stroke="currentColor" className="text-stone-300 size-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
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
                    transition: { duration: 0.2 },
                  }}
                  transition={{
                    duration: 0.2,
                    scale: { type: "spring", visualDuration: 0.2, bounce: 0.2 },
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
