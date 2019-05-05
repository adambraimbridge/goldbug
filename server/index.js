const PouchDB = require('pouchdb')
const express = require('express')
const serverless = require('serverless-http')
const app = express()

// Local watcher
require('../lib/watcher')

// Database
app.use('/database', require('express-pouchdb')(PouchDB.defaults({ prefix: './database/' })))

// Static
app.use(express.static('public'))

// Run
const port = process.env.PORT || 3000
app.listen(port, () => {
	console.log(`Running on http://localhost:${port}`)
})
