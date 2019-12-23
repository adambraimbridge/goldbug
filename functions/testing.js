exports.handler = async payload => {
	console.log('testing ...', { payload })
	return {
		statusCode: 200,
		body: JSON.stringify(payload),
	}
}
