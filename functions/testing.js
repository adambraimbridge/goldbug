/**
 * Authentication is provided by Netlify
 */
const axios = require('axios')

exports.handler = async payload => {
	const { httpMethod, body } = payload
	// if (httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed.' }

	console.log('testing ...', JSON.parse(body))

	const { url, id, token } = JSON.parse(body)
	const { access_token } = token

	console.log(`${url}/admin/users/${id}`)

	const response = await axios(`${url}/admin/users/${id}`, {
		method: 'GET',
		headers: { Authorization: `Bearer ${access_token}` },
	})

	return {
		statusCode: 200,
		body: JSON.stringify({ response }),
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
