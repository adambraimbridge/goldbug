import { useState, useCallback } from 'preact/hooks'

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

		// Remove hash from url so that token does not remain in browser history.
		// Todo: Confirm this works as expected
		history.replaceState(null, null, '/')

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

// /**
//  * Return the UserMeta component
//  */
// const UserMeta = ({ avatar_url, full_name }) => (
// 	<Fragment>
// 		<figure class="image is-24x24">
// 			<img class="is-rounded" src={avatar_url} />
// 		</figure>
// 		<div class="media-content">{full_name}</div>
// 	</Fragment>
// )

/**
 * Return the UserUI component
 * Handle signing in and out
 */
const UserUI = ({ avatar_url, full_name }) => {
	const showProfile = () => {
		// Show a user select or modal
		console.log('showprofile')
	}

	const signIn = () => {
		// Redirect to OAuth endpoint. It'll redirect back.
		location = 'https://www.goldbug.club/.netlify/identity/authorize?provider=google'
	}

	if (avatar_url && full_name) {
		return (
			<div class="column is-narrow">
				<button class="image is-24x24" onClick={signIn}>Google Sign In
					<img alt={full_name} class="is-rounded" src={avatar_url} onClick={showProfile} />
				</button>
			</div>
		)	
	}
	else {
		return (
			<div class="column is-narrow">
				<button class="button is-small" onClick={signIn}>Google Sign In</button>
			</div>
		)
	
	}

}

/**
 * Export a component for User authentication
 */
export default () => {
	const [localUser, setLocalUser] = useState()

	getAuthenticatedUser().then(authenticatedUser => {
		setLocalUser(authenticatedUser)
	})

	const { avatar_url, full_name } = (localUser && localUser.user_metadata) || {}
	return <UserUI avatar_url={avatar_url} full_name={full_name} />
}
