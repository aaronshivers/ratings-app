const mongoose = require('mongoose')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Joi = require('joi')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
    trim: true
  },
  isAdmin: {
    type: Boolean,
    required: false,
    default: false
  },
  signupDate: {
    type: Date,
    default: moment()
  }
})

userSchema.pre('save', async function(next) {
  const user = this

  if (!user.isModified('password')) return next()

  const saltingRounds = 10

  try {
    const hash = await bcrypt.hash(user.password, saltingRounds)
    user.password = hash
    next()
  } catch (error) {
    throw new Error (error)
  }
})

userSchema.methods.createAuthToken = function () {
  // Setup JWT and return token
  const payload = { _id: this._id, isAdmin: this.isAdmin }
  const secret = process.env.JWT_SECRET
  const options = { expiresIn: '1d' }
  return jwt.sign(payload, secret, options)
}

const userValidator = req => {
  const regex = /((?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)).{8,100}/

  const schema = Joi.object().keys({
    email: Joi.string().min(7).max(255).email().required(),
    password: Joi.string().min(8).max(100).regex(regex).required().error(() => {
      return `Password must contain 8-100 characters, with at least one 
      lowercase letter, one uppercase letter, one number, and one special character.`
    })
  })
  return Joi.validate(req, schema)
}

const User = mongoose.model('User', userSchema)

module.exports = { User, userValidator }
