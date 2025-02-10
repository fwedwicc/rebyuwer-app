import cardSet from '../model/cardSetModel.js'

// Get the card set of the current user
export const getCardSets = async (req, res) => {
  try {
    const userCardSets = await cardSet.find({ user: req.user.id })

    res.status(200).json(userCardSets)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

// Add a new Card Set
export const addCardSet = async (req, res) => {
  try {
    const { name } = req.body
    const newCardSet = new cardSet({
      name,
      user: req.user.id,
      // cards: []
    })
    await newCardSet.save()
    res.status(201).json(newCardSet)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}