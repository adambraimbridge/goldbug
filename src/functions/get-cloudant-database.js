const Cloudant = require('@cloudant/cloudant')
const querystring = require('querystring')
exports.handler = async ({ httpMethod, body }) => {
	if (httpMethod !== 'POST') {
		return { statusCode: 405, body: 'Method Not Allowed' }
	}
	console.log({ body })

	// const { token, text, response_url } = querystring.parse(body)
	// const { SLACK_TOKEN } = process.env
	// if (!token || token !== SLACK_TOKEN) {
	//   return { statusCode: 401, body: 'Unauthorized' }
	// }
	try {
		const cloudant = await Cloudant({
			username: process.env.CLOUDANT_USERNAME,
			password: process.env.CLOUDANT_PASSWORD,
			url: `https://${process.env.CLOUDANT_USERNAME}.cloudantnosqldb.appdomain.cloud/`,
		})
		console.log({ cloudant })

		const databases = await cloudant.db.list()
		console.log({ databases })

		return {
			statusCode: 200,
		}
	} catch (error) {
		console.error(error)
		return {
			statusCode: 422, // Unprocessable Entity
			body: error.message,
		}
	}
}

// /* Global configuration */
// ;(async (user, context, callback) => {
//   Cloudant({
//     username: process.env.CLOUDANT_USERNAME,
//     password: process.env.CLOUDANT_PASSWORD,
//     url: `https://${process.env.CLOUDANT_USERNAME}.cloudantnosqldb.appdomain.cloud/`
//   }, (error, cloudant, pong) => {
//     if (error) console.error(`ERROR: ${error.message}`)
//     cloudant.db.list(function (err, body, headers) {
//       console.log({ err, body, headers });
//     })
// })()
