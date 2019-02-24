require('dotenv').config()

const express = require('express')
const app = express()
const { PORT } = process.env

app.get('/', (req, res) => res.send('Ratings App'))

app.listen(PORT, () => {
  console.log(`Server listening on port ${ PORT }.`)
})

module.exports = { app }
