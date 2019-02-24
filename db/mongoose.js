const mongoose = require('mongoose')

const { MONGO_USER, MONGO_PASS, MONGO_CLUSTER, NODE_ENV } = process.env
const encodedpass = encodeURIComponent(MONGO_PASS)
const uri = `mongodb+srv://${ MONGO_CLUSTER }.mongodb.net`

const options = {
  'useNewUrlParser': true,
  'useCreateIndex': true,
  'useFindAndModify': false,
  'autoIndex': false,
  // 'toObject': { 'getters': true },
  'retryWrites': true,
  'user': MONGO_USER,
  'pass': encodedpass,
  'dbName': NODE_ENV
}

mongoose.connect(uri, options)
  .then(() => console.log(`Connected to ${ NODE_ENV } database.`))

module.exports = { mongoose }
