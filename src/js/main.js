import GoTrue from 'gotrue-js'

const auth = new GoTrue({
	APIUrl: 'https://www.goldbug.club/.netlify/identity',
	setCookie: true,
})

const user = auth.currentUser()

console.log(user)

// // Todo: Check authentication and show the login link if appropriate.
// import { checkAuthentication } from './authenticate'

// checkAuthentication()
