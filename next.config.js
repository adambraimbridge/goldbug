const withSass = require('@zeit/next-sass')
module.exports = withSass({
	env: {
		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
	},
})
