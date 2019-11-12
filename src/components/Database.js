import { useState } from 'react'
import PouchDB from 'pouchdb'
const localDatabase = new PouchDB('goldbug-club')

const LocalDatabase = ({ localUser, setLocalDatabase }) => {
	console.log({ localUser })
	// const { username, password } = localUser
	// const remoteUrl = `https://${username}:${password}@%CLOUDANT_USERNAME%.cloudantnosqldb.appdomain.cloud/`
	// const remoteDatabase = new PouchDB(remoteUrl)
	// localDatabase
	// 	.changes({
	// 		since: 'now',
	// 		live: true,
	// 	})
	// 	.sync(remoteDatabase, { live: true, retry: true })
	// 	.on('change', change => {
	// 		console.log({ change }, 'yo, something changed!')
	// 	})
	// 	.on('paused', info => {
	// 		console.log({ info }, 'replication was paused, probably because of a lost connection')
	// 	})
	// 	.on('active', info => {
	// 		console.log({ info }, 'replication was resumed')
	// 	})
	// 	.on('error', error => {
	// 		console.error(error)
	// 	})
	localDatabase.changes({
		since: 'now',
		live: true,
	})
	setLocalDatabase(localDatabase)
	return Promise.resolve()
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

const AllMessages = async localUser => {
	const [localDatabase, setLocalDatabase] = useState(false)
	if (!localDatabase) {
		await LocalDatabase({ localUser, setLocalDatabase })
	}
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

export { AllMessages, putMessage, deleteMessage }
