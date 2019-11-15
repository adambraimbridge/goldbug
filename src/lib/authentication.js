import GoTrue from 'gotrue-js'

/**
 * After authenticating with Google via Netlify, the URL contains a secret hash of tokens.
 */
const getAuthenticationDataFromHash = () => {
	if (!document.location.hash.length) return false
	const locationHash = document.location.hash

	// Remove hash from url so that token does not remain in browser history.
	// Todo: Confirm this works as expected
	window.history.replaceState(null, null, '/')

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

	let authenticatedUser = goTrueAuth.currentUser()
	if (!authenticatedUser) {
		const authenticationData = getAuthenticationDataFromHash()
		if (authenticationData) {
			authenticatedUser = await goTrueAuth.createUser(authenticationData, true)
		} else {
			authenticatedUser = false
		}
	}
	return authenticatedUser
}
