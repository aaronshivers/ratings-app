const jwt = require('jsonwebtoken')
const { User } = require('../models/users')

module.exports = async(req, res, next) => {
  const token = req.header('x-auth-token')
  const secret = process.env.JWT_SECRET
  
  if (!token) return res.status(401).send('Access Denied! No token provided.')
  
  try {
    req.user = await jwt.verify(token, secret)
    next()
  } catch (error) {
    res.status(400).send('Invalid Token')
  }
}