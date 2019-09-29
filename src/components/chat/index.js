export default () => (
	<Transition duration={500} visible={false} id="chat">
		<Container text>
			<Segment>
				<Card>Initialising Secure Channel ...</Card>
				<Card>Secure Channel Active. #SC-836.20.2</Card>

				<form>
					<input class="input" type="text" placeholder="Type a message" id="chat-ui-text" />
				</form>
			</Segment>
		</Container>
	</Transition>
)
