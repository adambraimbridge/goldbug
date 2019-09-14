import { useState } from 'preact/hooks'
import GoTrue from 'gotrue-js'
const auth = new GoTrue({
	APIUrl: 'https://www.goldbug.club/.netlify/identity',
	setCookie: true,
})

const getAuthenticationData = hash => {
	const authenticationData = hash
		.replace(/^#/, '')
		.split('&')
		.reduce((result, pair) => {
			const keyValue = pair.split('=')
			result[keyValue[0]] = keyValue[1]
			return result
		}, {})

	// Remove tokens from hash so that token does not remain in browser history.
	history.replaceState(null, null, '/')
	return authenticationData
}

const userUI = () => {
	let currentUser

	// See if the user has authenticated
	const hash = document.location.hash
	if (hash) {
		const authenticationData = getAuthenticationData(hash)
		currentUser = auth.createUser(authenticationData, true).catch(console.error)
	}

	if (!currentUser) {
		// Look for the currentUser in local storage
		currentUser = auth.currentUser()
	}

	console.log({ currentUser })

	const [user, setUser] = useState(currentUser)

	// const { avatar_url, full_name } = currentUser.user_metadata
	if (currentUser) {
		return (
			<div>
				<img src={user.avatar_url} width="40" /> {user.full_name}
				<a class="button is-small">Sign out</a>
			</div>
		)
	} else {
		return (
			<a class="button is-small" href="https://www.goldbug.club/.netlify/identity/authorize?provider=google">
				Sign in
			</a>
		)
	}
}

export default () => {
	return <div class="is-pulled-right">{userUI()}</div>
}
