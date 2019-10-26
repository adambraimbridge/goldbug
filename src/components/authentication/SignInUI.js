import React from 'react'
const oAuthUrl =
	'https://www.goldbug.club/.netlify/identity/authorize?provider=google'
/**
 * Return the UserUI component
 * Handle signing in and out
 */
export default ({ size }) => {
	const signIn = () => {
		// Redirect to OAuth endpoint. It'll redirect back after the user signs in.
		window.location = oAuthUrl
	}
	const classList = `btn ${
		size === 'large' ? 'btn-lg btn-primary' : 'btn-sm btn-light'
	}`
	return (
		<div className={classList} onClick={signIn}>
			Google Sign In
		</div>
	)
}
