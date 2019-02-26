const express = require('express')
const router = express.Router()
const { ObjectId } = require('mongodb')
const { User, userValidator } = require('../models/users')
const auth = require('../middleware/auth')
const validate = require('../middleware/validate')

// GET /
router.get('/', async (req, res) => {
  try {
    // find users
    const users = await User.find()

    // return if no users found
    if (users.length === 0) return res.status(404).send('No users found.')

    // send errors
    res.send(users)
  } catch (error) {
    res.send(error.message)
  }
})

// GET /:id
router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    // reject if id is invalid
    if (!ObjectId.isValid(id)) return res.status(404).send('Invalid ObjectId')

    // find user by id
    const user = await User.findById(id)

    // reject if id is not in the DB
    if (!user) return res.status(404).send('Id Not Found')

    // return found user
    res.send(user)
  } catch (error) {
    res.send(error.message)
  }
})

// POST /
router.post('/', validate(userValidator), async (req, res) => {
  const { email, password } = req.body

  try {
    // check db for existing user
    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(400).send('User already registered.')

    // create user
    const user = await new User({ email, password })

    // save user
    await user.save()

    // Get auth token
    const token = await user.createAuthToken()

    // set header and return user info
    res.header('x-auth-token', token).send({ email })
  } catch (error) {
    res.send(error.message)
  }

})

// DELETE /:id
router.delete('/', async (req, res) => {
  try {
    
  } catch (error) {
    res.send(error.message)
  }
})

module.exports = router