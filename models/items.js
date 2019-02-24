const mongoose = require('mongoose')

const Schema = mongoose.Schema

const itemSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  rating: {
    type: Number,
    required: true,
    minlength: 0,
    maxlength: 5,
  }
})

const Item = mongoose.model('Item', itemSchema)

module.exports = { Item, itemSchema }
