import Trianglify from 'trianglify'
import { useState, useEffect } from 'preact/hooks'
import { Router } from 'preact-router'
import { Header, Image, Icon, Menu, Segment, Sidebar, Container, Button } from 'semantic-ui-react'

import Authentication from './authentication'
import Home from '../routes/home'
import Workshop from '../routes/workshop'

const handleRoute = e => {
	const currentUrl = e.url
}

const background = `background-image:url('${Trianglify({
	width: window.innerWidth,
	height: window.innerHeight,
	x_colors: ['#2e2e2e', '#2d2d2d', '#2c2c2c', '#2a2a2a', '#292929', '#282828', '#262626', '#252525', '#242424', '#232323', '#212121', '#202020', '#1f1f1f', '#1e1e1e', '#1c1c1c', '#1b1b1b', '#1a1a1a', '#191919', '#181818', '#161616', '#151515', '#141414', '#131313', '#121212', '#101010', '#0f0f0f', '#0e0e0e', '#0d0d0d', '#0c0c0c', '#0a0a0a', '#090909', '#080808', '#070707', '#060606', '#050505', '#030303', '#020202', '#010101', '#000000'],
}).png()}');`

export default () => {
	const [visible, setVisible] = useState(false)

	return (
		<Container style={background}>
			<Sidebar.Pushable as={Segment}>
				<Sidebar animation="uncover" icon="labeled" direction="right" onHide={() => setVisible(false)} vertical visible={visible} width="very wide">
					<Header>Profile</Header>
				</Sidebar>
				<Sidebar.Pusher>
					<Menu>
						<Menu.Item>
							<Image avatar spaced="right" src="/assets/icons/favicon-32x32.png" />
							Goldbug Club
						</Menu.Item>
						<Menu.Item position="right">
							<Button secondary icon onClick={() => setVisible(true)}>
								<Icon name="bars" />
							</Button>
						</Menu.Item>
					</Menu>
				</Sidebar.Pusher>
			</Sidebar.Pushable>
			<Authentication />
			<Router onChange={handleRoute}>
				<Home path="/" />
				<Workshop path="/workshop/" />
			</Router>
		</Container>
	)
}
