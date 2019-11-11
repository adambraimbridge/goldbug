const Cloudant = require('@cloudant/cloudant')

const getDatabaseCredentials = async id => {
	console.log('Getting database credentials. Connecting ...')
	const cloudant = await Cloudant({
		username: process.env.CLOUDANT_USERNAME,
		password: process.env.CLOUDANT_PASSWORD,
		url: `https://${process.env.CLOUDANT_USERNAME}.cloudantnosqldb.appdomain.cloud/`,
	})

	let remoteDatabase
	try {
		remoteDatabase = await cloudant.db.get(id)
	} catch (error) {
		console.log(`Database not found for ${id}. Provisioning ...`)
		response = await cloudant.db.create(id)
		console.log(`Database provisioned.`, { response })
		remoteDatabase = await cloudant.db.get(id)
	}

	const database = await cloudant.db.use(remoteDatabase.db_name)
	const security = await database.get_security()
	const credentials = await cloudant.generate_api_key()

	const newSecurity = Object.assign({}, security, {
		[credentials.key]: ['_reader', '_writer', '_replicator'],
	})

	await database.set_security(newSecurity)
	return credentials
}

exports.handler = async (event, context) => {
	const { httpMethod, body } = event
	if (httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed.' }

	const payload = JSON.parse(body)
	const { id } = payload.user
	if (!id) return { statusCode: 500, body: 'Could not get user ID.' }

	try {
		const credentials = await getDatabaseCredentials(id)

		// Save the credentials in the Netlify user's app_metadata.
		// See: https://docs.netlify.com/functions/functions-and-identity/#trigger-serverless-functions-on-identity-events
		return { statusCode: 200, body: JSON.stringify({ app_metadata: { credentials } }) }
	} catch (error) {
		console.error({ error })
		return { statusCode: 500, body: String(error) }
	}
}
