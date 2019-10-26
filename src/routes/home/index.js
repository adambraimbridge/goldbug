import React from 'react'
import Chat from '../../components/Chat'
import { AuthenticationPanel } from '../../components/Authentication'

export default ({ localUser }) => {
	if (localUser && localUser.user_metadata) {
		return <Chat />
	} else {
		return <AuthenticationPanel />
	}
}
