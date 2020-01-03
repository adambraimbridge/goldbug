/**
 * Authentication is provided by Google OAuth2
 *
 * https://developers.google.com/identity/sign-in/web/backend-auth
 * https://github.com/googleapis/google-api-nodejs-client#oauth2-client
 */
const { google } = require('googleapis')

exports.handler = async (payload, context) => {
	try {
		const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URL)
		const oAuthUrl = oauth2Client.generateAuthUrl({
			// 'online' (default) or 'offline' (gets refresh_token)
			access_type: 'offline',
		})

		return {
			statusCode: 200,
			body: JSON.stringify({ oAuthUrl, payload, context }),
		}
	} catch (error) {
		return { statusCode: 500, body: error }
	}
}