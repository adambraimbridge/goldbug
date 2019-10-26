import React from 'react'
import Chat from '../../components/chat'
import SignInUI from '../../components/authentication/SignInUI'

const AuthenticationUI = () => {
	return (
		<div>
			<div className="my-1 alert alert-light text-secondary text-center">
				<div className="">
					<span role="img" aria-label="Padlock">
						🔏
					</span>
					Private channel
				</div>
				<div className="py-5">
					<SignInUI size="large" />
					<div className="pt-3">Authenticate with your Google account.</div>
				</div>
			</div>
		</div>
	)
}

export default ({ authenticated }) => {
	if (authenticated) {
		return <Chat />
	} else {
		return <AuthenticationUI />
	}
}
