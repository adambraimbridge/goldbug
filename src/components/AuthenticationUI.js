import React, { useState, useEffect } from 'react'

/**
 * Render a UI to let the user sign in.
 * @param {string} size Whether to show a small or large button
 */
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

// TODO: purge local cache for user
const SignOutUI = ({ authenticatedUser, setAuthenticatedUser }) => {
	const signOut = async () => {
		await authenticatedUser.logout().catch(console.log)
		setAuthenticatedUser(false)
	}
	const { full_name, avatar_url } = authenticatedUser.user_metadata
	return (
		<div className="p-0 btn btn-sm centered" onClick={signOut}>
			<div>Sign Out</div>
			<div className="avatar-thumbnail">
				<img src={avatar_url} alt={full_name} className="icon rounded-circle border border-primary"></img>
			</div>
		</div>
	)
}

export const AuthenticationPanel = () => (
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

export const AuthenticationUI = ({ authenticatedUser, setAuthenticatedUser }) => {
	const [authenticationUI, setAuthenticationUI] = useState(<SignInUI />)

	// If the authenticated user changes, then change the UI accordingly.
	useEffect(() => {
		;(async () => {
			if (authenticatedUser) {
				setAuthenticationUI(<SignOutUI authenticatedUser={authenticatedUser} setAuthenticatedUser={setAuthenticatedUser} />)
			} else {
				setAuthenticationUI(<SignInUI />)
			}
		})()
	}, [authenticatedUser, setAuthenticatedUser])
	return authenticationUI
}
