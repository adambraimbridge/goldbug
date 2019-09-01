import GoTrue from 'gotrue-js'
const provider = 'google'
const auth = new GoTrue({
	APIUrl: 'https://www.goldbug.club/.netlify/identity',
	setCookie: true,
})
const user = auth.currentUser()
console.log({ user })

/**
 * Complete authentication if we were redirected back to from the provider.
 */
const hashParams = new URLSearchParams(document.location.hash.replace(/^#?\/?/, ''))
// if (!hashParams.has('access_token') && !hashParams.has('error')) {
// 	return
// }
// Remove tokens from hash so that token does not remain in browser history.
this.clearHash()

const params = Map(hashParams.entries())

// const validNonce = validateNonce(params.get('state'))
// if (!validNonce) {
// 	return cb(new Error('Invalid nonce'))
// }

// if (params.has('error')) {
// 	return cb(new Error(`${params.get('error')}: ${params.get('error_description')}`))
// }

if (params.has('access_token')) {
	const { access_token: token, ...data } = params.toJS()
	console.log({ access_token, data })
}
