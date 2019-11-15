import React, { useState, useLayoutEffect, useEffect } from 'react'
import { AuthenticatedUser } from './Authentication'
import { initLocalDatabase, addMessage, removeMessage } from '../lib/database'

const Message = ({ text, userMeta }) => {
	const { full_name, avatar_url } = userMeta
	return (
		<div className="message-container mb-2">
			<div className="message bg-light rounded p-2 px-3">
				<span className="arrow"></span>
				{text}
				<div className="avatar-thumbnail">
					<img src={avatar_url} alt={full_name} className="icon rounded-circle border-0"></img>
				</div>
			</div>
		</div>
	)
}

const MessageForm = ({ addMessage }) => {
	const [inputValue, setInputValue] = useState('')

	const handleSubmit = async event => {
		event.preventDefault()
		if (!inputValue) return false

		await addMessage(inputValue)
		setInputValue('')
	}

	return (
		<form onSubmit={handleSubmit} id="chat-form">
			<div className="form-group mx-2">
				<input type="text" className="form-control" value={inputValue} onChange={event => setInputValue(event.target.value)} placeholder="Enter message" />
			</div>
		</form>
	)
}

const Chat = () => {
	const [messages, setMessages] = useState([])
	useLayoutEffect(() => {
		;(async () => {
			await initLocalDatabase({ setMessages })
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
						const { _id, text } = message.doc
						return <Message key={_id} index={_id} text={text} removeMessage={removeMessage} authenticatedUser={<AuthenticatedUser />} />
					})}
				</div>
			</div>
			<MessageForm addMessage={addMessage} />
		</>
	)
}

export { Chat }

// <div id="chat-toast">{chatToast}</div>
// setChatToast('Initialising Secure Channel ...')
// setChatToast('Secure Channel Active. #SC-836.20.2')
