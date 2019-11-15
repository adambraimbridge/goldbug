import React, { useState, useEffect } from 'react'
import { AuthenticationPanel } from '../../components/AuthenticationUI'
import { getAuthenticatedUser } from '../../lib/authentication'
import { Chat } from '../../components/Chat'

export const Home = () => {
	const [homepageElement, setHomepageElement] = useState(<AuthenticationPanel />)
	useEffect(() => {
		;(async () => {
			const authenticatedUser = await getAuthenticatedUser()
			if (authenticatedUser) {
				console.log(authenticatedUser)
				setHomepageElement(<Chat authenticatedUser={authenticatedUser} />)
			}
		})()
	}, [])
	return homepageElement
}
