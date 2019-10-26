import React, { useState } from 'react'
import { userInfo } from 'os'

export default ({ localUser }) => {
	const [chatContent, setChatContent] = useState([])
	const [chatToast, setChatToast] = useState('')

	const ChatCard = ({ text }) => (
		<div className="card">
			<div className="card-body">
				<div className="card-text">{text}</div>
			</div>
		</div>
	)
	const updateChatContent = event => {
		console.log({ chatContent })
		event.preventDefault()
		const formChatText = document.getElementById('form-chat-text')
		const text = formChatText.value
		chatContent.push({
			...userInfo,
			text,
		})
		setChatContent(chatContent)
		formChatText.value = ''
		return false
	}

	const updateUI = () => {
		// set timeout
		console.log(localUser, 'Typing ... ')
	}

	// setChatToast('Initialising Secure Channel ...')
	// setChatToast('Secure Channel Active. #SC-836.20.2')

	return (
		<>
			<div id="chat-content">{chatContent}</div>
			<div id="chat-toast">{chatToast}</div>
			<form className="form m-1" id="chat-form" onSubmit={updateChatContent}>
				<div className="form-group">
					<input
						className="form-control"
						id="form-chat-text"
						type="text"
						placeholder="Enter message"
						onKeyDown={updateUI}
					/>
				</div>
			</form>
		</>
	)
}
