const PouchDB = require('pouchdb')
const express = require('express')
const app = express()

app.use('/db', require('express-pouchdb')(PouchDB.defaults({ prefix: './database/' })))

// Local watcher
// require('../lib/watcher')

// Run
const port = process.env.PORT || 3000
app.listen(port, () => {
	console.log(`Running on http://localhost:${port}`)
})
