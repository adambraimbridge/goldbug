// const Cloudant = require('@cloudant/cloudant')
// const querystring = require('querystring')

exports.handler = async request => {
	return { statusCode: 204 }
}
// const { httpMethod, body } = request
// const { payload } = querystring.parse(body)

// console.log({ httpMethod, payload, request })

// if (httpMethod !== 'POST') {
// 	return { statusCode: 405, body: 'Method Not Allowed' }
// }

// const params = querystring.parse(body)

// console.log({ params })

// return { statusCode: 200, body: JSON.stringify(request), headers: { 'Content-Type': 'application/json' } }
// try {
// 	const cloudant = await Cloudant({
// 		username: process.env.CLOUDANT_USERNAME,
// 		password: process.env.CLOUDANT_PASSWORD,
// 		url: `https://${process.env.CLOUDANT_USERNAME}.cloudantnosqldb.appdomain.cloud/`,
// 	})
// 	const databases = await cloudant.db.list()
// 	console.log({ databases })

// 	if (!databases.length) {
// 		throw new Error('No databases found.')
// 	}

// 	return { statusCode: 200, body: JSON.stringify(request), headers: { 'Content-Type': 'application/json' } }
// } catch (error) {
// 	console.error({ error })
// 	return { statusCode: 500, body: String(error) }
// }
// }
