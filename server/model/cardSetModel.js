import { Schema, mongoose, model } from 'mongoose'

const cardSetSchema = new Schema({
  // Name of the card set
  name: {
    type: String,
    required: true
  },
  // Owner of the set
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Card set
  // cards: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Card'
  // }]
})

const cardSet = model('cardSet', cardSetSchema)
export default cardSet