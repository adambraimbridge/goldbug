import React, { useState, useEffect, useLayoutEffect } from 'react'
import axios from 'axios'
import { syncRemoteDatabase, getLocalMessages, addMessage, removeMessage } from '../lib/database'
import { Context } from './Context'

const Message = ({ value, user }) => {
	if (!value || !user) return false
	const { name, imageUrl } = user
	return (
		<div className="message-container mb-2">
			<div className="message bg-light rounded p-2 px-3">
				<span className="arrow"></span>
				{value}
				<div className="avatar-thumbnail">
					<img src={imageUrl} alt={name} className="icon rounded-circle border-0"></img>
				</div>
			</div>
		</div>
	)
}

const MessageForm = ({ addMessage, setMessages }) => {
	const [value, setValue] = useState('')
	const { state, setState } = React.useContext(Context)
	const { authenticatedUser } = state || {}

	useLayoutEffect(() => {
		;(async () => {
			let credentials = JSON.parse(localStorage.getItem('credentials')) || {}
			setState({ credentials: credentials })
			const { db_name, key, password } = credentials
			if (!db_name || !key || !password) {
				try {
					const response = await axios.post('/.netlify/functions/get-cloudant-database', authenticatedUser)
					credentials = response.data
					setState({ credentials: JSON.stringify(credentials) })
					localStorage.setItem('credentials', JSON.stringify(credentials))
				} catch (error) {
					console.log('Database connection error', error.toString())
				}
			}
			syncRemoteDatabase({ credentials, setMessages })
		})()
	}, [setMessages])

	const handleSubmit = async event => {
		event.stopPropagation()
		event.preventDefault()

		// `value` is set each time the input field changes.
		if (!value || !authenticatedUser) return false // Todo: Handle error better

		const message = { value, user: authenticatedUser }
		await addMessage({ message })
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
	const [messages, setMessages] = useState([])
	useLayoutEffect(() => {
		;(async () => {
			const messages = await getLocalMessages()
			setMessages(messages)
		})()
	}, [])

	useEffect(() => {
		const containerElement = document.querySelector('#message-list')
		containerElement.scrollTop = containerElement.scrollHeight + 1000
	})

	return (
		<>
			<div id="chat-container" className="mx-2 mb-3 text-white">
				<div id="message-list">
					{messages.map(message => {
						const { _id, value, user } = message.doc
						return <Message key={_id} index={_id} value={value} user={user} removeMessage={removeMessage} />
					})}
				</div>
			</div>
			<MessageForm addMessage={addMessage} setMessages={setMessages} />
		</>
	)
}

// <div id="chat-toast">{chatToast}</div>
// setChatToast('Initialising Secure Channel ...')
// setChatToast('Secure Channel Active. #SC-836.20.2')
