import { h, render } from 'hyperons'
import GoTrue from 'gotrue-js'
import { checkAuthentication } from './authenticate'
const auth = new GoTrue({
	APIUrl: 'https://www.goldbug.club/.netlify/identity',
	setCookie: true,
})

export const getUserWidget = async () => {
	let currentUser

	// See if the user has authenticated
	const authenticationData = await checkAuthentication()
	if (authenticationData) {
		currentUser = await auth.createUser(authenticationData, true).catch(console.error)
	} else {
		// Look for the currentUser in local storage
		currentUser = auth.currentUser()
	}

	// const { avatar_url, full_name } = currentUser.user_metadata
	if (currentUser) {
		const UserWidget = () => (
			<div class="card is-mobile" role="navigation" aria-label="main navigation">
				<div class="navbar-item is-pulled-right">
					<button class="button is-small">Sign out</button>
				</div>
				<div class="navbar-item">💀 goldbug.club</div>
			</div>
		)
		return render(<UserWidget />)
	} else {
		// Show the authentication link
		return render(() => (
			<div class="hero">
				<h1>Welcome</h1>
				<p>
					<a href="https://www.goldbug.club/.netlify/identity/authorize?provider=google">You know what to do</a>
				</p>
			</div>
		))
	}
}
