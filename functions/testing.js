/**
 * Authentication is provided by Netlify
 */
const axios = require('axios')

exports.handler = async (payload, context) => {
	// const { httpMethod, body } = payload
	// if (httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed.' }
	// const { id } = JSON.parse(body)

	let url = ''
	let token = ''
	try {
		url = context.clientContext.identity.url
		token = context.clientContext.identity.token
	} catch (error) {
		return { statusCode: 500, body: error }
	}

	// const response = await axios(`${url}/admin/users/${id}`, {
	// 	method: 'GET',
	// 	headers: { Authorization: `Bearer ${token}` },
	// })

	return {
		statusCode: 200,
		body: { url, token },
	}
}

// try {
//   return axios(apiUrl, {
//     method: "PUT",
//     headers: { Authorization: adminAuthHeader },
//     body: JSON.stringify({ app_metadata: { roles: ["superstar"] } })
//   })
//     .then(response => {
//       return response.json();
//     })
//     .then(data => {
//       console.log("Updated a user! 204!");
//       console.log(JSON.stringify({ data }));
//       return { statusCode: 204 };
//     })
//     .catch(e => return {...});
// } catch (e) { return e; }
