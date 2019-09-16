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
			return goTrueAuth
				.createUser(authenticationData, true)
				.then(authenticatedUser => authenticatedUser)
				.catch(console.error)
		}
	} catch (error) {
		console.error(error)
	}
}

/**
 * GoTrue local storage trumps URL hash. To sign out local user, the Sign Out UI must be used.
 */
const getAuthenticatedUser = () => {
	let currentUser = goTrueAuth.currentUser()
	if (!currentUser) {
		currentUser = getAuthenticationFromHash()
	}

	// Remove tokens from hash so that token does not remain in browser history.
	history.replaceState(null, null, '/')
	return currentUser || false
}

const getLocalUser = () => {
	const initialUserState = () => {
		const authenticatedUser = getAuthenticatedUser()
		return authenticatedUser ? authenticatedUser : false
	}

	// Todo: If localuser has been set in state already, does this return from state, or from initialUserState?
	const [localUser] = useState(initialUserState)
	return localUser
}

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
