import Card from '../model/cardModel.js'
import CardSet from '../model/cardSetModel.js'

// Get all Cards
export const getCards = async (req, res) => {
  try {
    const { cardSetId } = req.params
    const cardSet = await CardSet.findOne({ _id: cardSetId, user: req.user.id }).populate('cards')
    if (!cardSet) return res.status(403).json({ error: 'Unauthorized' })

    res.status(200).json({ success: true, data: cardSet.cards })
  } catch (error) {
    console.log("Error in fetching Card:", error.message)
    res.status(500).json({ success: false, message: "Error in fetching Cards" })
  }
}


// Add a new Card
export const addCards = async (req, res) => {
  const { question, answer } = req.body
  const { cardSetId } = req.params

  if (!question || !answer) {
    return res.status(400).json({ success: false, message: "Question and answer are required" })
  }

  // Ensure the set belongs to the user
  const cardSet = await CardSet.findOne({ _id: cardSetId, user: req.user.id })
  if (!cardSet) return res.status(403).json({ error: 'Unauthorized' })

  try {
    const newCard = new Card({
      question,
      answer,
      cardSet: cardSetId
    })

    // Save the card
    await newCard.save()

    // Add the card to the set
    cardSet.cards.push(newCard._id)
    await cardSet.save()

    res.status(201).json(newCard)
  } catch (error) {
    console.log("Error in adding Card:", error.message)
    res.status(500).json({ success: false, message: "Error in adding Card" })
  }
}