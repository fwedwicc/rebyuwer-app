import { Schema, mongoose, model } from 'mongoose'

const cardSchema = new Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  cardSet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CardSet',
    required: true
  }, // Link to a specific card set
}, {
  timestamps: true
})

const Card = model('Card', cardSchema)
export default Card