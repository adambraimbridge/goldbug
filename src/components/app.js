// import { useState } from 'preact/hooks'
// import { Router } from 'preact-router'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'
import Authentication from './authentication'
import Home from '../routes/home'
// import Workshop from '../routes/workshop'

// const handleRoute = e => {
// 	const currentUrl = e.url
// }

export default () => {
	return (
		<Container className="py-1">
			<Navbar bg="dark" variant="dark" className="justify-content-between">
				<Navbar.Brand href="#home">
					<img alt="" src="/assets/favicon.png" width="20" height="20" className="align-text-top mr-1" />
					Goldbug Club
				</Navbar.Brand>
				<Authentication />
			</Navbar>
			<Home path="/" />
		</Container>
	)
}
