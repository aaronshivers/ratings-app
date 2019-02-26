const mongoose = require('mongoose')
const Joi = require('joi')

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

const validateItem = req => {
  const schema = Joi.object().keys({
    name: Joi.string().min(5).max(50).required(),
    rating: Joi.number().min(0).max(5).required()
  })
  return Joi.validate(req, schema)
}

const Item = mongoose.model('Item', itemSchema)

module.exports = { Item, validateItem }
