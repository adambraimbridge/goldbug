import { createElement, Component } from 'preact'
import style from './style'

export default class Home extends Component {
	sleep = milliseconds => {
		if (!milliseconds) milliseconds = Math.floor(Math.random() * (2000 - 500)) + 500
		return new Promise(resolve => setTimeout(resolve, milliseconds))
	}

	toast = html => {
		document.getElementById('toast').innerHTML = html || ''
	}

	printMessageCard = name => {
		// Todo: hyperons
		// <div class="box">
		//   <article class="media">
		//     <div class="media-left">
		//       <figure class="image is-64x64">
		//         <img src="https://bulma.io/images/placeholders/128x128.png" alt="Image">
		//     </figure>
		//   </div>
		//       <div class="media-content">
		//         <div class="content">
		//           <p>
		//             <strong>John Smith</strong> <small>@johnsmith</small> <small>31m</small>
		//             <br>
		//               Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean efficitur sit amet massa fringilla egestas. Nullam condimentum luctus turpis.
		//       </p>
		//     </div>
		//           <nav class="level is-mobile">
		//             <div class="level-left">
		//               <a class="level-item" aria-label="reply">
		//                 <span class="icon is-small">
		//                   <i class="fas fa-reply" aria-hidden="true"></i>
		//                 </span>
		//               </a>
		//               <a class="level-item" aria-label="retweet">
		//                 <span class="icon is-small">
		//                   <i class="fas fa-retweet" aria-hidden="true"></i>
		//                 </span>
		//               </a>
		//               <a class="level-item" aria-label="like">
		//                 <span class="icon is-small">
		//                   <i class="fas fa-heart" aria-hidden="true"></i>
		//                 </span>
		//               </a>
		//             </div>
		//           </nav>
		//         </div>
		// </article>
		//     </div>

		const html = `<div class="message-card">
		<div class="contact">${name}</div>
	</div>`
		document.getElementById('messages').innerHTML += html
		return id
	}

	printMessage = async (element, content) => {
		const html = `<div class="">${content}</div>`
		element.innerHTML += html
		await this.sleep()
	}

	sendDelayedMessages = async ({ name, messages }) => {
		// First set up the card with the contact name
		await this.sleep()
		this.toast(`${name} <span class="meta">is typing ... </span>`)
		await this.sleep()
		const id = this.printMessageCard(name)
		this.printMessage(id, messages.shift())
		this.toast()
		await this.sleep()

		// Second, send the messages
		for (let content of messages) {
			await this.sleep()
			this.toast(`${name} <span class="meta">is typing ... </span>`)
			await this.sleep(content.length * 50)
			this.printMessage(id, content)
			this.toast()
		}
	}

	onboard = async () => {
		const headerElement = document.getElementById('messages')
		await this.printMessage(headerElement, '🔓 Initialising Secure Channel ...')
		await this.printMessage(headerElement, '🔒 Secure Channel Active. #SC-836.20.2')
		const onboardingMessages = {
			name: '<span class="rank">Agent</span> <span class="name bold">Selaginel</span>',
			messages: [
				// prettier-ignore
				'Good morning.',
				'Protocol insists we confirm your identification.',
				"Tedious, yes. Shan't take long.",
				"Once you've indicated your codename we can proceed.",
			],
		}
		await this.sendDelayedMessages(onboardingMessages)
	}

	// gets called when this route is navigated to
	componentDidMount() {
		this.onboard()
	}

	render() {
		return (
			<div class="section content">
				<div id="messages" />
				<div id="chat-ui">
					<div id="toast" />
					<form>
						<input class="input" type="text" placeholder="Type a message" id="chat-ui-text" />
					</form>
				</div>
			</div>
		)
	}
}
