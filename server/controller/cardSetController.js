import CardSet from '../model/cardSetModel.js'
import Card from '../model/cardModel.js'

// Get the card set of the current user
export const getCardSets = async (req, res) => {
  try {
    const userCardSets = await CardSet
      .find({ user: req.user.id }) // Find all card sets for the user
      .populate('cards', 'question answer') // Populate only question & answer fields

    res.status(200).json(userCardSets)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


// Add a new Card Set
export const addCardSet = async (req, res) => {
  try {
    const { name } = req.body

    if (!name) {
      return res.status(400).json({ message: 'Name is required' })
    }

    const newCardSet = new CardSet({
      name,
      user: req.user.id,
      cards: []
    })
    await newCardSet.save()
    res.status(201).json(newCardSet)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Edit Card Set
export const editCardSet = async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body

    // Find the card set to edit
    const cardSet = await CardSet.findById(id)
    if (!cardSet) {
      return res.status(404).json({ message: 'Card set not found' })
    }

    // Update the name if provided
    if (name) {
      cardSet.name = name
    }

    await cardSet.save()
    res.status(200).json({ message: 'Card set updated successfully', cardSet })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


// Delete a Card Set along with its cards
export const deleteCardSet = async (req, res) => {
  try {
    const { id } = req.params

    // Find the card set to delete
    const cardSet = await CardSet.findById(id)
    if (!cardSet) {
      return res.status(404).json({ message: 'Card set not found' })
    }

    // Delete all associated cards
    await Card.deleteMany({ _id: { $in: cardSet.cards } })

    // Delete the card set
    await CardSet.findByIdAndDelete(id)

    res.status(200).json({ message: 'Card set and its cards deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}