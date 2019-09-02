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

export const checkAuthentication = async () => {
	const hash = document.location.hash
	if (hash) {
		return getAuthenticationData(hash)
	}
}
