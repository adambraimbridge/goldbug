import React, { useState } from 'react'

const Message = ({ message, userMeta }) => {
	const { full_name, avatar_url } = userMeta
	return (
		<div className="message-container mb-2">
			<div></div>
			<div className="message text-right bg-light rounded p-2">{message.text}</div>
			<div className="message-avatar">
				<img src={avatar_url} alt={full_name} className="img-thumbnail rounded-circle border-0"></img>
			</div>
		</div>
	)
}

const MessageForm = ({ addMessage }) => {
	const [inputValue, setInputValue] = useState('')
	const containerElement = document.querySelector('#message-list')

	const handleSubmit = event => {
		event.preventDefault()
		if (!inputValue) return false
		addMessage(inputValue)
		setInputValue('')
		containerElement.scrollTop = containerElement.scrollHeight
	}

	return (
		<form onSubmit={handleSubmit} id="chat-form">
			<div className="form-group mx-2">
				<input type="text" className="form-control" value={inputValue} onChange={event => setInputValue(event.target.value)} placeholder="Enter message" />
			</div>
		</form>
	)
}

const Chat = ({ localUser }) => {
	const userMeta = localUser.user_metadata || {}
	const [messages, setMessages] = useState([])
	const addMessage = text => {
		setMessages([...messages, { text }])
	}

	const removeMessage = index => {
		const newMessages = [...messages]
		newMessages.splice(index, 1)
		setMessages(newMessages)
	}

	return (
		<>
			<div id="chat-container" className="mx-2 mb-3">
				<div id="message-list">
					{messages.map((message, index) => (
						<Message key={index} index={index} message={message} removeMessage={removeMessage} userMeta={userMeta} />
					))}
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
