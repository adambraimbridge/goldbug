import Card from 'react-bootstrap/Card'
import Chat from '../../components/chat'
import SignInUI from '../../components/authentication/SignInUI'

const AuthenticationUI = () => {
	return (
		<Card bg="light">
			<Card.Body>
				<Card.Title>Private communication portal</Card.Title>
				<Card.Text>Authenticate with your Google account for access.</Card.Text>
				<SignInUI />
			</Card.Body>
		</Card>
	)
}

export default ({ authenticated }) => {
	if (authenticated) {
		return Chat
	} else {
		return <AuthenticationUI />
	}
}
