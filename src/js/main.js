import GoTrue from 'gotrue-js'
const provider = 'google'
const auth = new GoTrue({
	APIUrl: 'https://www.goldbug.club/.netlify/identity',
	setCookie: true,
})
const user = auth.currentUser()
console.log({ user })
