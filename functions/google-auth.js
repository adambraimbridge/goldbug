/**
 * Authentication is provided by Google OAuth2
 *
 * https://developers.google.com/identity/sign-in/web/backend-auth
 * https://github.com/googleapis/google-api-nodejs-client#oauth2-client
 */
const { google } = require('googleapis')
const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URL)
const homepageUrl = 'https://www.goldbug.com'

exports.handler = async (payload, context) => {
	const { queryStringParameters } = payload || {}
	if (queryStringParameters.code) {
		// This will provide an object with the access_token and refresh_token.
		// Save these somewhere safe so they can be used at a later time.
		const { tokens } = await oauth2Client.getToken(code)
		oauth2Client.setCredentials(tokens)

		console.log({ tokens })

		return {
			statusCode: 303,
			headers: { location: `${homepageUrl}?tokens=${JSON.stringify(tokens)}` },
		}
	} else {
		const oAuthUrl = oauth2Client.generateAuthUrl({
			// 'online' (default) or 'offline' (gets refresh_token)
			access_type: 'offline',
			scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
		})

		console.log({ oAuthUrl, payload, context })

		return {
			statusCode: 303,
			headers: { location: oAuthUrl },
		}
	}
}
