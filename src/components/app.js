import { Trianglify } from 'trianglify'
import { useState, useEffect } from 'preact/hooks'
import { Router } from 'preact-router'
import { Header, Image, Icon, Menu, Segment, Sidebar } from 'semantic-ui-react'

import Authentication from './authentication'
import Home from '../routes/home'
import Workshop from '../routes/workshop'

const handleRoute = e => {
	const currentUrl = e.url
}

export default () => {
	const [visible, setVisible] = useState(false)

	return (
		<Sidebar.Pushable as={Segment}>
			<Sidebar as={Menu} animation="uncover" icon="labeled" direction="right" onHide={() => setVisible(false)} vertical visible={visible} width="very wide">
				<h1>Here be sidebarr</h1>
			</Sidebar>

			<Sidebar.Pusher>
				<Segment basic>
					<Header as="h3">
						<Image src="/assets/icons/favicon-32x32.png" /> Goldbug Club
						<button onClick={() => setVisible(true)}>Menu</button>
					</Header>
					<Authentication />
					<Router onChange={handleRoute}>
						<Home path="/" />
						<Workshop path="/workshop/" />
					</Router>
				</Segment>
			</Sidebar.Pusher>
		</Sidebar.Pushable>
	)
}
