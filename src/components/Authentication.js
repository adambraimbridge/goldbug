import React from 'react'
import Head from 'next/head'
import { Context } from './Context'

/**
 * Render a UI to let the user sign in.
 * @param {string} size Whether to show a small or large button
 */
const SignInUI = ({ size }) => {
	const { setState } = React.useContext(Context)
	const googleAuth = () => {
		gapi.load('auth2', async () => {
			const googleAuth = gapi.auth2.init({
				client_id: process.env.GOOGLE_CLIENT_ID,
			})
			const googleUser = await googleAuth.signIn({
				fetch_basic_profile: true,
			})
			const profile = googleUser.getBasicProfile()
			const authenticatedUser = {
				email: profile.getEmail(),
				name: profile.getName(),
				givenName: profile.getGivenName(),
				familyName: profile.getFamilyName(),
				imageUrl: profile.getImageUrl(),
				token: googleUser.getAuthResponse().id_token,
			}
			setState({ authenticatedUser, loading: false })
			localStorage.setItem('authenticatedUser', JSON.stringify(authenticatedUser))
		})
	}
	const classList = `btn ${size === 'large' ? 'btn-lg btn-primary' : 'btn-sm btn-light'}`
	return (
		<>
			<Head>
				<script src="https://apis.google.com/js/platform.js?onload=init" async defer></script>
			</Head>
			<div onClick={googleAuth} className={classList}>
				Google Sign In
			</div>
		</>
	)
}

const SignOutUI = () => {
	const { state, setState } = React.useContext(Context)
	const { authenticatedUser } = state || {}
	const { name, imageUrl } = authenticatedUser

	// purge local cache for user
	const wipeAuthenticatedUser = () => {
		setState({ authenticatedUser: false, loading: false })
		localStorage.removeItem('authenticatedUser')
	}

	return (
		<div className="btn btn-sm btn-secondary centered pr-0" onClick={wipeAuthenticatedUser}>
			<div>Sign Out</div>
		</div>
	)
}

export const AuthenticationPanel = () => (
	<div className="gridContainer">
		<div className="my-3 py-4 text-secondary text-center">
			<div className="py-5 text-dark">
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

	React.useLayoutEffect(() => {
		let authenticatedUser
		try {
			authenticatedUser = JSON.parse(localStorage.getItem('authenticatedUser'))
			setState({ authenticatedUser: authenticatedUser })
		} catch (error) {
			// Ignore
		}
	}, [setState])

	if (authenticatedUser) {
		return <SignOutUI />
	} else {
		return <SignInUI size="small" />
	}
}
