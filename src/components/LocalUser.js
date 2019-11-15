import React, { createContext, useContext, useState, useLayoutEffect } from 'react'
import { getAuthenticatedUser } from '../lib/authentication'

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

const SignOutUI = authenticatedUser => {
	console.log(authenticatedUser.user_metadata)

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

const LocalUser = createContext(Promise.resolve(getAuthenticatedUser()))

export const AuthenticationUI = () => {
	debugger
	const authenticatedUser = useContext(LocalUser)
	const [authenticationUI, setAuthenticationUI] = useState(<SignInUI />)
	useLayoutEffect(async () => {
		if (authenticatedUser) setAuthenticationUI(<SignOutUI authenticatedUser={authenticatedUser} />)
	}, [authenticatedUser])
	return authenticationUI
}
