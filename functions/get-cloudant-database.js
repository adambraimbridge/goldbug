/**
 * Authentication is provided by Google OAuth2
 *
 * https://developers.google.com/identity/sign-in/web/backend-auth
 * https://github.com/googleapis/google-api-nodejs-client#oauth2-client
 */
const Cloudant = require('@cloudant/cloudant')
const getUuid = require('uuid-by-string')

/**
 * Generate API key/password credentials.
 */
const getDatabaseCredentials = async (cloudant, db_name) => {
	const database = await cloudant.db.use(db_name)
	const security = await database.get_security()
	const credentials = await cloudant.generate_api_key()
	const { key, password } = credentials

	// New credentials are created for each device the user connects from.
	const newSecurity = Object.assign({}, security.cloudant, {
		[key]: ['_reader', '_writer', '_replicator'],
	})

	await database.set_security(newSecurity).catch(console.log)
	return { key, password, db_name }
}

/**
 * Cloudant throws an error if you attempt to get a database that does not exist.
 */
const getRemoteDatabase = async (cloudant, db_name) => {
	try {
		await cloudant.db.get(db_name)
		return true
	} catch (error) {
		return false
	}
}

/**
 * Provision a remote database for the Netlify user.
 */
const provisionRemoteDatabase = async (cloudant, db_name) => {
	try {
		await cloudant.db.create(db_name)
	} catch (error) {
		return false
	}
}

exports.handler = async payload => {
	// Todo: JWT authentication or something. I don't have mental energy to figure out JWT right now.

	const { httpMethod, body } = payload
	if (httpMethod !== 'POST' && httpMethod !== 'OPTIONS') return { statusCode: 405, body: 'Method Not Allowed.' }

	const user = JSON.parse(body)
	console.log({ user })

	const cloudant = await Cloudant({
		username: process.env.CLOUDANT_USERNAME,
		password: process.env.CLOUDANT_PASSWORD,
		url: `https://${process.env.CLOUDANT_USERNAME}.cloudantnosqldb.appdomain.cloud/`,
	})

	// @see https://docs.couchdb.org/en/stable/api/database/common.html#put--db
	const db_name = `goldbug-${getUuid(user.email)}`

	// Check for a remote database. Not found? Provision one.
	const hasRemoteDatabase = await getRemoteDatabase(cloudant, db_name)
	if (!hasRemoteDatabase) {
		console.log('Provisioning remote database ...')
		await provisionRemoteDatabase(cloudant, db_name).catch(error => {
			return { statusCode: 500, body: `Could not provision remote database. ${error}` }
		})

		// A new database needs new credentials, so delete any old credentials that might be in.
		try {
			delete user.credentials
		} catch (error) {}
	}

	// Create database credentials if appropriate.
	if (!user.credentials) {
		console.log('Creating credentials for remote database ...')
		credentials = await getDatabaseCredentials(cloudant, db_name).catch(console.error)

		console.log({ credentials })

		if (!credentials) return { statusCode: 500, body: `Could not create credentials for remote database.` }
	}

	/**
	 * The credentials returned here are saved to the Netlify user's account.
	 */
	const data = {
		statusCode: 200,
		body: JSON.stringify(credentials),
		headers: {
			'Content-Type': 'application/json',
		},
	}
	console.log('Returning response data', { data })
	return data
}
