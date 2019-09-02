import GoTrue from 'gotrue-js'
import { checkAuthentication } from './authenticate'
checkAuthentication()

const auth = new GoTrue({
	APIUrl: 'https://www.goldbug.club/.netlify/identity',
	setCookie: true,
})

const user = auth.getUserData()

console.log(user)
