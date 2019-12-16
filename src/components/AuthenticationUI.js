import React from 'react'
import { Context } from './Context'
import { getAuthenticatedUser } from '../lib/authentication'

/**
 * Render a UI to let the user sign in.
 * @param {string} size Whether to show a small or large button
 */
const SignInUI = ({ size }) => {
	const oAuthUrl = 'https://www.goldbug.club/.netlify/identity/authorize?provider=google'
	const { setState } = React.useContext(Context)

	const signIn = () => {
		setState({ loading: true })
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
const SignOutUI = () => {
	const { state, setState } = React.useContext(Context)
	const { authenticatedUser } = state || {}
	const { full_name, avatar_url } = authenticatedUser.user_metadata

	const signOut = async () => {
		setState({ loading: true })
		await state.authenticatedUser.logout().catch(console.log)
		setState({ authenticatedUser: false, loading: false })
	}

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

export const AuthenticationUI = () => {
	const { state, setState } = React.useContext(Context)
	const { authenticatedUser } = state || {}

	// Before rendering anything, get the authenticated user.
	React.useLayoutEffect(() => {
		;(async () => {
			const authenticatedUser = await getAuthenticatedUser()
			setState({ authenticatedUser })
		})()
	}, [setState])

	if (authenticatedUser) {
		return <SignOutUI />
	} else {
		return <SignInUI size="small" />
	}
}
