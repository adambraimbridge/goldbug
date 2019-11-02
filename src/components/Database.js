import PouchDB from 'pouchdb'
const localDatabase = new PouchDB('goldbug-club')

const getLocalDatabase = () => {
	localDatabase.changes({
		since: 'now',
		live: true,
	})
	// .on('change', showMessages)
	return Promise.resolve(localDatabase)
}

const putMessage = async message => {
	try {
		const response = await localDatabase.put({
			...message,
			_id: new Date().toISOString(),
		})
		console.log(message, response)
		return response
	} catch (err) {
		console.log(err)
	}
}

const deleteMessage = () => {
	console.log('Deleted.')
}

const getAllMessages = async () => {
	try {
		const allDocs = await localDatabase.allDocs({
			include_docs: true,
			attachments: true,
		})
		return allDocs.rows.map(row => ({
			text: row.doc.text,
		}))
	} catch (err) {
		console.log(err)
	}
}

export { getLocalDatabase, getAllMessages, putMessage, deleteMessage }
