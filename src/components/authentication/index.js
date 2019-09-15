import { useReducer } from 'preact/hooks'

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

const anonUser = { localUser: false, buttonText: 'Google Sign In' }

const initialUserState = () => {
	const authenticatedUser = getAuthenticatedUser()
	if (authenticatedUser) {
		return {
			localUser: authenticatedUser,
			buttonText: 'Sign Out',
		}
	} else {
		return anonUser
	}
}

const updateUserState = (state, action) => {
	// updateUser() is triggered by the Sign In / Sign Out button.
	if (action === 'updateUser') {
		const { localUser } = state || {}
		if (!localUser) {
			// User does not exist, so they must have clicked "Sign In"
			// Redirect to OAuth endpoint to sign in.
			location = 'https://www.goldbug.club/.netlify/identity/authorize?provider=google'
		} else {
			// User exists, so they must have clicked "Sign Out"

			// todo: doublecheck this promise
			return localUser
				.logout()
				.then(() => {
					console.log('Signed out.')
					return anonUser
				})
				.catch(console.error)
		}
	}
}

const UserComponent = () => {
	const [state, dispatch] = useReducer(updateUserState, initialUserState)
	const { localUser, buttonText } = state || {}

	const UserMeta = () => {
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
	return (
		<div class="is-pulled-right">
			<div class="media">
				<UserMeta />
				<div class="media-right">
					<button class="button is-small" onClick={() => dispatch('updateUser')}>
						{buttonText}
					</button>
				</div>
			</div>
		</div>
	)
}

export default () => <UserComponent />
