import PouchDB from 'pouchdb'

const CLOUDANT_USERNAME = '459013e0-ccee-4235-a047-55410e69aaea-bluemix'
const localDatabase = new PouchDB('goldbug-club')

const refreshChat = async setMessages => {
	console.log('Database: Refreshing chat.')
	const allDocs = await localDatabase.allDocs({
		include_docs: true,
		attachments: true,
	})
	console.log({ allDocs })
	setMessages(allDocs.rows)
}

const syncRemoteDatabase = ({ authenticatedUser, setMessages }) => {
	console.log('`syncRemoteDatabase` called.')
	if (!authenticatedUser || !authenticatedUser.app_metadata) return

	const { id } = authenticatedUser
	const { key, password } = authenticatedUser.app_metadata.credentials
	const remoteUrl = `https://${key}:${password}@${CLOUDANT_USERNAME}.cloudantnosqldb.appdomain.cloud/${id}`
	const remoteDatabase = new PouchDB(remoteUrl)

	// @see: https://pouchdb.com/api.html#sync
	localDatabase.replicate.from(remoteDatabase).on('complete', () => {
		localDatabase
			.sync(remoteDatabase, {
				live: true,
				retry: true,
			})
			.on('change', () => refreshChat(setMessages))
	})
	refreshChat(setMessages)
}

const addMessage = async text => {
	// const parsedText = emoji.replace_colons(message.text)
	localDatabase.put({
		text,
		_id: new Date().toISOString(),
	})
}

const removeMessage = index => {
	localDatabase.remove({
		_id: 'TODO:GET MESSAGE ID',
	})
}

export { syncRemoteDatabase, addMessage, removeMessage }
