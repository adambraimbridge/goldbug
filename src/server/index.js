const PouchDB = require('pouchdb')
const express = require('express')
const app = express()

// Local watcher
require('../watcher')

// Database
app.use('/database', require('express-pouchdb')(PouchDB.defaults({ prefix: './database/' })))

// App router
app.use('/', (req, res, next) => require('../app')(req, res, next))

// Static
app.use(express.static('public'))

// Run
const port = process.env.PORT || 3000
app.listen(port, () => {
	console.log(`Running on http://localhost:${process.env.PORT}`)
})
