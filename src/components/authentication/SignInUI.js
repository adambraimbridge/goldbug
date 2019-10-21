import React from 'react'
import Button from 'react-bootstrap/Button'

/**
 * Return the UserUI component
 * Handle signing in and out
 */
export default () => {
	const signIn = () => {
		// Redirect to OAuth endpoint. It'll redirect back after the user signs in.
		window.location =
			'https://www.goldbug.club/.netlify/identity/authorize?provider=google'
	}
	return (
		<Button variant="primary" size="sm" onClick={signIn}>
			Google Sign In
		</Button>
	)
}
