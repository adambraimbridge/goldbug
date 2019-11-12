import PouchDB from 'pouchdb'
const CLOUDANT_USERNAME = '459013e0-ccee-4235-a047-55410e69aaea-bluemix'

const localDatabase = new PouchDB('goldbug-club')
localDatabase.changes({
	live: true,
	since: 'now',
})

const syncRemoteDatabase = localUser => {
	const { username, password } = localUser
	const remoteUrl = `https://${username}:${password}@${CLOUDANT_USERNAME}.cloudantnosqldb.appdomain.cloud/`
	const remoteDatabase = new PouchDB(remoteUrl)

	localDatabase
		.sync(remoteDatabase, {
			live: true,
			retry: true,
		})
		.on('change', change => {
			console.log({ change }, 'something changed.')
		})
		.on('paused', info => {
			console.log({ info }, 'replication was paused.')
		})
		.on('active', info => {
			console.log({ info }, 'replication was resumed.')
		})
		.on('error', error => {
			console.error(error)
		})
}

const putMessage = async (message, localDatabase) => {
	try {
		const response = await localDatabase.put({
			...message,
			_id: new Date().toISOString(),
		})
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

export { getAllMessages, putMessage, deleteMessage, syncRemoteDatabase }
