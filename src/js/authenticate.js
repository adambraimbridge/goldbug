const createNonce = () => {
	const nonce = Math.random()
	winsow.sessionStorage.setItem('netlify-nonce', nonce)
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

	// Remove the token so it's not visible in the URL
	document.location.hash = ''
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
	/*
	 * The Oauth2 implicit grant flow works by sending the user to Netlify where she'll
	 * be asked to grant authorization to your application. Netlify will then redirect
	 * back to the Redirect URI on file for your app and set an access_token paramter
	 * in the "hash" part of the URL.
	 *
	 * If we have any hash, it's because the user is coming back from Netlify and we
	 * can start doing API requests on their behalf.
	 *
	 * If not, we'll trigger the first step and prepare to send the user to Netlify.
	 */
	const hash = document.location.hash
	if (hash) {
		const authenticationData = getAuthenticationData(hash)
		if (!nonceIsValid(authenticationData.state)) {
			alert('CSRF Attack')
			return false
		}
	} else {
		const clientId = 'https://www.goldbug.club'
		const redirectURI = document.location.href
		const nonce = createNonce()
		const href = `https://app.netlify.com/authorize?client_id=${clientId}&redirect_uri=${redirectURI}&state=${nonce}&response_type=token`

		console.log({ href })
	}
}
