import Cloudant from '@cloudant/cloudant'
import PouchDB from 'pouchdb'
const localDatabase = new PouchDB('goldbug-club')

const getLocalDatabase = () => {
	localDatabase.changes({
		since: 'now',
		live: true,
	})
	return Promise.resolve(localDatabase)
}

const getRemoteDatabase = async credentials => {
	console.log('Connecting to remote database ...')
	const { username, password } = credentials
	const cloudant = await Cloudant({
		username,
		password,
		url: `https://${process.env.CLOUDANT_USERNAME}.cloudantnosqldb.appdomain.cloud/`,
	})
	const remoteDatabase = await cloudant.db.get(id)
	return remoteDatabase
}

const syncLocalDatabaseToRemote = ({ localUser, remoteDatabase, setRemoteDatabase }) => {
	if (!remoteDatabase) {
		try {
			const credentials = localUser.app_metadata.credentials
			setRemoteDatabase(getRemoteDatabase(credentials))
		} catch (error) {
			console.error(error)
		}
	}
	getLocalDatabase()
		.sync(remoteDatabase, { live: true, retry: true })
		.on('change', change => {
			console.log({ change }, 'yo, something changed!')
		})
		.on('paused', info => {
			console.log({ info }, 'replication was paused, probably because of a lost connection')
		})
		.on('active', info => {
			console.log({ info }, 'replication was resumed')
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

export { getLocalDatabase, syncLocalDatabaseToRemote, getAllMessages, putMessage, deleteMessage }
