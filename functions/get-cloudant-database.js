const Cloudant = require('@cloudant/cloudant')
const querystring = require('querystring')

const getDatabase = async (cloudant, id) => {
	// Check for cached credentials - if they exist, return the credentials.
	const remoteDatabase = await cloudant.db.get(id)
	if (remoteDatabase) {
		return remoteDatabase
	}

	const newApiKey = await cloudant.generate_api_key()
	const newRemoteDatabase = await cloudant.db.create(id)
	const database = cloudant.db.use(newRemoteDatabase)
	try {
		const security = await db.get_security()
		security[newApiKey.key] = ['_reader', '_writer', '_replicator']
		await database.set_security(security)
		return database
	} catch (error) {
		return { statusCode: 500, body: '' }
	}

	// Cache the credentials in the user's app_metadata (for subsequent logins).
	// Return the credentials.
}

exports.handler = async (event, context) => {
	console.log({ event, context })

	const { httpMethod, body } = event
	if (httpMethod !== 'POST') {
		return { statusCode: 405, body: 'Method Not Allowed' }
	}

	const params = querystring.parse(body)
	const { id } = params.user
	if (!id) {
		return { statusCode: 500, body: '' }
	}

	try {
		const cloudant = await Cloudant({
			username: process.env.CLOUDANT_USERNAME,
			password: process.env.CLOUDANT_PASSWORD,
			url: `https://${process.env.CLOUDANT_USERNAME}.cloudantnosqldb.appdomain.cloud/`,
		})

		const database = await getDatabase(cloudant, id)
		return database

		return { statusCode: 200, body: JSON.stringify(event), headers: { 'Content-Type': 'application/json' } }
	} catch (error) {
		console.error({ error })
		return { statusCode: 500, body: String(error) }
	}
}
