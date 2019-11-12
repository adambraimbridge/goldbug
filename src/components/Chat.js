import React, { useState, useEffect } from 'react'
import { AllMessages, putMessage } from './Database'

// import EmojiPicker from 'emoji-picker-react'
import EmojiJs from 'emoji-js'

const emojiJs = () => {
	const emojiJs = new EmojiJs()
	// emojiJs.img_set = 'emojione'
	// emojiJs.img_sets.emojione.path = 'https://cdn.jsdelivr.net/emojione/assets/3.0/png/32/'

	// emojiJs.supports_css = false
	// emojiJs.allow_native = false
	emojiJs.replace_mode = 'unified'

	return emojiJs
}

const Message = ({ message, userMeta }) => {
	const { full_name, avatar_url } = userMeta
	return (
		<div className="message-container mb-2">
			<div className="message bg-light rounded p-2 px-3">
				<span className="arrow"></span>

				{message.text}

				<div className="avatar-thumbnail">
					<img src={avatar_url} alt={full_name} className="icon rounded-circle border-0"></img>
				</div>
			</div>
		</div>
	)
}

const MessageForm = ({ addMessage }) => {
	const [inputValue, setInputValue] = useState('')
	const containerElement = document.querySelector('#message-list')

	const handleSubmit = async event => {
		event.preventDefault()
		if (!inputValue) return false

		await addMessage(inputValue)
		setInputValue('')
		containerElement.scrollTop = containerElement.scrollHeight + 1000
	}

	return (
		<form onSubmit={handleSubmit} id="chat-form">
			<div className="form-group mx-2">
				{/* <EmojiPicker preload /> */}
				<input type="text" className="form-control" value={inputValue} onChange={event => setInputValue(event.target.value)} placeholder="Enter message" />
			</div>
		</form>
	)
}

const Chat = ({ localUser }) => {
	const emoji = emojiJs()
	const userMeta = localUser.user_metadata || {}

	const [messages, setMessages] = useState([])

	useEffect(() => {
		;(async () => {
			try {
				const messageHistory = await AllMessages(localUser)
				setMessages(messageHistory)
			} catch (error) {
				console.error(error)
			}
		})()
	}, [])

	const addMessage = text => {
		const parsedText = emoji.replace_colons(text)
		setMessages([...messages, { text: parsedText }])
		putMessage({ text })
	}

	const removeMessage = index => {
		const newMessages = [...messages]
		newMessages.splice(index, 1)
		setMessages(newMessages)
	}

	return (
		<>
			<div id="chat-container" className="mx-2 mb-3 text-white">
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
