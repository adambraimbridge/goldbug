import { useState } from 'preact/hooks'
import { Header, Icon, Image, Menu, Segment, Sidebar } from 'semantic-ui-react'

const SidebarExampleSidebar = () => {
	const [visible, setVisible] = useState(true)

	return (
		<Sidebar.Pushable as={Segment}>
			<Sidebar as={Menu} animation="overlay" duration="100" icon="labeled" direction="right" inverted onHide={() => setVisible(false)} vertical visible={visible} width="very wide">
				<Menu.Item as="a">
					<Icon name="home" />
					Home
				</Menu.Item>
				<Menu.Item as="a">
					<Icon name="gamepad" />
					Games
				</Menu.Item>
				<Menu.Item as="a">
					<Icon name="camera" />
					Channels
				</Menu.Item>
			</Sidebar>

			<Sidebar.Pusher dimmed="true">
				<Segment basic>
					<Header as="h3">Application Content</Header>
					<Image src="/assets/icons/favicon-32x32.png" />
				</Segment>
			</Sidebar.Pusher>
		</Sidebar.Pushable>
	)
}

export default SidebarExampleSidebar
