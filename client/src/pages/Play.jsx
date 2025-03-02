import React, { useState, useEffect, useRef } from 'react'
import * as motion from "motion/react-client"
import { AnimatePresence } from "motion/react"
import toast, { Toaster } from 'react-hot-toast'
import Swal from 'sweetalert2'
import { useParams } from 'react-router-dom'
import api from '../utils/api'

const Play = () => {
  const [cards, setCards] = useState([])
  const [originalCards, setOriginalCards] = useState([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [score, setScore] = useState(0)
  const [gameFinished, setGameFinished] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const { id } = useParams() // Get card set ID from URL

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
      toast.success('Correct!')
    } else {
      toast.error('Incorrect!')
    }

    // Move to next card
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false) // Reset flip state for new card
    } else {
      setGameFinished(true)
    }
  }

  const resetGame = () => {
    Swal.fire({
      title: 'Reset Game?',
      text: 'Your current progress will be lost!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reset it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setCurrentCardIndex(0)
        setIsFlipped(false)
        setScore(0)
        setGameFinished(false)
        toast.success('Game has been reset!')
      }
    })
  }

  const toggleShuffleMode = (e) => {
    const shouldShuffle = e.target.checked
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

    toast.success(shouldShuffle ? 'Cards shuffled!' : 'Original order restored!')
  }

  if (cards.length === 0) {
    return <div className="flex justify-center items-center h-screen">Loading flashcards...</div>
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

  const currentCard = cards[currentCardIndex]

  return (
    <div className=''>
      <Toaster position="top-center" />

      <div className="mb-4 text-center">
        <h2 className="text-xl font-bold">Card {currentCardIndex + 1} of {cards.length}</h2>
        <p className="text-gray-600">Score: {score}</p>
      </div>

      <div
        className="relative w-full max-w-md h-64 perspective"
        style={{ perspective: '1000px' }}
      >
        <div
          className={`w-full h-full transition-transform duration-500 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front of card (Question) */}
          <div
            className="absolute w-full h-full rounded-xl shadow-lg p-6 flex flex-col justify-between backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="flex-1 flex items-center justify-center">
              <h3 className="text-xl text-center">{currentCard.question}</h3>
            </div>
            <div className="text-center">
              <button
                onClick={handleFlip}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reveal Answer
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
            <div className="flex-1 flex items-center justify-center">
              <h3 className="text-xl text-center">{currentCard.answer}</h3>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleAnswer(false)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Incorrect
              </button>
              <button
                onClick={() => handleAnswer(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Correct
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Game control buttons and shuffle toggle */}
      <div className="flex flex-wrap justify-center gap-3 mt-6">
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
            <div className="ml-3 text-gray-700 font-medium">
              {isShuffled ? 'Shuffled' : 'Original Order'}
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}

export default Play