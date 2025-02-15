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

// Edit Card
export const editCard = async (req, res) => {
  try {
    const { cardSetId, cardId } = req.params
    const { question, answer } = req.body

    if (!question || !answer) {
      return res.status(400).json({ success: false, message: "Question and answer are required" })
    }

    // Ensure the set belongs to the user
    const cardSet = await CardSet.findOne({ _id: cardSetId, user: req.user.id })
    if (!cardSet) return res.status(403).json({ error: 'Unauthorized' })

    // Find and update the card
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { question, answer },
      { new: true, runValidators: true }
    );

    if (!updatedCard) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.status(200).json({ success: true, message: 'Card updated successfully', card: updatedCard });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error in editing Card" })
  }
}

// Delete Card
export const deleteCard = async (req, res) => {
  try {
    const { cardSetId, cardId } = req.params

    // Ensure the set belongs to the user
    const cardSet = await CardSet.findOne({ _id: cardSetId, user: req.user.id })
    if (!cardSet) return res.status(403).json({ error: 'Unauthorized' })

    // Check if the card exists
    const card = await Card.findById(cardId)
    if (!card) return res.status(404).json({ error: 'Card not found' })

    // Remove the card from the database
    await Card.deleteOne({ _id: cardId })

    // Remove the card from the `cards` array in `CardSet`
    cardSet.cards = cardSet.cards.filter((id) => id.toString() !== cardId)
    await cardSet.save()

    res.status(200).json({ success: true, message: "Card deleted successfully" })
  } catch (error) {
    console.log("Error in deleting Card:", error.message)
    res.status(500).json({ success: false, message: "Error in deleting Card" })
  }
}