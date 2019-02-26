require('dotenv').config()

const express = require('express')
const mongoose = require('./db/mongoose')
require('express-async-errors')
const winston = require('winston')
// require('winston-mongodb')


// Handle uncaught exceptions
winston.exceptions.handle(new winston.transports.File({ filename: 'uncaughtExceptions.log', level: 'error'}))

//Handle unhandled rejections
process.on('unhandledRejection', exception => {
  throw exception.message
})

// Error Logging
winston.add(new winston.transports.Console({ colorize: true, prettyPrint: true }))
// winston.add(new winston.transports.Console({ format: winston.format.simple() }))
winston.add(new winston.transports.File({ filename: 'logfile.log', level: 'info' }))
// winston.add(new winston.transports.MongoDB ({ db: url, level: 'info' }))



const index = require('./routes/index')
const items = require('./routes/items')
const users = require('./routes/users')

const app = express()
const { PORT } = process.env

app.use(express.json())
app.use('/', index)
app.use('/items', items)
app.use('/users', users)

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
