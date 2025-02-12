import CardSet from '../model/cardSetModel.js'

// Get the card set of the current user
export const getCardSets = async (req, res) => {
  try {
    const userCardSets = await CardSet
      .find({ user: req.user.id }) // Find all card sets for the user
      .populate('cards', 'question answer'); // Populate only question & answer fields

    res.status(200).json(userCardSets);
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};


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