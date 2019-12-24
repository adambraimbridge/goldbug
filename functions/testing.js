/**
 * Authentication is provided by Netlify
 */
const jwt = require('jsonwebtoken')
const axios = require('axios')

exports.handler = async (payload, context) => {
	try {
		// const { body } = payload
		// const { id } = JSON.parse(body)

		const userToken = payload.headers['x-nf-sign']
		const decoded = jwt.verify(userToken, process.env.API_SIGNATURE_TOKEN)
		console.log({ decoded })

		const url = context.clientContext.identity.url
		const token = context.clientContext.identity.token
		console.log({ url, token })

		// const response = await axios(`${url}/admin/users/${id}`, {
		// 	method: 'GET',
		// 	headers: { Authorization: `Bearer ${token}` },
		// })
		// console.log({ response })

		return {
			statusCode: 200,
			body: JSON.stringify({ context }),
		}
	} catch (error) {
		return { statusCode: 500, body: error }
	}
}
