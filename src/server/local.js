const app = require('./index')

// Run
const port = process.env.PORT || 3000
app.listen(port, () => {
	console.log(`Running on http://localhost:${process.env.PORT}`)
})
