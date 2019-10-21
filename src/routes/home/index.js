import React from 'react'
import Card from 'react-bootstrap/Card'
import Chat from '../../components/chat'
import SignInUI from '../../components/authentication/SignInUI'

const AuthenticationUI = () => {
	return (
		<Card bg="light" className="m-1">
			<Card.Body>
				<Card.Title>🔏Private channel</Card.Title>
				<Card.Text>Authenticate with your Google account.</Card.Text>
				<SignInUI />
			</Card.Body>
		</Card>
	)
}

export default ({ authenticated }) => {
	if (authenticated) {
		return <Chat />
	} else {
		return <AuthenticationUI />
	}
}
