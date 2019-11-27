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

exports.handler = async (payload, context) => {
	const { httpMethod, body } = payload
	if (httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed.' }

	const { event, user } = JSON.parse(body)
	const { identity } = context.clientContext
	console.log({ user, event, identity })
	if (event !== 'signup' && event !== 'login') return { statusCode: 405, body: 'Event Type Not Allowed.' }

	const cloudant = await Cloudant({
		username: process.env.CLOUDANT_USERNAME,
		password: process.env.CLOUDANT_PASSWORD,
		url: `https://${process.env.CLOUDANT_USERNAME}.cloudantnosqldb.appdomain.cloud/`,
	})

	// @see https://docs.couchdb.org/en/stable/api/database/common.html#put--db
	const db_name = `goldbug-${getUuid(user.email)}`

	/**
	 * Provision a remote database for the new Netlify user.
	 */
	try {
		await cloudant.db.get(db_name)
		console.log(`Database found: ${db_name}`)
		return { statusCode: 200 }
	} catch (error) {
		console.log(`Database not found: ${db_name}. Provisioning new database ...`)
		try {
			await cloudant.db.create(db_name)
		} catch (error) {
			console.error(error)
			return { statusCode: 500, body: `Could not provision remote database. ${error}` }
		}
	}

	const credentials = await getDatabaseCredentials(cloudant, db_name)
	const { app_metadata } = user
	app_metadata.credentials = credentials
	const bodyString = JSON.stringify({ app_metadata })

	console.log({ bodyString })

	// Save the credentials in the Netlify user's app_metadata.
	// See: https://docs.netlify.com/functions/functions-and-identity/#trigger-serverless-functions-on-identity-events
	return { statusCode: 200, body: bodyString }
}
