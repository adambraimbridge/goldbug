const Cloudant = require('@cloudant/cloudant')

/**
 * Authentication is provided by Netlify via Google OAuth.
 * Identites are created in Netlify for newly authenticated users.
 */
const GoTrue = require('gotrue-js')
// const goTrueAuth = new GoTrue({
// 	APIUrl: 'https://www.goldbug.club/.netlify/identity',
// 	setCookie: true,
// })

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
		// console.error(error)
		console.log(`Database not found for ${id}. Provisioning ...`)
		remoteDatabase = await cloudant.db.create(id)
		console.log(`Database provisionined.`, { remoteDatabase })
	}

	const database = await cloudant.db.use(remoteDatabase.db_name)
	const security = await database.get_security()
	const credentials = await cloudant.generate_api_key()

	console.log({ database, security, credentials })

	const newSecurity = Object.assign({}, security, {
		cloudant: {
			[credentials.key]: ['_reader', '_writer', '_replicator'],
		},
	})

	console.log({ newSecurity })

	const result = await database.set_security(newSecurity)

	console.log(JSON.stringify({ security }))
	console.log({ database, security, credentials, result })

	return result
}

// const updateUser = async context => {
// 	const { identity, user } = context.clientContext
//   	const userID = user.sub
//   	const userUrl = `${identity.url}/admin/users/${userID}`
//   	const adminAuthHeader = "Bearer " + identity.token

//   try {
//     return fetch(userUrl, {
//       method: "PUT",
//       headers: { Authorization: adminAuthHeader },
//       body: JSON.stringify({ app_metadata: { roles: ["superstar"] } })
//     })
//       .then(response => {
//         return response.json();
//       })
//       .then(data => {
//         console.log("Updated a user! 204!");
//         console.log(JSON.stringify({ data }));
//         return { statusCode: 204 };
//       })
//       .catch(e => return {...});
//   } catch (e) { return e; }
// };

// }

exports.handler = async (event, context) => {
	const { httpMethod, body } = event
	if (httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed.' }

	const payload = JSON.parse(body)
	const { id } = payload.user
	if (!id) return { statusCode: 500, body: 'Could not get user ID.' }

	try {
		const credentials = await getDatabaseCredentials(id)
		console.log({ credentials })

		// Save the credentials in the Netlify user's app_metadata.
		const response = updateUser(context, credentials)

		authenticatedUser.update(userData)

		return { statusCode: 200 }
	} catch (error) {
		console.error({ error })
		return { statusCode: 500, body: String(error) }
	}
}
