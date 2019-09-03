import GoTrue from 'gotrue-js'
import { checkAuthentication } from './authenticate'
;(async () => {
	const auth = new GoTrue({
		APIUrl: 'https://www.goldbug.club/.netlify/identity',
		setCookie: true,
	})

	const authenticationData = await checkAuthentication()
	if (authenticationData) {
		const user = await auth.createUser(authenticationData, true).catch(console.error)

		// If the user does not have Cloudant credentials in their metadata, create a new DB for that user.
	}
})()
