/**
 * Authentication is provided by Google OAuth2
 *
 * https://developers.google.com/identity/sign-in/web/backend-auth
 * https://github.com/googleapis/google-api-nodejs-client#oauth2-client
 */
// import { google } from 'googleapis'

/**
 * After authenticating with Google, the URL contains a secret hash of tokens.
 */
const getAuthenticationDataFromHash = () => {
	if (!document.location.hash.length) return false
	const locationHash = document.location.hash

	// This is for local authentication debugging
	console.log(`http://localhost:8888/${locationHash}`)

	// Only proceed if there's an access token
	if (locationHash.indexOf('access_token') === -1) return false

	return locationHash
		.replace(/^#/, '')
		.split('&')
		.reduce((result, pair) => {
			const keyValue = pair.split('=')
			result[keyValue[0]] = keyValue[1]
			return result
		}, {})
}

/**
 * Authentication is provided by Netlify via Google OAuth.
 * Identites are created in Netlify for newly authenticated users.
 */
export const getAuthenticatedUser = async () => {
	// Try local storage first
	let authenticatedUser // = google..currentUser()
	if (!authenticatedUser) {
		// Check the location hash to see if the user just authenticated
		const authenticationData = getAuthenticationDataFromHash()
		if (!authenticationData) return false

		// Save the authenticated user to local storage
		// authenticatedUser = await google..createUser(authenticationData, true)
	}

	// Remove hash from url so that token does not remain in browser history.
	window.history.replaceState(null, null, '/')
	return authenticatedUser
}
