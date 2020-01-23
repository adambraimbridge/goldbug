import PouchDB from 'pouchdb'

const CLOUDANT_USERNAME = '459013e0-ccee-4235-a047-55410e69aaea-bluemix'
const localDatabase = new PouchDB('goldbug-club')

const getLocalMessages = async () => {
	const allDocs = await localDatabase.allDocs({
		include_docs: true,
		attachments: true,
	})
	const messages = allDocs.rows
	return messages
}

const syncRemoteDatabase = ({ credentials, setMessages }) => {
	const { db_name, key, password } = credentials
	const remoteUrl = `https://${key}:${password}@${CLOUDANT_USERNAME}.cloudantnosqldb.appdomain.cloud/${db_name}`
	const remoteDatabase = new PouchDB(remoteUrl)

	// @see: https://pouchdb.com/api.html#sync
	localDatabase.replicate.from(remoteDatabase).on('complete', () => {
		localDatabase
			.sync(remoteDatabase, {
				live: true,
				retry: true,
			})
			.on('change', async () => {
				const messages = await getLocalMessages()
				setMessages(messages)
			})
	})
}

const addLocalMessage = message => {
	// const parsedText = emoji.replace_colons(message.value)
	localDatabase.put({
		...message,
		_id: new Date().toISOString(),
	})
}

const removeLocalMessage = index => {
	localDatabase.remove({
		_id: 'TODO:GET MESSAGE ID',
	})
}

export { syncRemoteDatabase, getLocalMessages, addLocalMessage, removeLocalMessage }
