/**
 * Authentication is provided by Netlify
 */
const axios = require('axios')

exports.handler = async (payload, context, other) => {
	// const { body } = payload
	// const { id } = JSON.parse(body)

	console.log({ payload, context, other })

	// let url = ''
	// let token = ''
	// try {
	// 	url = context.clientContext.identity.url
	// 	token = context.clientContext.identity.token
	// } catch (error) {
	// 	return { statusCode: 500, body: error }
	// }

	// const response = await axios(`${url}/admin/users/${id}`, {
	// 	method: 'GET',
	// 	headers: { Authorization: `Bearer ${token}` },
	// })

	// console.log({ response })
	return {
		statusCode: 200,
		body: JSON.stringify({ payload, context }),
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
