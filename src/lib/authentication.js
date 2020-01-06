/**
 * Authentication is provided by Google OAuth2
 *
 * https://developers.google.com/identity/sign-in/web/backend-auth
 * https://github.com/googleapis/google-api-nodejs-client#oauth2-client
 */
export const getAuthenticatedUser = async () => {
	// Try local storage
	let authenticatedUser // = google..currentUser()
	if (!authenticatedUser) {
		console.log('authenticatedUser not found')
	}
	return authenticatedUser
}
