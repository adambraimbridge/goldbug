import Button from 'react-bootstrap/Button'

import { useState } from 'preact/hooks'

/**
 * Authentication is provided by Netlify via Google OAuth.
 * Identites are created in Netlify for newly authenticated users.
 */
import GoTrue from 'gotrue-js'
const goTrueAuth = new GoTrue({
	APIUrl: 'https://www.goldbug.club/.netlify/identity',
	setCookie: true,
})

/**
 * After authenticating with Google via Netlify, the URL contains a secret hash of tokens.
 */
const getAuthenticationDataFromHash = () => {
	try {
		const authenticationData = document.location.hash.length
			? document.location.hash
					.replace(/^#/, '')
					.split('&')
					.reduce((result, pair) => {
						const keyValue = pair.split('=')
						result[keyValue[0]] = keyValue[1]
						return result
					}, {})
			: false

		return authenticationData
	} catch (error) {
		console.error(error)
	}
}

/**
 * Retreive the authenticated user from local storage
 * or generate it from a hashed token in the url and save it locally
 */
const getAuthenticatedUser = async () => {
	let authenticatedUser = goTrueAuth.currentUser()
	if (!!authenticatedUser) {
		return authenticatedUser
	} else {
		const authenticationData = getAuthenticationDataFromHash()
		if (authenticationData) {
			return await goTrueAuth.createUser(authenticationData, true)
		}
	}
}

/**
 * Return the UserUI component
 * Handle signing in and out
 */
const SignInUI = () => {
	const signIn = () => {
		// Redirect to OAuth endpoint. It'll redirect back after the user signs in.
		location = 'https://www.goldbug.club/.netlify/identity/authorize?provider=google'
	}
	return (
		<Button variant="primary" onClick={signIn}>
			Google Sign In
		</Button>
	)
}

const SignOutUI = () => {
	const signOut = async () => {
		await localUser.logout()
		setLocalUser(false)
	}
	return (
		<Button variant="primary" onClick={signOut}>
			Sign Out
		</Button>
	)
}

/**
 * Export a component for User authentication
 */
export default () => {
	const [localUser, setLocalUser] = useState()

	getAuthenticatedUser()
		.then(authenticatedUser => {
			setLocalUser(authenticatedUser)
			const { avatar_url, full_name } = (localUser && localUser.user_metadata) || {}
			if (avatar_url && full_name) {
				return true
			}
		})
		.catch(console.error)

	// Remove hash from url so that token does not remain in browser history.
	// Todo: Confirm this works as expected
	history.replaceState(null, null, '/')

	return !!localUser ? <SignOutUI /> : <SignInUI />
}
