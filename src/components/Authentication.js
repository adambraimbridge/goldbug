import React, { useEffect } from 'react'
// import { userInfo } from 'os'

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
	if (!document.location.hash.length) return false
	const authenticationData = document.location.hash

	// Remove hash from url so that token does not remain in browser history.
	// Todo: Confirm this works as expected
	window.history.replaceState(null, null, '/')

	try {
		return authenticationData
			.replace(/^#/, '')
			.split('&')
			.reduce((result, pair) => {
				const keyValue = pair.split('=')
				result[keyValue[0]] = keyValue[1]
				return result
			}, {})
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
	if (authenticatedUser) {
		return authenticatedUser
	} else {
		const authenticationData = getAuthenticationDataFromHash()
		if (authenticationData) {
			return await goTrueAuth.createUser(authenticationData, true)
		}
	}
}

const SignInUI = ({ size }) => {
	const oAuthUrl = 'https://www.goldbug.club/.netlify/identity/authorize?provider=google'
	const signIn = () => {
		// Redirect to OAuth endpoint. It'll redirect back after the user signs in.
		window.location = oAuthUrl
	}
	const classList = `btn ${size === 'large' ? 'btn-lg btn-primary' : 'btn-sm btn-light'}`
	return (
		<div className={classList} onClick={signIn}>
			Google Sign In
		</div>
	)
}

const SignOutUI = ({ localUser, setLocalUser }) => {
	const signOut = async () => {
		await localUser.logout()
		setLocalUser(false)
	}
	const { full_name, avatar_url } = localUser.user_metadata
	return (
		<div className="btn btn-sm centered" onClick={signOut}>
			<div>Sign Out</div>
			<div className="avatar-thumbnail">
				<img src={avatar_url} alt={full_name} className="icon rounded-circle border border-primary"></img>
			</div>
		</div>
	)
}

/**
 * User authentication (sign in/out) button
 */
const AuthenticationButton = ({ localUser, setLocalUser }) => {
	useEffect(() => {
		;(async () => {
			let authenticatedUser
			try {
				authenticatedUser = await getAuthenticatedUser()
				setLocalUser(authenticatedUser)
			} catch (error) {
				console.error(error)
			}
		})()
	}, [localUser, setLocalUser])

	const { avatar_url, full_name } = (localUser && localUser.user_metadata) || {}
	if (avatar_url && full_name) {
		return <SignOutUI localUser={localUser} setLocalUser={setLocalUser} />
	} else {
		return <SignInUI />
	}
}

/**
 * Authentication panel
 */
const AuthenticationPanel = () => (
	<div>
		<div className="my-1 alert alert-light text-secondary text-center">
			<div className="">
				<span role="img" aria-label="Padlock">
					🔏
				</span>
				Private channel
			</div>
			<div className="py-5">
				<SignInUI size="large" />
				<div className="pt-3">Authenticate with your Google account.</div>
			</div>
		</div>
	</div>
)

export { AuthenticationPanel, AuthenticationButton }
