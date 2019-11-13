import PouchDB from 'pouchdb'
const CLOUDANT_USERNAME = '459013e0-ccee-4235-a047-55410e69aaea-bluemix'
const localDatabase = new PouchDB('goldbug-club')

//const foo = () => {
// try {
// 	const allDocs = await localDatabase.allDocs({
// 		include_docs: true,
// 		attachments: true,
// 	})
// 	return allDocs.rows.map(row => ({
// 		text: row.doc.text,
// 	}))
// } catch (err) {
// 	console.log(err)
// }
// }

const syncRemoteDatabase = async ({ localUser, messages, setMessages }) => {
	if (!localUser) return

	const { id } = localUser
	const { key, password } = localUser.app_metadata.credentials
	const remoteUrl = `https://${key}:${password}@${CLOUDANT_USERNAME}.cloudantnosqldb.appdomain.cloud/${id}`
	const remoteDatabase = new PouchDB(remoteUrl)

	// await localDatabase.replicate.from(remoteDatabase)

	await localDatabase
		.sync(remoteDatabase, {
			live: true,
			retry: true,
		})
		.on('change', change => {
			console.log({ change }, 'Sync: Refreshing.')
			const newMessages = [...messages, change.docs]
			console.log({ newMessages })
			setMessages(newMessages)
		})
		.on('paused', info => {
			console.log({ info }, 'Sync: Paused.')
		})
		.on('active', info => {
			console.log({ info }, 'Sync: Resumed.')
		})
		.on('error', error => {
			console.error(error)
		})
}

const putMessage = async message => {
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

export { syncRemoteDatabase }
