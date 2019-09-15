import { useState, useCallback } from 'preact/hooks'

/**
 * Authenticate against Google via Netlify.
 */
import GoTrue from 'gotrue-js'
const goTrueAuth = new GoTrue({
	APIUrl: 'https://www.goldbug.club/.netlify/identity',
	setCookie: true,
})

const getAuthenticationFromHash = () => {
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
			goTrueAuth
				.createUser(authenticationData, true)
				.then(authenticatedUser => authenticatedUser)
				.catch(console.error)
		}
	} catch (error) {
		console.error(error)
	}
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

const userComponent = () => {
	// updateUser() is triggered by the Sign In / Sign Out button.
	const updateUser = useCallback(() => {
		const [localUser] = useState()
		if (localUser) {
			// User exists, so they must have clicked "Sign Out"
			localUser
				.logout()
				.then(console.log('Signed out.'))
				.catch(console.error)

			setValue({ localUser: {}, buttonText: 'Sign In', updateUser }), [localUser]
		} else {
			// User does not exist, so they must have clicked "Sign In"
			// Redirect to OAuth endpoint to sign in.
			location = 'https://www.goldbug.club/.netlify/identity/authorize?provider=google'
		}
	})

	// Return details to whoever called useState(userComponent)
	const [localUser, setValue] = useState()
	if (!localUser) {
		getAuthenticatedUser()
			.then(authenticatedUser => {
				return { localUser: authenticatedUser, buttonText: 'Sign Out', updateUser }
			})
			.catch(console.error)
	}
	return { localUser, buttonText: 'Google Sign In', updateUser }
}

const UserMeta = () => {
	const [{ localUser, buttonText, updateUser }] = useState(userComponent)
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

const UserUI = () => {
	const [{ buttonText, updateUser }] = useState(userComponent)
	return (
		<div class="media-right">
			<button class="button is-small" onClick={updateUser}>
				{buttonText}
			</button>
		</div>
	)
}

export default () => {
	return (
		<div class="is-pulled-right">
			<div class="media">
				<UserMeta />
				<UserUI />
			</div>
		</div>
	)
}
