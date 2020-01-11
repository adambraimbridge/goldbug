import React from 'react'
import Head from 'next/head'
// import { GoogleLogin } from 'react-google-login'
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
			const name = profile.getName()
			const imageUrl = profile.getImageUrl()
			const token = googleUser.getAuthResponse().id_token
			const authenticatedUser = { name, imageUrl, token }
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

// TODO: purge local cache for user
const SignOutUI = () => {
	const { state, setState } = React.useContext(Context)
	const { authenticatedUser } = state || {}
	const { name, imageUrl } = authenticatedUser

	const wipeAuthenticatedUser = () => {
		setState({ authenticatedUser: false, loading: false })
		localStorage.removeItem('authenticatedUser')
	}

	return (
		<div className="btn btn-sm btn-light centered pr-1" onClick={wipeAuthenticatedUser}>
			<div>Sign Out</div>
			<div className="avatar-thumbnail">
				<img src={imageUrl} alt={name} className="icon border border-secondary"></img>
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
