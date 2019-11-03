import React from 'react'
import { Chat } from '../../components/Chat'
import { AuthenticationPanel } from '../../components/Authentication'

const Home = ({ localUser }) => {
	if (localUser && localUser.user_metadata) {
		return <Chat localUser={localUser} />
	} else {
		return <AuthenticationPanel />
	}
}

export { Home }
