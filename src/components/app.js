// import { Router } from 'preact-router'
import { useState } from 'preact/hooks'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Authentication from './authentication'
import Home from '../routes/home'
// import Workshop from '../routes/workshop'

// const handleRoute = e => {
// 	const currentUrl = e.url
// }

export default () => {
	const [authenticated, setAuthenticated] = useState(false)
	return (
		<Container>
			<Navbar variant="dark" className="justify-content-between">
				<Navbar.Brand href="/">
					<img
						alt="💀"
						src="/assets/favicon.png"
						width="20"
						height="20"
						className="align-text-top mr-1"
					/>
					Goldbug Club
				</Navbar.Brand>
				<Authentication setAuthenticated={setAuthenticated} />
			</Navbar>
			<Home path="/" authenticated={authenticated} />
		</Container>
	)
}
