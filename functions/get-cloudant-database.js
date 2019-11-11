const Cloudant = require('@cloudant/cloudant')

const getDatabase = async id => {
	console.log('Getting database. Connecting ...')

	const cloudant = await Cloudant({
		username: process.env.CLOUDANT_USERNAME,
		password: process.env.CLOUDANT_PASSWORD,
		url: `https://${process.env.CLOUDANT_USERNAME}.cloudantnosqldb.appdomain.cloud/`,
	})

	let remoteDatabase
	try {
		remoteDatabase = await cloudant.db.get(id)
	} catch (error) {
		console.error(error)
		console.log('Database not found. Provisioning ...')
		remoteDatabase = await cloudant.db.create(id)
	}

	try {
		console.log({ remoteDatabase })
		const database = cloudant.db.use(remoteDatabase)
		const security = await database.get_security()
		const newApiKey = await cloudant.generate_api_key()
		security[newApiKey.key] = ['_reader', '_writer', '_replicator']
		const result = await database.set_security(security)

		console.log(result)

		return database
	} catch (error) {
		console.error(error)
		return { statusCode: 500, body: String(error) }
	}
}

exports.handler = async (event, context) => {
	console.log({ event, context })

	const { httpMethod, body } = event
	if (httpMethod !== 'POST') {
		return { statusCode: 405, body: 'Method Not Allowed' }
	}

	const payload = JSON.parse(body)
	const { id } = payload.user
	if (!id) {
		throw new Error('Could not get user ID.')
	}

	// TODO: Check for credentials in the user's app_metadata. If they exist, return the credentials.

	try {
		const database = await getDatabase(id)
		console.log({ database })

		// TODO: Cache the credentials in the user's app_metadata (for subsequent logins).

		return { statusCode: 200, body: JSON.stringify(database), headers: { 'Content-Type': 'application/json' } }
	} catch (error) {
		console.error({ error })
		return { statusCode: 500, body: String(error) }
	}
}
