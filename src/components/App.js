import React, { useState } from 'react'

import { Home } from '../routes/home'
import { AuthenticationButton } from './Authentication'

const App = () => {
	const [localUser, setLocalUser] = useState(false)
	return (
		<div id="layout" className="full-height py-0 px-3 m-0 mx-auto">
			<nav className="px-0 py-2 justify-content-between navbar navbar-expand navbar-dark">
				<div href="/" className="centered">
					<img alt="💀" src="/favicon.png" className="align-baseline mr-2 icon" />
					Goldbug Club
				</div>
				<AuthenticationButton localUser={localUser} setLocalUser={setLocalUser} />
			</nav>
			<Home path="/" localUser={localUser} />
		</div>
	)
}

export { App }

// import Workshop from '../routes/workshop'
// const handleRoute = e => {
// 	const currentUrl = e.url
// }
