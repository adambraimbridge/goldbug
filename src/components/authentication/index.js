// import { useState, useCallback } from 'preact/hooks'

/**
 * Authenticate against Google via Netlify.
 */
import GoTrue from 'gotrue-js'
const goTrueAuth = new GoTrue({
	APIUrl: 'https://www.goldbug.club/.netlify/identity',
	setCookie: true,
})

const getAuthenticationFromHash = async () => {
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
			: undefined
		if (authenticationData) {
			const authenticatedUser = await goTrueAuth.createUser(authenticationData, true).catch(console.error)
			return authenticatedUser
		}
	} catch (error) {
		console.error(error)
	}
	// do nothing on error
}

/**
 * Local storage trumps URL hash. To sign out local user, the Sign Out UI must be used.
 */
const getAuthenticatedUser = () => {
	let currentUser = goTrueAuth.currentUser()
	if (!currentUser) {
		currentUser = getAuthenticationFromHash()
	}

	// Remove tokens from hash so that token does not remain in browser history.
	history.replaceState(null, null, '/')

	return currentUser
}

export default () => {
	const authenticatedUser = getAuthenticatedUser()
	const UserMeta = () => {
		if (!authenticatedUser) return false

		console.log({ authenticatedUser })
		const { avatar_url, full_name } = authenticatedUser
		return (
			<span class="section">
				<img src={avatar_url} width="40" /> {full_name}
			</span>
		)
	}
	const buttonText = authenticatedUser ? 'Sign Out' : 'Sign In'
	const handleAuthentication = () => {
		if (authenticatedUser) {
		} else {
			// Redirect to OAuth endpoint
			location = 'https://www.goldbug.club/.netlify/identity/authorize?provider=google'
		}
	}

	return (
		<div class="is-pulled-right">
			<UserMeta />
			<button class="button is-small" onClick={handleAuthentication}>
				{buttonText}
			</button>
		</div>
	)
}
