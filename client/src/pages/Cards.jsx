import React, { useState, useEffect, useRef } from 'react'
import * as motion from "motion/react-client"
import { AnimatePresence } from "motion/react"
import { Spinner } from '../components/ui'
import toast, { Toaster } from 'react-hot-toast'
import Swal from 'sweetalert2'
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
      setLoading(false)
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
    const { name, value } = e.target

    // Detect Enter key press and auto-format list
    if (e.nativeEvent.inputType === "insertLineBreak") {
      const lines = value.split("\n")
      const lastLine = lines[lines.length - 2] // Get the previous line

      if (lastLine && lastLine.trim().startsWith("-")) {
        e.target.value = value + "- " // Insert '- ' for the new line
      }
    }

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

  const closeNewCard = () => {
    setNewCard(null)
    setIsAddingCard(false)
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
      toast.error(err.response.data.message + ' :(', {
        style: {
          border: "1px solid #262626",
          background: "rgba(12, 10, 9)",
          borderRadius: "2rem",
          padding: '10px',
          paddingLeft: '13px',
          color: '#fb7185',
        },
        iconTheme: {
          primary: '#fb7185',
          secondary: '#0c0a09',
        },
      })
    } finally {
      setCardLoading(false)
    }
  }


  // Handle Edit Card Sets
  const handleEdit = async (card) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Card',
      html: `
        <div class="space-y-4 text-left grid md:grid-cols-2 grid-cols-1 gap-2">
          <div>
            <label class="block text-sm font-medium text-stone-300">Front</label>
            <textarea
              id="swal-question"
              class="mt-1 block w-full py-2 px-3 border rounded-xl text-stone-300 transition-all duration-300 ease-in-out focus:outline-none focus:ring focus:ring-indigo-400 border-stone-800 resize-none overflow-hidden"
              rows="2"
              oninput="this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px';"
            >${card.question || ''}</textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-stone-300">Back</label>
            <textarea
              id="swal-answer"
              class="mt-1 block w-full py-2 px-3 border rounded-xl text-stone-300 transition-all duration-300 ease-in-out focus:outline-none focus:ring focus:ring-indigo-400 border-stone-800 resize-none overflow-hidden"
              rows="2"
              oninput="this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px';"
            >${card.answer || ''}</textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Update',
      customClass: {
        title: "swal-title",
        text: "swal-text",
        popup: "swal-popup-lg",
        confirmButton: "swal-confirm-confirm",
        cancelButton: "swal-cancel",
      },
      didOpen: () => {
        // Attach event listener after Swal has been rendered
        document.getElementById("swal-question").addEventListener("change", handleNewCardChange);
        document.getElementById("swal-answer").addEventListener("change", handleNewCardChange);
      },
      preConfirm: () => {
        return {
          question: document.getElementById('swal-question').value,
          answer: document.getElementById('swal-answer').value
        }
      }
    })

    if (formValues) {
      try {
        const updateFormData = {
          question: formValues.question,
          answer: formValues.answer
        }

        await api.put(`/card/${id}/${card._id}`, updateFormData)

        // Update Cards state with the updated Cards
        setCards((prevCards) =>
          prevCards.map((item) =>
            item._id === card._id ? { ...item, question: formValues.question, answer: formValues.answer } : item
          )
        );

        toast.success('Card updated :)', {
          style: {
            border: "1px solid #262626",
            background: "rgba(12, 10, 9)",
            borderRadius: "2rem",
            padding: '10px',
            paddingLeft: '13px',
            color: '#34d399',
          },
          iconTheme: {
            primary: '#34d399',
            secondary: '#0c0a09',
          },
        })
      } catch (error) {
        toast.error('Failed to update :(', {
          style: {
            border: "1px solid #262626",
            background: "rgba(12, 10, 9)",
            borderRadius: "2rem",
            padding: '10px',
            paddingLeft: '13px',
            color: '#fb7185',
          },
          iconTheme: {
            primary: '#fb7185',
            secondary: '#0c0a09',
          },
        })
      }
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

  const formatTextAsList = (text) => {
    const lines = text.split("\n") // Split by new lines

    // Check if any line starts with "-"
    const isList = lines.every(line => line.trim().startsWith("-"))

    if (isList) {
      return (
        <ul className="list-disc pl-4">
          {lines.map((line, index) => (
            <li key={index}>{line.replace(/^- /, "").trim()}</li>
          ))}
        </ul>
      )
    }

    return <p>{text}</p> // Default if not a list
  }


  return (
    <>
      {loading ?
        <div className='h-screen flex flex-col text-center gap-1 justify-center items-center'>
          <Spinner mode='light' />
          Launching <br /> <h2 className='truncate w-full max-w-[15rem]'>{cardSetDetails.name || '...'}</h2>
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
            {cards.length > 0 && <div className='md:text-base text-sm mb-4'><span className='text-stone-100'>{cards.length} card/s</span>  available—keep building your deck!</div>}
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
                      <div className='border border-stone-900 px-3 py-2 rounded-xl md:text-base text-sm'>{formatTextAsList(card.question)}</div>
                    </div>
                    <div>
                      <p className='pb-2 pl-3 leading-none text-stone-400 text-xs'>Back</p>
                      <div className='border border-stone-900 px-3 py-2 rounded-xl md:text-base text-sm'>{formatTextAsList(card.answer)}</div>
                    </div>
                    <div className='col-span-full flex justify-end gap-2'>
                      <button
                        onClick={() => handleEdit(card)}
                        className="flex items-center md:text-base text-sm gap-1.5 rounded-xl px-3 py-2 bg-stone-900/50 hover:bg-stone-900/70 transition-all duration-300 ease-in-out cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.8} stroke="currentColor" className="size-5 text-stone-300">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCard(card._id)}
                        className={`${cardDeleteLoading[card._id] ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'} flex items-center md:text-base text-sm gap-1.5 rounded-xl px-3 py-2 bg-rose-700/20 hover:bg-rose-700/30 transition-all duration-300 ease-in-out`}
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
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                  transition: { duration: 0.4 },
                }}
                transition={{
                  duration: 0.2,
                  scale: { type: "spring", visualDuration: 0.4, bounce: 0.2 },
                }}
                layout
                className='w-full flex flex-col gap-2 justify-center items-center py-12 text-center'
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-10 text-stone-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
                <h2>No cards here yet :(</h2>
                <p>Try creating some to get started!</p>
              </motion.div>
            )}

            {/* Add Card Button */}
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
            >
              <button
                onClick={handleAddNewCard}
                className={`${isAddingCard ? 'hidden' : 'flex'} flex-col gap-1 justify-center items-center py-4 w-full rounded-3xl bg-stone-900/30 hover:bg-stone-900/40 transition duration-300 ease-in-out cursor-pointer mb-3`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.8} stroke="currentColor" className="text-stone-300 size-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Card
              </button>
            </motion.div>

            {/* New Card Input Fields */}
            <AnimatePresence initial={false}>
              {newCard && (
                <motion.div
                  className={`border-l border-t border-stone-800/50 bg-stone-900/20 p-2 grid md:grid-cols-2 grid-cols-1 gap-2 rounded-3xl`}
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
                  <div>
                    <p className='pb-2 pl-3 leading-none text-stone-400 text-xs'>Front</p>
                    <textarea
                      name="question"
                      placeholder="Question"
                      value={newCard.question}
                      onChange={handleNewCardChange}
                      onInput={(e) => {
                        e.target.style.height = "auto"
                        e.target.style.height = `${e.target.scrollHeight}px`
                      }}
                      className='rounded-xl border-stone-900 px-3 py-2 border w-full md:text-base text-sm transition duration-300 ease-in-out focus:ring focus:outline-none focus:ring-indigo-400 resize-none overflow-hidden'
                      rows={2}
                    />
                  </div>
                  <div>
                    <p className='pb-2 pl-3 leading-none text-stone-400 text-xs'>Back</p>
                    <textarea
                      name="answer"
                      placeholder="Answer"
                      value={newCard.answer}
                      onChange={handleNewCardChange}
                      onInput={(e) => {
                        e.target.style.height = "auto"
                        e.target.style.height = `${e.target.scrollHeight}px`
                      }}
                      className='rounded-xl border-stone-900 px-3 py-2 border w-full md:text-base text-sm transition duration-300 ease-in-out focus:ring focus:outline-none focus:ring-indigo-400 resize-none overflow-hidden'
                      rows={2}
                    />
                  </div>
                  <div className='col-span-full flex justify-end gap-2'>
                    <button
                      onClick={closeNewCard}
                      className="flex items-center md:text-base text-sm gap-1.5 rounded-xl px-3 py-2 bg-stone-900/50 hover:bg-stone-900/70 transition-all duration-300 ease-in-out cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCardSubmit}
                      disabled={cardLoading}
                      className={`${cardLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'} flex items-center md:text-base text-sm gap-1.5 rounded-xl px-3 py-2 bg-indigo-700/20 hover:bg-indigo-700/30 transition-all duration-300 ease-in-out`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.8} stroke="currentColor" className="size-5 text-stone-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      {cardLoading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </motion.div>)}
    </>
  )
}

export default Cards
