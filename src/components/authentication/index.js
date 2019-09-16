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

const SIGN_OUT_TEXT = 'Sign Out'
const SIGN_IN_TEXT = 'Google Sign In'

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
const getAuthenticatedUser = () => {
	let authenticatedUser = goTrueAuth.currentUser()
	if (!!authenticatedUser) {
		return authenticatedUser
	} else {
		const authenticationData = getAuthenticationDataFromHash()
		if (authenticationData) {
			/**
			 * Because Preact complains if you export an async function, use an iife here for that sweet async/await goodness
			 */
			!(async () => {
				authenticatedUser = await goTrueAuth.createUser(authenticationData, true).catch(console.error)
				return authenticatedUser
			})()
		}
	}
}

/**
 * Return the UserMeta component
 */
const UserMeta = ({ avatar_url, full_name }) => (
	<Fragment>
		<figure class="media-left image is-24x24">
			<img class="is-rounded" src={avatar_url} />
		</figure>
		<div class="media-content">{full_name}</div>
	</Fragment>
)

/**
 * Return the UserUI component
 * Handle signing in and out
 */
const UserUI = ({ buttonText, handleClick }) => {
	return (
		<div class="media-right">
			<button class="button is-small" onClick={handleClick}>
				{buttonText}
			</button>
		</div>
	)
}

/**
 * Export a component for User authentication
 */
export default () => {
	const [localUser, setLocalUser] = useState(getAuthenticatedUser())
	const { avatar_url, full_name } = (localUser && localUser.user_metadata) || {}
	setLocalUser(localUser)

	const [buttonText, setButtonText] = useState(!!localUser ? SIGN_OUT_TEXT : SIGN_IN_TEXT)
	setButtonText(buttonText)

	const handleClick = async () => {
		if (!!localUser) {
			// User exists, so they must have clicked "Sign Out"
			await localUser.logout()

			setLocalUser(false)
			setButtonText(SIGN_IN_TEXT)
		} else {
			// User does not exist, so they must have clicked "Sign In"
			// Redirect to OAuth endpoint. It'll redirect back.
			location = 'https://www.goldbug.club/.netlify/identity/authorize?provider=google'
		}
	}

	return (
		<div class="is-pulled-right">
			<div class="media">
				<UserMeta avatar_url={avatar_url} full_name={full_name} />
				<UserUI buttonText={buttonText} handleClick={handleClick} />
			</div>
		</div>
	)
}
