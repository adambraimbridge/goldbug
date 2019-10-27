import React, { useState } from 'react'

import Home from '../routes/home'
import { AuthenticationButton } from './Authentication'

const App = () => {
	const [localUser, setLocalUser] = useState(false)
	return (
		<div id="layout" className="full-height p-0 m-0">
			<nav className="p-2 justify-content-between navbar navbar-expand navbar-dark">
				<div href="/">
					<img alt="💀" src="/favicon.png" className="align-baseline mr-2" style={{ width: '1rem' }} />
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
