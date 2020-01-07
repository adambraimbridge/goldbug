import React from 'react'
import { GoogleLogin, GoogleLogout } from 'react-google-login'
import { Context } from './Context'
import { getAuthenticatedUser } from '../lib/authentication'

/**
 * Render a UI to let the user sign in.
 * @param {string} size Whether to show a small or large button
 */
const SignInUI = ({ size }) => {
	const { setState } = React.useContext(Context)

	const responseGoogle = googleUser => {
		const authenticatedUser = googleUser.getBasicProfile()
		setState({ authenticatedUser, loading: false })
	}

	const classList = `btn ${size === 'large' ? 'btn-lg btn-primary' : 'btn-sm btn-light'}`
	return (
		<GoogleLogin
			clientId={process.env.GOOGLE_CLIENT_ID}
			accessType="offline"
			render={renderProps => (
				<div onClick={renderProps.onClick} disabled={renderProps.disabled} className={classList}>
					Google Sign In
				</div>
			)}
			onSuccess={responseGoogle}
			onFailure={responseGoogle}
			cookiePolicy={'single_host_origin'}
		/>
	)
}

// TODO: purge local cache for user
const SignOutUI = () => {
	const { state, setState } = React.useContext(Context)
	const { authenticatedUser } = state || {}
	const full_name = authenticatedUser.ig
	const avatar_url = authenticatedUser.Paa

	const signOut = async () => {
		setState({ loading: true })
		await state.authenticatedUser.logout().catch(console.log)
		setState({ authenticatedUser: false, loading: false })
	}

	return (
		<div className="btn btn-sm btn-light centered pr-1" onClick={signOut}>
			<div>Sign Out</div>
			<div className="avatar-thumbnail">
				<img src={avatar_url} alt={full_name} className="icon border border-secondary"></img>
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
