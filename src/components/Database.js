import PouchDB from 'pouchdb'

const LocalDatabase = ({ localUser }) => {
	const cloudantUsername = '459013e0-ccee-4235-a047-55410e69aaea-bluemix'
	const { username, password } = localUser
	const remoteUrl = `https://${username}:${password}@${cloudantUsername}.cloudantnosqldb.appdomain.cloud/`
	const remoteDatabase = new PouchDB(remoteUrl)

	const localDatabase = new PouchDB('goldbug-club')
	localDatabase
		.changes({
			live: true,
			since: 'now',
		})
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

	return Promise.resolve(localDatabase)
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

const AllMessages = async (localUser, localDatabase) => {
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

export { LocalDatabase, AllMessages, putMessage, deleteMessage }
