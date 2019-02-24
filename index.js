require('dotenv').config()

const express = require('express')

const index = require('./routes/index')

const app = express()
const { PORT } = process.env

app.use('/', index)

app.use(function(err, req, res, next) {
  console.error(err.message)
  res.status(500).send('Something broke!')
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${ PORT }.`)
})

module.exports = { app }
