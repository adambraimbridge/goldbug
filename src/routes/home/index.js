import React, { useState, useLayoutEffect } from 'react'
import { Chat } from '../../components/Chat'
import { LocalUser, AuthenticationPanel } from '../../components/LocalUser'

const Home = () => {
	const [homepageElement, setHomepageElement] = useState(<AuthenticationPanel />)
	useLayoutEffect(() => {
		;(async () => {
			// const authenticatedUser = await getLocalUser()
			// if (!!authenticatedUser) setHomepageElement(<Chat authenticatedUser={authenticatedUser} />)
		})()
	}, [])
	return homepageElement
}
export { Home }
