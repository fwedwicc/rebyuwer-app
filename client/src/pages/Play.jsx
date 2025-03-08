import React, { useState, useEffect, useRef } from 'react'
import * as motion from "motion/react-client"
import { AnimatePresence } from "motion/react"
import { Spinner, Button } from '../components/ui'
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
  const [percentage, setPercentage] = useState(0)

  // Loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

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
      setTimeout(() => {
        setGameFinished(true)
      }, 500)

    }
  }

  const resetGame = () => {
    Swal.fire({
      title: "Reset this game?",
      text: 'Your current progress will be lost!',
      icon: 'warning',
      showCancelButton: true,
      iconColor: "#fb7185",
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
    })

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

  // Progress Component
  const CircularProgress = ({ percentage }) => {
    const radius = 40
    const strokeWidth = 2
    const circumference = 2 * Math.PI * radius // Full circumference
    const progress = (percentage / 100) * circumference // Progress calculation

    return (
      <svg width="150" height="150" viewBox="0 0 100 100" className="mx-auto">
        {/* Background Circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#1c1917"
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgb(99, 102, 241)" // Indigo-400
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        {/* Percentage Text */}
        <text x="50" y="60" textAnchor="middle" fontSize="23" fill="white">
          {percentage}%
        </text>
      </svg>
    )
  }

  useEffect(() => {
    const calculatedPercentage = Math.round((score / cards.length) * 100)
    setPercentage(calculatedPercentage)
  }, [score, cards])


  // DISPLAY: If no cards in the set
  if (cards.length === 0) {
    return <motion.div
      className='flex flex-col justify-center items-center text-center h-screen gap-2'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="mb-3 size-10 text-stone-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
      <h2>No cards here yet :(</h2>
      <p>Try creating some to get started!</p>
      <Link to={`/card-set/${id}`} className='mt-7 md:text-base text-sm gap-2 md:px-5 px-4 py-2 rounded-full bg-stone-900/50 transition duration-300 ease-in-out hover:bg-stone-900/70'>
        Create cards
      </Link>
    </motion.div>
  }

  if (gameFinished) {
    return (
      <motion.div
        className='flex flex-col items-center justify-center h-screen md:p-0 p-4'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.8} stroke="currentColor" className="size-14 text-stone-300">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
        </svg>
        <div className="p-3 text-center">
          <h2 className="mb-4">Well done :)</h2>
          <p className="mb-6 text-stone-300">
            {score === 0 ? 'Nice try!' : 'Great job!'} You scored <span className="text-indigo-400">{score}</span> out of {cards.length}
          </p>
          <h1 className="mb-4">
            {/* <span>{Math.round((score / cards.length) * 100)}%</span> */}
            <CircularProgress percentage={percentage} />
          </h1>
        </div>
        <div className='flex items-center gap-3'>
          <Link to={`/card-set/${id}`} className='md:text-base text-sm gap-2 md:px-5 px-4 py-2 rounded-full bg-stone-900/50 transition duration-300 ease-in-out hover:bg-stone-900/70'>
            Back to set
          </Link>
          <Button onClick={resetGame} variant={'primary'} className='flex'>
            Play Again
          </Button>
        </div>
      </motion.div>
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
        <div className='h-screen flex justify-center items-center'>
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
              <div className="flex justify-center gap-3">
                <button
                  onClick={resetGame}
                  className="border-t border-rose-400/20 bg-rose-700/30 flex items-center justify-center rounded-full size-12 hover:bg-rose-700/40 transition-all duration-300 ease-in-out cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-5 text-stone-200">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                  </svg>
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
                      <div className={`block w-18 h-12 rounded-full border border-stone-800`}></div>
                      <div className={`absolute flex items-center justify-center left-1.5 top-1/2 -translate-y-1/2 size-9 rounded-full transition-transform border-t ${isShuffled ? 'transform translate-x-6 bg-indigo-700/30 hover:bg-indigo-700/40 border-indigo-400/30' : 'bg-stone-900 border-stone-400/20'}`}>
                        <svg className={`${isShuffled ? 'rotate-180' : ''} transition-all duration-500 ease-in-out size-6 text-stone-300`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13.484 9.166 15 7h5m0 0-3-3m3 3-3 3M4 17h4l1.577-2.253M4 7h4l7 10h5m0 0-3 3m3-3-3-3" />
                        </svg>
                      </div>
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
                    <button onClick={handleFlip} className="group bg-indigo-700/30 border-t border-indigo-400/20 flex items-center justify-center rounded-full size-12 hover:bg-indigo-700/40 transition-all duration-300 ease-in-out cursor-pointer">
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
                    <button onClick={() => handleAnswer(true)} className="bg-teal-700/30 border-t border-teal-400/20 flex items-center justify-center rounded-full size-12 hover:bg-teal-700/40 transition-all duration-300 ease-in-out cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-6 text-teal-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </button>
                    {/* Wrong */}
                    <button onClick={() => handleAnswer(false)} className="bg-rose-700/30 border-t border-rose-400/20 flex items-center justify-center rounded-full size-12 hover:bg-rose-700/40 transition-all duration-300 ease-in-out cursor-pointer">
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