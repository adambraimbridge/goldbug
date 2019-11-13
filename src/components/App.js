import React from 'react'

import { Home } from '../routes/home'
import { AuthenticationUI } from './Authentication'

const App = () => {
	return (
		<div id="layout" className="full-height py-0 px-3 m-0 mx-auto">
			<nav className="px-0 py-2 justify-content-between navbar navbar-expand navbar-dark">
				<div href="/" className="centered">
					<img alt="💀" src="/favicon.png" className="align-baseline mr-2 icon" />
					Goldbug Club
				</div>
				<AuthenticationUI />
			</nav>
			<Home path="/" />
		</div>
	)
}

export { App }

// import Workshop from '../routes/workshop'
// const handleRoute = e => {
// 	const currentUrl = e.url
// }

// useLayoutEffect(() => {
// 	;(async () => {
// 		const localUser = await getAuthenticatedUser()
// 		setLocalUser(localUser)
// 		console.log({ localUser })
// 	})()
// }, [])
