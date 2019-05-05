const PouchDB = require('pouchdb')
const express = require('express')
const serverless = require('serverless-http')
const app = express()

// Local watcher
require('../watcher')

// Database
app.use('/database', require('express-pouchdb')(PouchDB.defaults({ prefix: './database/' })))

// Static
app.use(express.static('public'))

module.exports = app
module.exports.handler = serverless(app)
