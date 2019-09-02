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
		console.log({ authenticationData })
		const list = getAppList(authenticationData.access_token)
		console.log({ list })
	}
}
