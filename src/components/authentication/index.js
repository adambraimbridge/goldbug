import { useState, useCallback, useEffect } from 'preact/hooks'

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
	const initialButtonState = () => {
		const localUser = getLocalUser()
		return localUser ? 'Sign Out' : 'Google Sign In'
	}
	const [buttonText, setValue] = useState(initialButtonState)
	const handleClick = useCallback(() => {
		const localUser = getLocalUser()
		setValue(localUser ? 'Sign Out' : 'Google Sign In')

		// User does not exist, so they must have clicked "Sign In"
		// Redirect to OAuth endpoint.
		location = 'https://www.goldbug.club/.netlify/identity/authorize?provider=google'

	}, [buttonText])

	// Todo: Will useEffect() handle logging out / redirecting to oauth?
	useEffect(() => {
		console.log({ buttonText })
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

// // Todo: Get local user from state
// if (!localUser) {
// 	// User does not exist, so they must have clicked "Sign In"
// 	// Redirect to OAuth endpoint.
// 	location = 'https://www.goldbug.club/.netlify/identity/authorize?provider=google'
// } else {
// 	// User exists, so they must have clicked "Sign Out"

// 	// todo: doublecheck this promise
// 	return localUser
// 		.logout()
// 		.then(() => {
// 			console.log('Signed out.')
// 			return anonUser
// 		})
// 		.catch(console.error)
// }
