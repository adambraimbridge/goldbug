import React, { useState, useLayoutEffect } from 'react'
import { Chat } from '../../components/Chat'
import { getAutheticatedUser, AuthenticationPanel } from '../../components/Authentication'

const Home = () => {
	const [homepageElement, setHomepageElement] = useState(<AuthenticationPanel />)
	useLayoutEffect(() => {
		;(async () => {
			const authenticatedUser = await getAutheticatedUser()
			if (!!authenticatedUser) setHomepageElement(<Chat authenticatedUser={authenticatedUser} />)
		})()
	}, [])
	return homepageElement
}
export { Home }
