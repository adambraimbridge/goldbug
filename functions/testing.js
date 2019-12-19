exports.handler = async payload => {
	const data = {
		app_metadata: {
			testing: true,
			timestamp: Date.now(),
		},
	}
	console.log('testing ...', { data, payload })
	return {
		statusCode: 200,
		body: JSON.stringify(data),
	}
}
