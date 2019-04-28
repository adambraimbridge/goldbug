const PouchDB = require('pouchdb')
const express = require('express')
const app = express()

app.use(
	'/database',
	require('express-pouchdb')(PouchDB.defaults({ prefix: './database/' }))
)
app.use('/', require('./router'))

const port = process.env.PORT || 3000
app.listen(port, () => {
	console.log(`Running on http://localhost:${process.env.PORT}`)
})
