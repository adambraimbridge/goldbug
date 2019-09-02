/*
 * This function is called when a user returns from Netlify and has accepted the
 * request to authorize your app.
 *
 * It extracts the token from the response and use it to do a simple API request
 * fetching the latest sites from the user from Netlify.
 */
const handleAccessToken = hash => {
	// The access token is returned in the hash part of the document.location
	// #access_token=1234&response_type=token
	const response = hash
		.replace(/^#/, '')
		.split('&')
		.reduce((result, pair) => {
			const keyValue = pair.split('=')
			result[keyValue[0]] = keyValue[1]
			return result
		}, {})

	// Remove the token so it's not visible in the URL after we're done
	document.location.hash = ''

	if (!localStorage.getItem(response.state)) {
		// We need to verify the random state we set before starting the request,
		// otherwise this could be an access token from someone else than our user
		alert('CSRF Attack')
		return
	}
	localStorage.removeItem(response.state)

	// Use the token to fetch the list of sites for the user
	fetch('https://api.netlify.com/api/v1/sites', {
		headers: {
			Authorization: 'Bearer ' + response.access_token,
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
		handleAccessToken(hash)
	} else {
		// We generate a random state that we'll validate when Netlify redirects back.
		state = Math.random()
		localStorage.setItem(state, true)
	}
}
