/**
 * Authentication is provided by Google OAuth2
 *
 * https://developers.google.com/identity/sign-in/web/backend-auth
 * https://github.com/googleapis/google-api-nodejs-client#oauth2-client
 */
const { google } = require('googleapis')
const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URL)
const HOMEPAGE_URL = 'https://www.goldbug.com'

const verify = async () => {
	const ticket = await client.verifyIdToken({
		idToken: token,
		audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
		// Or, if multiple clients access the backend:
		//[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
	})
	const payload = ticket.getPayload()
	const userid = payload['sub']
	// If request specified a G Suite domain:
	//const domain = payload['hd'];
}

const gotoGoogleAuth = () => {
	const oAuthUrl = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
	})
	return {
		statusCode: 303,
		headers: { location: oAuthUrl },
	}
}

exports.handler = async payload => {
	const { queryStringParameters } = payload || {}
	if (!queryStringParameters.code) {
		// First off: Redirect to Google authentication.
		return gotoGoogleAuth()
	} else {
		// At this point the user has authenticated with Google.
		const { tokens } = await oauth2Client.getToken(queryStringParameters.code)
		// oauth2Client.setCredentials(tokens)

		verify()

		// Google's supplied the user's JSON token,
		// so save them (somehow), then redirect to the home page
		return {
			statusCode: 200,
			body: `<html>
				<script type="text/javascript">
					localStorage.setItem('google-tokens', '${JSON.stringify(tokens)}')
					location='/'
				</script>
			</html>`,
		}
	}
}
