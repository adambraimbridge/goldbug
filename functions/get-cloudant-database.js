const Cloudant = require('@cloudant/cloudant')
const getUuid = require('uuid-by-string')
const GoTrue = require('gotrue-js').GoTrue

/**
 * If the remote database for the user doesn't exist, provision one.
 */
const provisionDatabase = async (cloudant, db_name) => {
	try {
		await cloudant.db.get(db_name)
		console.log(`Database found: ${db_name}`)
	} catch (error) {
		console.log(`Database not found: ${db_name}. Provisioning new database ...`)
		try {
			await cloudant.db.create(db_name)
		} catch (error) {
			console.error(error)
			return { statusCode: 500, body: `Could not provision remote database. ${error}` }
		}
	}
}

const getDatabaseCredentials = async (cloudant, db_name) => {
	const database = await cloudant.db.use(db_name)
	const security = await database.get_security()
	const credentials = await cloudant.generate_api_key()
	const { key, password } = credentials

	const newSecurity = Object.assign({}, security, {
		[key]: ['_reader', '_writer', '_replicator'],
	})
	await database.set_security(newSecurity)

	return { key, password, db_name }
}

/**
 * Authentication is provided by Netlify via Google OAuth.
 */
const getAuthenticatedUser = async user => {
	const goTrueAuth = new GoTrue({
		APIUrl: 'https://www.goldbug.club/.netlify/identity',
	})
	const authenticatedUser = goTrueAuth.currentUser()
	// authenticatedUser = await goTrueAuth.getUser(authenticationData)
	return authenticatedUser
}

exports.handler = async payload => {
	const { httpMethod, body } = payload
	if (httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed.' }

	const { event, user } = JSON.parse(body)
	console.log({ event, user })
	if (event !== 'login') return { statusCode: 405, body: 'Event Type Not Allowed.' }

	const authenticatedUser = await getAuthenticatedUser()
	console.log({ authenticatedUser })

	const cloudant = await Cloudant({
		username: process.env.CLOUDANT_USERNAME,
		password: process.env.CLOUDANT_PASSWORD,
		url: `https://${process.env.CLOUDANT_USERNAME}.cloudantnosqldb.appdomain.cloud/`,
	})

	// @see https://docs.couchdb.org/en/stable/api/database/common.html#put--db
	const db_name = `goldbug-${getUuid(user.email)}`
	await provisionDatabase(cloudant, db_name)

	const credentials = await getDatabaseCredentials(cloudant, db_name)

	/**
	 * Generate API key/password credentials.
	 */

	// Todo: Check if app_metadata already contains credentials
	const { app_metadata } = user
	app_metadata.credentials = credentials
	const bodyString = JSON.stringify({ app_metadata })

	console.log({ bodyString })

	// Save the credentials in the Netlify user's app_metadata.
	// See: https://docs.netlify.com/functions/functions-and-identity/#trigger-serverless-functions-on-identity-events
	return { statusCode: 200, body: bodyString }
}
