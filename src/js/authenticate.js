const createNonce = () => {
	const nonce = Math.random()
	window.sessionStorage.setItem('netlify-nonce', nonce)
	return nonce
}

const nonceIsValid = candidateNonce => {
	const sessionNonce = window.sessionStorage.getItem('netlify-nonce')
	window.sessionStorage.removeItem('netlify-nonce')
	return sessionNonce === candidateNonce
}

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

const getAppList = accessToken => {
	// Use the token to fetch the list of sites for the user
	fetch('https://api.netlify.com/api/v1/sites', {
		headers: {
			Authorization: 'Bearer ' + accessToken,
		},
	})
		.then(response => response.json())
		.then(json => {
			console.log('Your sites: ' + json.map(site => `<a href="${site.url}">${site.url}</a>`).join(','))
		})
		.catch(error => {
			console.log(`Error fetching sites: ${error}`)
		})
}

export const checkAuthentication = async () => {
	const hash = document.location.hash
	if (hash) {
		const authenticationData = getAuthenticationData(hash)
		if (!nonceIsValid(authenticationData.state)) {
			alert('CSRF Attack')
			return false
		}
	} else {
		const redirectURI = document.location.href
		const nonce = createNonce()
		const href = `https://www.goldbug.club/.netlify/identity/authorize?provider=google&redirect_uri=${redirectURI}&state=${nonce}&response_type=token`
		console.log({ href })
	}
}
