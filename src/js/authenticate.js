import GoTrue from 'gotrue-js'
const auth = new GoTrue({
	APIUrl: 'https://www.goldbug.club/.netlify/identity',
	setCookie: true,
})
export const checkAuthentication = async () => {
	// Hash parameters are like query parameters, except with a `#` instead of a `?`
	const hashParams = new URLSearchParams(document.location.hash.replace(/^#?\/?/, ''))

	// Remove tokens from hash so that token does not remain in browser history.
	history.replaceState(null, null, '/')

	const params = new Map(hashParams.entries())
	if (params.has('error')) {
		console.error(`${params.get('error')}: ${params.get('error_description')}`)
	}

	// If there's a access_token hash parameter, do the thing
	if (params.has('access_token')) {
		// params.get('access_token')
		// params.get('expires_in')
		// params.get('refresh_token')
		// params.get('token_type')

		// Save the token in local storage
		const user = auth.currentUser()
		console.log({ user })
	}
}
