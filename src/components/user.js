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

	if (currentUser) {
		const { avatar_url, full_name } = currentUser.user_metadata
		const UserWidget = () => (
			<div class="welcome-banner">
				<h1>
					<img src={avatar_url} width="40" /> {full_name}
				</h1>
			</div>
		)
		return render(<UserWidget />)
	} else {
		// Show the authentication link
		return render(() => (
			<div class="welcome-banner">
				<h1>Welcome</h1>
				<p>
					<a href="https://www.goldbug.club/.netlify/identity/authorize?provider=google">You know what to do</a>
				</p>
			</div>
		))
	}
}
