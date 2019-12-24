/**
 * Authentication is provided by Netlify
 */
const jwt = require('jsonwebtoken')
const axios = require('axios')

exports.handler = async (payload, context) => {
	try {
		const { body } = payload
		const { id } = JSON.parse(body)

		const userToken = payload.headers['x-nf-sign']
		const decoded = jwt.verify(userToken, process.env.API_SIGNATURE_TOKEN)
		if (!decoded) throw Error('Invalid User Token.')

		console.log({ decoded })

		const url = context.clientContext.identity.url
		const token = context.clientContext.identity.token

		const response = await axios(`${url}/admin/users/${id}`, {
			method: 'GET',
			headers: { Authorization: `Bearer ${token}` },
		})

		console.log({ response })
		return {
			statusCode: 200,
			body: JSON.stringify({ response }),
		}
	} catch (error) {
		return { statusCode: 500, body: error }
	}
}
