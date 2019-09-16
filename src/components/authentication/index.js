import { useState, useCallback, useEffect } from 'preact/hooks'

/**
 * Authenticate against Google via Netlify.
 */
import GoTrue from 'gotrue-js'
const goTrueAuth = new GoTrue({
	APIUrl: 'https://www.goldbug.club/.netlify/identity',
	setCookie: true,
})

const SIGN_OUT_TEXT = 'Sign Out'
const SIGN_IN_TEXT = 'Google Sign In'

/**
 * After authenticating with Google, the URL contains a secret hash of tokens.
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
const getAuthenticatedUser = () => {
	let authenticatedUser = false
	const currentUser = goTrueAuth.currentUser()
	if (currentUser) {
		authenticatedUser = currentUser
	} else {
		const authenticationData = getAuthenticationDataFromHash()
		if (authenticationData) {
			goTrueAuth
				.createUser(authenticationData, true)
				.then(authenticatedUser || false)
				.catch(console.error)
		}
	}

	// Remove hash from url so that token does not remain in browser history.
	// Todo: Confirm this works as expected
	history.replaceState(null, null, '/')

	return authenticatedUser || false
}

/**
 * Retreive user from app state
 * or get authenticated user and save it to app state
 */
const getLocalUser = () => {
	const [localUser, setValue] = useState()
	if (!!localUser) {
		return localUser
	} else {
		const authenticatedUser = getAuthenticatedUser()
		setValue(authenticatedUser)
		return authenticatedUser
	}
}

/**
 * Return the UserMeta component
 */
const UserMeta = () => {
	const localUser = getLocalUser()
	if (localUser) {
		const { avatar_url, full_name } = localUser.user_metadata
		return (
			<Fragment>
				<figure class="media-left image is-24x24">
					<img class="is-rounded" src={avatar_url} />
				</figure>
				<div class="media-content">{full_name}</div>
			</Fragment>
		)
	}
}

/**
 * Return the UserUI component
 * Handle signing in and out
 */

const UserUI = () => {
	const getButtonText = () => {
		const localUser = getLocalUser()
		return localUser ? SIGN_OUT_TEXT : SIGN_IN_TEXT
	}
	const [buttonText, setValue] = useState(getButtonText)

	const handleClick = useCallback(async () => {
		const buttonText = getButtonText()
		setValue(buttonText)

		// User does not exist, so they must have clicked "Sign In"
		// Redirect to OAuth endpoint.
		if (buttonText === SIGN_IN_TEXT) {
			location = 'https://www.goldbug.club/.netlify/identity/authorize?provider=google'
		} else {
			// User exists, so they must have clicked "Sign Out"
			const localUser = getLocalUser()
			await localUser.logout().catch(console.error)

			//todo: update usermeta
		}
	}, [buttonText])

	return (
		<div class="media-right">
			<button class="button is-small" onClick={handleClick}>
				{buttonText}
			</button>
		</div>
	)
}

export default () => (
	<div class="is-pulled-right">
		<div class="media">
			<UserMeta />
			<UserUI />
		</div>
	</div>
)
