const Cloudant = require('@cloudant/cloudant')
const getUuid = require('uuid-by-string')

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

exports.handler = async event => {
	const { httpMethod, body } = event
	if (httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed.' }

	const payload = JSON.parse(body)
	if (payload.event !== 'login') return

	// @see https://docs.couchdb.org/en/stable/api/database/common.html#put--db
	const databaseName = `goldbug-${getUuid(payload.user.email)}`

	const { app_metadata, user_metadata } = payload.user
	console.log({ app_metadata, user_metadata })

	const cloudant = await Cloudant({
		username: process.env.CLOUDANT_USERNAME,
		password: process.env.CLOUDANT_PASSWORD,
		url: `https://${process.env.CLOUDANT_USERNAME}.cloudantnosqldb.appdomain.cloud/`,
	})

	/**
	 * If the remote database for the user doesn't exist, provision one.
	 */
	let remoteDatabase
	try {
		remoteDatabase = await cloudant.db.get(databaseName)
		console.log(`Database found: ${databaseName}`)
	} catch (error) {
		console.log(`Database not found: ${databaseName}. Provisioning new database ...`)
		try {
			await cloudant.db.create(databaseName)
			remoteDatabase = await cloudant.db.get(databaseName)
		} catch (error) {
			console.error(error)
			return { statusCode: 500, body: `Could not provision remote database. ${error}` }
		}
	}

	/**
	 * Generate API key/password credentials.
	 */

	// Todo: Check if app_metadata already contains credentials
	const credentials = await getDatabaseCredentials(cloudant, remoteDatabase.db_name)
	const newAppMetadata = Object.assign({}, app_metadata, credentials)
	const bodyString = JSON.stringify({
		app_metadata: newAppMetadata,
	})

	console.log({ bodyString })

	// Save the credentials in the Netlify user's app_metadata.
	// See: https://docs.netlify.com/functions/functions-and-identity/#trigger-serverless-functions-on-identity-events
	return { statusCode: 200, body: bodyString }
}
