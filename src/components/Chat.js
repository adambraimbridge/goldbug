import React, { useState, useEffect, useLayoutEffect } from 'react'
import axios from 'axios'
import PouchDB from 'pouchdb'
import { Context } from './Context'
import '../style/chat.scss'

const CLOUDANT_USERNAME = '459013e0-ccee-4235-a047-55410e69aaea-bluemix'
const localDatabase = new PouchDB('goldbug-club')

const MessageForm = () => {
	const [value, setValue] = useState('')
	const { state, setState } = React.useContext(Context)
	const { authenticatedUser, messages } = state

	// Scroll the chat to the bottom
	useEffect(() => {
		const containerElement = document.querySelector('#message-list')
		if (containerElement) containerElement.scrollTop = containerElement.scrollHeight + 1000
	}, [messages])

	const addLocalMessage = message => {
		// const parsedText = emoji.replace_colons(message.value)
		message._id = new Date().toISOString()
		localDatabase.put(message)
		setState({ messages: [...messages, message] })
	}

	const handleSubmit = event => {
		event.stopPropagation()
		event.preventDefault()

		// `value` is set each time the input field changes.
		if (!value || !authenticatedUser) return false // Todo: Handle error better

		const { name, imageUrl } = authenticatedUser
		addLocalMessage({ value, name, imageUrl })
		setValue('')

		return false // Important: Don't actually submit the form
	}

	return (
		<form onSubmit={handleSubmit} id="chat-form">
			<div className="form-group">
				<input type="text" className="form-control" value={value} onKeyUp={event => event.stopPropagation()} onChange={event => setValue(event.target.value)} placeholder="Enter message" />
			</div>
		</form>
	)
}

export const Chat = () => {
	const { state, setState } = React.useContext(Context)
	const { authenticatedUser, messages } = state

	useLayoutEffect(() => {
		const refreshMessagesState = () => {
			const allDocs = await localDatabase.allDocs({
				include_docs: true,
				attachments: true,
			})
			console.log('local', { allDocs })

			const sanitisedMessages = allDocs.rows
				.map(row => {
					return row.doc
				})
				.filter(doc => {
					return doc && doc._id && doc.value && doc.name && doc.imageUrl
				})

			// Todo: Sort chronologically and de-dupe
			if (Array.isArray(messages)) {
				sanitisedMessages.push(...messages)
			} else {
				setState({ messages: sanitisedMessages })
			}
		}

		;(async () => {
			// Get database credentials
			let credentials = JSON.parse(localStorage.getItem('credentials')) || {}
			if (!credentials.db_name || !credentials.key || !credentials.password) {
				try {
					const response = await axios.post('/.netlify/functions/get-cloudant-database', authenticatedUser)
					credentials = response.data
					localStorage.setItem('credentials', JSON.stringify(credentials))
				} catch (error) {
					console.log('Database connection error', error.toString())
				}
			}

			// @see: https://pouchdb.com/api.html#sync
			const { db_name, key, password } = credentials
			if (db_name && key && password) {
				const remoteUrl = `https://${key}:${password}@${CLOUDANT_USERNAME}.cloudantnosqldb.appdomain.cloud/${db_name}`
				const remoteDatabase = new PouchDB(remoteUrl)

				// Replicate chat from remote database
				localDatabase.replicate
					.from(remoteDatabase)
					.on('complete', () => {
						localDatabase.sync(remoteDatabase, {
							live: true,
							retry: true,
						})
					})
					.on('change', refreshMessagesState())
			}
		})()
	}, [authenticatedUser])

	const removeLocalMessage = index => {
		localDatabase.remove({
			_id: 'TODO:GET MESSAGE ID',
		})
	}

	const Message = ({ message }) => {
		const { value, name, imageUrl } = message
		return (
			<div className="message-container mb-2 mr-5">
				<div className="message bg-light rounded p-2 px-3">
					<span className="arrow"></span>
					{value}
					<div className="avatar-thumbnail">
						<img src={imageUrl} alt={name} className="icon rounded-circle border border-secondary"></img>
					</div>
				</div>
			</div>
		)
	}

	return (
		<>
			<div id="chat-container" className="text-white">
				<div id="message-list" className="full-height">
					{messages &&
						messages.map(message => {
							const { _id } = message
							return <Message key={_id} index={_id} message={message} removeLocalMessage={removeLocalMessage} />
						})}
				</div>
			</div>
			<MessageForm />
		</>
	)
}

// <div id="chat-toast">{chatToast}</div>
// setChatToast('Initialising Secure Channel ...')
// setChatToast('Secure Channel Active. #SC-836.20.2')
