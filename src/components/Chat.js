import React, { useState, useEffect, useLayoutEffect } from 'react'
import { axios } from 'axios'
import { syncRemoteDatabase, getLocalMessages, addMessage, removeMessage } from '../lib/database'

const Message = ({ value, user }) => {
	if (!value || !user) return false
	const { full_name, avatar_url } = user
	return (
		<div className="message-container mb-2">
			<div className="message bg-light rounded p-2 px-3">
				<span className="arrow"></span>
				{value}
				<div className="avatar-thumbnail">
					<img src={avatar_url} alt={full_name} className="icon rounded-circle border-0"></img>
				</div>
			</div>
		</div>
	)
}

const MessageForm = ({ addMessage, setMessages }) => {
	const [value, setValue] = useState('')
	const { state } = React.useContext(Context)
	useLayoutEffect(() => {
		;(async () => {
			const { authenticatedUser } = state || {}
			if (!authenticatedUser.credentials) {
				try {
					const credentials = await axios.post('/.netlify/functions/get-cloudant-database', authenticatedUser)
					console.log({ credentials })
					syncRemoteDatabase({ authenticatedUser, setMessages })
				} catch (error) {
					console.error(error)
				}
			}
		})()
	}, [setMessages])

	const handleSubmit = async event => {
		event.preventDefault()
		if (!value) return false
		await addMessage({ value })
		setValue('')
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
