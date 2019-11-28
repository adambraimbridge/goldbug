import GoTrue from 'gotrue-js'

/**
 * After authenticating with Google via Netlify, the URL contains a secret hash of tokens.
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
	const goTrueAuth = new GoTrue({
		APIUrl: 'https://www.goldbug.club/.netlify/identity',
		setCookie: true,
	})

	// Try local storage first
	let authenticatedUser = goTrueAuth.currentUser()
	if (!authenticatedUser) {
		// Check the location hash to see if the user just authenticated
		const authenticationData = getAuthenticationDataFromHash()
		if (!authenticationData) return false

		// Save the authenticated user to local storage
		authenticatedUser = await goTrueAuth.createUser(authenticationData, true)
	}

	// Remove hash from url so that token does not remain in browser history.
	window.history.replaceState(null, null, '/')
	return authenticatedUser
}
