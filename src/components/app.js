import React, { useState } from 'react'
import Navbar from 'react-bootstrap/Navbar'

import Authentication from './authentication'
import Home from '../routes/home'
// import Workshop from '../routes/workshop'

export default () => {
	const [authenticated, setAuthenticated] = useState(false)
	return (
		<div className="px-1">
			<Navbar variant="dark" className="p-1 justify-content-between">
				<Navbar.Brand href="/">
					<img
						alt="💀"
						src="/favicon.png"
						className="align-text-top mr-1"
						style={{ width: '1rem' }}
					/>
					Goldbug Club
				</Navbar.Brand>
				<Authentication setAuthenticated={setAuthenticated} />
			</Navbar>
			<Home path="/" authenticated={authenticated} />
		</div>
	)
}

// const handleRoute = e => {
// 	const currentUrl = e.url
// }
