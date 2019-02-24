const express = require('express')
const router = express.Router()
const { ObjectId } = require('mongodb')
const { Item } = require('../models/items')

// GET /
router.get('/', async (req, res) => {
  const items = await Item.find()

  if (items.length === 0) return res.status(404).send('No items found.')

  res.send(items)
})

// GET /:id
router.get('/:id', async (req, res) => {
  const { id } = req.params

  // reject if id is invalid
  if (!ObjectId.isValid(id)) return res.status(404).send('Invalid ObjectId')

  // find item by id
  const item = await Item.findById(id)

  // reject if id is not in the DB
  if (!item) return res.status(404).send('Id Not Found')

  // return found item
  res.send(item)
})

module.exports = router