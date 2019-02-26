const express = require('express')
const router = express.Router()
const { ObjectId } = require('mongodb')
const { Item, validateItem } = require('../models/items')
const auth = require('../middleware/auth')
const validate = require('../middleware/validate')

// GET /
router.get('/', async (req, res) => {
  try {
    // find items
    const items = await Item.find()

    // return if no items found
    if (items.length === 0) return res.status(404).send('No items found.')

    // send items
    res.send(items)
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

    // find item by id
    const item = await Item.findById(id)

    // reject if id is not in the DB
    if (!item) return res.status(404).send('Id Not Found')

    // return found item
    res.send(item)
  } catch (error) {
    res.send(error.message)
  }
})

// POST /
router.post('/', [auth, validate(validateItem)], async (req, res) => {
  const { name, rating } = req.body
  
  try {
    // reject if item already exists
    const foundItem = await Item.findOne({ name })
    if (foundItem) return res.status(400).send('Item already exists.')

    // create item
    const item = new Item({ name, rating })

    // save item
    await item.save()

    // return found item
    res.send(item)
  } catch (error) {
    console.log(error.message)
  }
})

module.exports = router