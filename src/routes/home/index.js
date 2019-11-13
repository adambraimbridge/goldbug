import React, { useState, useLayoutEffect } from 'react'
import { Chat } from '../../components/Chat'
import { getAutheticatedUser, AuthenticationPanel } from '../../components/Authentication'

const Home = () => {
	const [homepageElement, setHomepageElement] = useState(<AuthenticationPanel />)
	useLayoutEffect(() => {
		;(async () => {
			const authenticatedUser = await getAutheticatedUser()
			const { avatar_url, full_name } = authenticatedUser.user_metadata
			if (avatar_url && full_name) {
				setHomepageElement(<Chat authenticatedUser={authenticatedUser} />)
			}
		})()
	}, [])
	return homepageElement
}
export { Home }
