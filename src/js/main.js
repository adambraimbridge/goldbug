import GoTrue from 'gotrue-js'
import { checkAuthentication } from './authenticate'
;(async () => {
	const auth = new GoTrue({
		APIUrl: 'https://www.goldbug.club/.netlify/identity',
		setCookie: true,
	})

	const settings = await auth.settings()
	const user = auth.getUserData()

	console.log({ user, settings })

	const authenticationData = await checkAuthentication()
	if (authenticationData) {
		localStorage.setItem('adam@braimbridge.com', authenticationData)
		console.log({ authenticationData })
		const list = getAppList(authenticationData.access_token)
		console.log({ list })
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
})()
