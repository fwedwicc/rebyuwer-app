import React, { useState, useEffect, useRef } from 'react'
import * as motion from "motion/react-client"
import { AnimatePresence } from "motion/react"
import { Spinner } from '../components/ui'
import toast, { Toaster } from 'react-hot-toast'
import Swal from 'sweetalert2'
import { useParams, Link } from 'react-router-dom'
import api from '../utils/api'

const Play = () => {
  const [cards, setCards] = useState([])
  const [originalCards, setOriginalCards] = useState([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [score, setScore] = useState(0)
  const [gameFinished, setGameFinished] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [loading, setLoading] = useState(true)
  const { id } = useParams() // Get card set ID from URL

  // Loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Fetch Cards for the Given Card Set
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await api.get(`/card/${id}`)
        setCards(response.data.data)
        setOriginalCards(response.data.data) // Store original order
      } catch (error) {
        console.error('Error fetching cards:', error.response || error)
        toast.error('Failed to load flashcards')
      }
    }

    fetchCards()
  }, [id])

  // Handle the flip
  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1)
      toast.success('Correct :)', {
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
    } else {
      toast.error('Incorrect :(', {
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

    // Move to next card
    if (currentCardIndex < cards.length - 1) {
      setTimeout(() => {
        setCurrentCardIndex(currentCardIndex + 1)
      }, 200)
      setIsFlipped(false) // Reset flip state for new card
    } else {
      setGameFinished(true)
    }
  }

  const resetGame = () => {
    Swal.fire({
      title: "Reset this game?",
      text: 'Your current progress will be lost!',
      icon: 'warning',
      showCancelButton: true,
      iconColor: "#fb7185",
      showCancelButton: true,
      confirmButtonText: "Yes, reset it",
      cancelButtonText: "Cancel",
      customClass: {
        title: "swal-title",
        text: "swal-text",
        popup: "swal-popup",
        confirmButton: "swal-confirm-danger",
        cancelButton: "swal-cancel",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setCurrentCardIndex(0)
        setIsFlipped(false)
        setScore(0)
        setGameFinished(false)
        toast.success('Game has been reset :)', {
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
      }
    })
  }

  const toggleShuffleMode = async (e) => {
    const shouldShuffle = e.target.checked

    const result = await Swal.fire({
      title: shouldShuffle ? "Shuffle Cards?" : "Restore Original Order?",
      text: shouldShuffle
        ? "Are you sure you want to shuffle the cards? This will reset your progress."
        : "Do you want to restore the original card order?",
      icon: "warning",
      iconColor: "#fb7185",
      showCancelButton: true,
      confirmButtonText: shouldShuffle ? "Yes, Shuffle" : "Yes, Restore",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        title: "swal-title",
        text: "swal-text",
        popup: "swal-popup",
        confirmButton: "swal-confirm-danger",
        cancelButton: "swal-cancel",
      },
    });

    if (!result.isConfirmed) {
      // If the user cancels, revert the checkbox state
      e.target.checked = !shouldShuffle
      return
    }

    setIsShuffled(shouldShuffle)

    if (shouldShuffle) {
      // Shuffle the cards
      const shuffled = [...originalCards].sort(() => Math.random() - 0.5)
      setCards(shuffled)
    } else {
      // Restore original order
      setCards([...originalCards])
    }

    // Reset game state
    setCurrentCardIndex(0)
    setIsFlipped(false)
    setScore(0)
    setGameFinished(false)

    toast.success(shouldShuffle ? "Cards shuffled :)" : "Original order restored :)", {
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
  }


  // DISPLAY: If no cards in the set
  if (cards.length === 0) {
    return <motion.div
      className='flex flex-col justify-center items-center text-center h-screen'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      Your set are empty, maybe create some cards first :)
      <Link to={`/card-set/${id}`} className='text-indig-400 underline'>Go to set</Link>
    </motion.div>
  }

  if (gameFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="p-8 rounded-lg shadow-lg text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">Game Finished!</h1>
          <p className="text-xl mb-6">
            Your score: <span className="font-bold text-green-600">{score}</span> out of {cards.length}
          </p>
          <p className="text-lg mb-8">
            Percentage: <span className="font-bold">{Math.round((score / cards.length) * 100)}%</span>
          </p>
          <button
            onClick={resetGame}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    )
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

  const currentCard = cards[currentCardIndex]

  return (
    <>
      {loading ?
        <div className='h-screen flex justify-center items-end'>
          <Spinner mode='light' />
        </div>
        : (
          <motion.div
            className='h-screen flex flex-col justify-center items-center relative md:p-0 p-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Toaster position="top-right" />
            {/*  */}
            <div className="md:px-24 px-4 absolute flex justify-between items-center top-0 text-center w-full pt-24">
              {/* Progress Bar */}
              <div className="absolute w-full h-[2px] top-0 left-0">
                <div
                  className="h-full transition-all duration-300 rounded-r-full bg-gradient-to-r from-violet-200 via-violet-400 to-indigo-600 bg-[length:150%_150%] animate-gradientMove"
                  style={{ width: `${((currentCardIndex + 1) / cards.length) * 100}%` }}
                />
              </div>
              {/* <h2>{currentCardIndex + 1} of {cards.length}</h2> */}
              <h2>Score: <span className='text-indigo-400'>{score}</span></h2>
              {/* Game control buttons and shuffle toggle */}
              <div className="flex flex-wrap justify-center gap-3 border border-yellow-500">
                <button
                  onClick={resetGame}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Reset
                </button>

                <div className="flex items-center">
                  <label htmlFor="shuffle-toggle" className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        id="shuffle-toggle"
                        type="checkbox"
                        className="sr-only"
                        checked={isShuffled}
                        onChange={toggleShuffleMode}
                      />
                      <div className="block bg-gray-300 w-14 h-8 rounded-full"></div>
                      <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isShuffled ? 'transform translate-x-6' : ''}`}></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            {/* Main Card Container */}
            <div className="relative w-full max-w-md h-[70%] perspective mt-18" style={{ perspective: '1000px' }}>
              <div
                className={`w-full h-full transition-all duration-500 border-2 outline outline-offset-4 outline-stone-800 ${isFlipped ? 'border-indigo-400 shadow-2xl shadow-indigo-500/20' : 'border-violet-400/10'} rounded-3xl transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* Front of card (Question) */}
                <div className="absolute w-full h-full rounded-xl shadow-lg p-4 flex flex-col justify-between gap-4 backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
                  <div className='flex justify-start items-start overflow-auto p-4'>
                    <p className="text-lg text-center leading-6 text-stone-200">{formatTextAsList(currentCard.question)}</p>
                  </div>
                  <div className="flex justify-center">
                    <button onClick={handleFlip} className="group bg-indigo-700/30 flex items-center justify-center rounded-full size-12 hover:bg-indigo-700/40 transition-all duration-300 ease-in-out cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-6 text-stone-300 group-hover:rotate-180 transition-all duration-300 ease-in-out">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                    </button>
                  </div>
                </div>
                {/* Back of card (Answer) */}
                <div
                  className="absolute w-full h-full rounded-xl shadow-lg p-6 flex flex-col justify-between backface-hidden rotate-y-180"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <div className='flex justify-start items-start overflow-auto p-4'>
                    <p className="text-lg text-center leading-6 text-stone-200">{formatTextAsList(currentCard.answer)}</p>
                  </div>
                  <div className="flex justify-center gap-12">
                    {/* Correct */}
                    <button onClick={() => handleAnswer(true)} className="bg-teal-700/30 flex items-center justify-center rounded-full size-12 hover:bg-teal-700/40 transition-all duration-300 ease-in-out cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-6 text-teal-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </button>
                    {/* Wrong */}
                    <button onClick={() => handleAnswer(false)} className="bg-rose-700/30 flex items-center justify-center rounded-full size-12 hover:bg-rose-700/40 transition-all duration-300 ease-in-out cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-rose-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
    </>
  )
}

export default Play