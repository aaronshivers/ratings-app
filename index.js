require('dotenv').config()

const express = require('express')
const mongoose = require('./db/mongoose')

const index = require('./routes/index')
const items = require('./routes/items')

const app = express()
const { PORT } = process.env

app.use('/', index)
app.use('/items', items)

app.use(function(err, req, res, next) {
  console.error(err.message)
  res.status(500).send('Something broke!')
})

app.use((err, req, res, next) => {
  res.status(500).render('error', {
    statusCode: '500',
    errorMessage: err.message
  })
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${ PORT }.`)
})

module.exports = { app }
