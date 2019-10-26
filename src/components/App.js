import React, { useState } from 'react'

import Authentication from './authentication'
import Home from '../routes/home'
// import Workshop from '../routes/workshop'

const App = () => {
	const [authenticated, setAuthenticated] = useState(false)
	return (
		<div id="layout" className="full-height">
			<nav className="p-0 justify-content-between navbar navbar-expand navbar-dark">
				<div href="/">
					<img
						alt="💀"
						src="/favicon.png"
						className="align-baseline mr-2"
						style={{ width: '1rem' }}
					/>
					Goldbug Club
				</div>
				<Authentication setAuthenticated={setAuthenticated} />
			</nav>
			<Home path="/" authenticated={authenticated} />
		</div>
	)
}

export default App

// const handleRoute = e => {
// 	const currentUrl = e.url
// }
