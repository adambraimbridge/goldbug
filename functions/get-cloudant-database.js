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

	const newSecurity = Object.assign({}, security, {
		[key]: ['_reader', '_writer', '_replicator'],
	})
	await database.set_security(newSecurity)

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
	const { httpMethod, body } = payload
	if (httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed.' }

	const { event, user } = JSON.parse(body)
	console.log({ event, user })
	if (event !== 'signup' && event !== 'login') return { statusCode: 405, body: 'Event Type Not Allowed.' }

	const cloudant = await Cloudant({
		username: process.env.CLOUDANT_USERNAME,
		password: process.env.CLOUDANT_PASSWORD,
		url: `https://${process.env.CLOUDANT_USERNAME}.cloudantnosqldb.appdomain.cloud/`,
	})

	// @see https://docs.couchdb.org/en/stable/api/database/common.html#put--db
	const db_name = `goldbug-${getUuid(user.email)}`

	// Check for a remote database and provision one if neccessary.
	const hasRemoteDatabase = await getRemoteDatabase(cloudant, db_name)
	if (!hasRemoteDatabase) {
		const success = await provisionRemoteDatabase(cloudant, db_name)
		if (!success) return { statusCode: 500, body: `Could not provision remote database.` }
	}

	// Check for database credentials and create them if neccessary.
	if (!user.app_metadata.credentials) {
		const credentials = await getDatabaseCredentials(cloudant, db_name)
		if (!credentials) return { statusCode: 500, body: `Could not create credentials for remote database.` }

		// Save the credentials in the Netlify user's app_metadata.
		// See: https://docs.netlify.com/functions/functions-and-identity/#trigger-serverless-functions-on-identity-events
		return {
			statusCode: 200,
			body: JSON.stringify({ app_metadata: { credentials } }),
		}
	}

	return {
		statusCode: 200,
	}
}
