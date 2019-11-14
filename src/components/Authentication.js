import React, { useState, useLayoutEffect } from 'react'

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
 * or generate it from a hashed token in the url
 */
const getAutheticatedUser = async () => {
	let authenticatedUser = goTrueAuth.currentUser()
	if (authenticatedUser) {
		return Promise.resolve(authenticatedUser)
	} else {
		const authenticationData = getAuthenticationDataFromHash()
		if (authenticationData) {
			authenticatedUser = await goTrueAuth.createUser(authenticationData, true)
			return Promise.resolve(authenticatedUser)
		} else {
			return Promise.resolve(false)
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

const SignOutUI = ({ authenticatedUser }) => {
	const signOut = async () => {
		await authenticatedUser.logout()
		// TODO: purge local cache for user
	}
	const { full_name, avatar_url } = authenticatedUser.user_metadata
	return (
		<div className="btn btn-sm centered" onClick={signOut}>
			<div>Sign Out</div>
			<div className="avatar-thumbnail">
				<img src={avatar_url} alt={full_name} className="icon rounded-circle border border-primary"></img>
			</div>
		</div>
	)
}

const AuthenticationUI = () => {
	const [authenticationUI, setAuthenticationUI] = useState(<SignInUI />)
	useLayoutEffect(() => {
		;(async () => {
			const authenticatedUser = await getAutheticatedUser()
			if (!!authenticatedUser) setAuthenticationUI(<SignOutUI authenticatedUser={authenticatedUser} />)
		})()
	}, [])
	return authenticationUI
}

/**
 * Authentication panel
 */
const AuthenticationPanel = () => (
	<div className="gridContainer">
		<div className="my-3 py-4 text-secondary text-center">
			<div className="py-5 text-dark alert alert-light">
				<SignInUI size="large" />
				<div className="pt-3">Authenticate with your Google account.</div>
			</div>
			<div className="p-1">
				<span role="img" aria-label="Padlock">
					🔏
				</span>
				Private channel
			</div>
		</div>
	</div>
)

export { getAutheticatedUser, AuthenticationPanel, AuthenticationUI }
