const Cloudant = require('@cloudant/cloudant')
const getUuid = require('uuid-by-string')

const getDatabaseCredentials = async (cloudant, remoteDatabase) => {
	const database = await cloudant.db.use(remoteDatabase.db_name)
	const security = await database.get_security()
	const credentials = await cloudant.generate_api_key()

	const newSecurity = Object.assign({}, security, {
		[credentials.key]: ['_reader', '_writer', '_replicator'],
	})

	await database.set_security(newSecurity)
	return credentials
}

exports.handler = async event => {
	const { httpMethod, body } = event
	if (httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed.' }

	const payload = JSON.parse(body)
	if (payload.event !== 'login') return { statusCode: 200 }

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
	 * If the remote database for the user exists, return a success status code.
	 */
	try {
		await cloudant.db.get(databaseName)
		console.log(`Database found: ${databaseName}`)

		console.log(
			JSON.stringify({
				app_metadata,
				user_metadata,
			})
		)

		return {
			statusCode: 200,
			body: JSON.stringify({
				app_metadata,
				user_metadata,
			}),
		}
	} catch (error) {
		console.log(`Database not found: ${databaseName}`)
	}

	/**
	 * Create a new database for the user and generate API key/password credentials.
	 */
	console.log('Provisioning new database ...')
	try {
		const response = await cloudant.db.create(databaseName)
		console.log({ response })
	} catch (error) {
		console.error(error)
	}
	const remoteDatabase = await cloudant.db.get(databaseName)
	const credentials = await getDatabaseCredentials(cloudant, remoteDatabase)
	credentials.databaseName = databaseName
	const newAppMetadata = Object.assign({}, app_metadata, credentials)
	const bodyString = JSON.stringify({
		app_metadata: newAppMetadata,
		user_metadata: newAppMetadata,
	})

	console.log({ bodyString })

	// Save the credentials in the Netlify user's app_metadata.
	// See: https://docs.netlify.com/functions/functions-and-identity/#trigger-serverless-functions-on-identity-events
	return { statusCode: 200, body: bodyString }
}
