import React, { useEffect } from 'react'

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

const SignInUI = size => {
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
	return (
		<div className="btn btn-light btn-sm" onClick={signOut}>
			Sign Out
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
				console.log({ authenticatedUser })
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
