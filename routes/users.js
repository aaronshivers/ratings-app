const express = require('express')
const router = express.Router()
const { ObjectId } = require('mongodb')
const { User } = require('../models/users')
const auth = require('../middleware/auth')

// GET /
router.get('/', async (req, res) => {
  const users = await User.find()

  if (users.length === 0) return res.status(404).send('No users found.')

  res.send(users)
})

// GET /:id
router.get('/:id', async (req, res) => {
  // const { id } = req.params

  // // reject if id is invalid
  // if (!ObjectId.isValid(id)) return res.status(404).send('Invalid ObjectId')

  // // find user by id
  // const user = await User.findById(id)

  // // reject if id is not in the DB
  // if (!user) return res.status(404).send('Id Not Found')

  // // return found user
  // res.send(user)
})

// POST /
router.post('/', auth, async (req, res) => {
  // const { name, rating } = req.body

  // reject if id is invalid
  // if (!ObjectId.isValid(id)) return res.status(404).send('Invalid ObjectId')

  // reject if id is not in the DB
  // if (!user) return res.status(404).send('Id Not Found')

  // create user
  // const user = { name, rating }

  // save user
  // await user.save()

  // return found user
  // res.send(user)
})

module.exports = router