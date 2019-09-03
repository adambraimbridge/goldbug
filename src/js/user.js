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
		const userHTML = () => h('div', { class: 'welcome-banner' }, h('h1', null, full_name), h('p', null, avatar_url))
		return render(userHTML())
	} else {
		// Show the authentication link
		const Welcome = () => h('div', { class: 'welcome-banner' }, h('h1', null, 'Hello World!'), h('p', null, 'Show the authentication link'))
		return render(Welcome())
	}
}
