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

	console.log({ remoteDatabase })
	const database = cloudant.db.use(remoteDatabase.db_name)
	const security = await database.get_security()
	const newApiKey = await cloudant.generate_api_key()
	security[newApiKey.key] = ['_reader', '_writer', '_replicator']
	const result = await database.set_security(security)

	console.log(result)
}

exports.handler = async (event, context) => {
	const { httpMethod, body } = event
	if (httpMethod !== 'POST') {
		return { statusCode: 405, body: 'Method Not Allowed.' }
	}

	const payload = JSON.parse(body)
	const { id, app_metadata } = payload.user
	if (!id) {
		return { statusCode: 500, body: 'Could not get user ID.' }
	}

	// Check for credentials in the user's app_metadata. If they exist, return the credentials.
	if (app_metadata && ) {
		console.log({ app_metadata })
		// return { statuscode: 200, body: JSON.stringify(payload.user) }
	}

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
