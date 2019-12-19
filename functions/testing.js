exports.handler = async payload => {
	const data = {
		testing: true,
		timestamp: Date.now(),
	}
	console.log('testing ...', { data, payload })
	return {
		statusCode: 200,
		body: JSON.stringify(data),
	}
}
