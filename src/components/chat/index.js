import { useState } from 'preact/hooks'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'

export default () => {
	const [chatContent, setChatContent] = useState('')
	const [chatToast, setChatToast] = useState('')

	const ChatCard = ({ text }) => (
		<Card>
			<Card.Body>
				<Card.Text>{text}</Card.Text>
			</Card.Body>
		</Card>
	)
	const updateChatContent = event => {
		event.preventDefault()
		const formChatText = document.getElementById('formChatText')
		const text = formChatText.value
		setChatContent(<ChatCard text={text} />)
		formChatText.value = ''
		return false
	}

	// setChatToast('Initialising Secure Channel ...')
	// setChatToast('Secure Channel Active. #SC-836.20.2')

	return (
		<>
			{chatContent}
			<Container style="position: fixed; bottom: 0">
				<div id="chatToast">{chatToast}</div>
				<Form id="formChat" onSubmit={updateChatContent}>
					<Form.Group>
						<Form.Control id="formChatText" type="text" placeholder="Enter message" />
					</Form.Group>
				</Form>
			</Container>
		</>
	)
}
