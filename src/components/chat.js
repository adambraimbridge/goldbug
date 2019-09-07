import { h, render } from 'hyperons'
const sleep = milliseconds => {
	if (!milliseconds) milliseconds = Math.floor(Math.random() * (2000 - 500)) + 500
	return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const toast = html => {
	document.getElementById('toast').innerHTML = html || ''
}

const printMessageCard = name => {
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

const printMessage = async (element, content) => {
	const html = `<div class="">${content}</div>`
	element.innerHTML += html
	await sleep()
}

export const sendDelayedMessages = async ({ name, messages }) => {
	// First set up the card with the contact name
	await sleep()
	toast(`${name} <span class="meta">is typing ... </span>`)
	await sleep()
	const id = printMessageCard(name)
	printMessage(id, messages.shift())
	toast()
	await sleep()

	// Second, send the messages
	for (let content of messages) {
		await sleep()
		toast(`${name} <span class="meta">is typing ... </span>`)
		await sleep(content.length * 50)
		printMessage(id, content)
		toast()
	}
}

export const onboard = async () => {
	const headerElement = document.getElementById('messages')
	await printMessage(headerElement, '🔓 Initialising Secure Channel ...')
	await printMessage(headerElement, '🔒 Secure Channel Active. #SC-836.20.2')
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
	await sendDelayedMessages(onboardingMessages)
}

export const getChatWidget = async () => {
	const ChatWidget = () => (
		<div class="chat-widget content is-small">
			<div id="messages" />
			<div id="chat-ui">
				<div id="toast" />
				<form>
					<input class="input" type="text" placeholder="Type a message" id="chat-ui-text" />
				</form>
			</div>
		</div>
	)
	return render(<ChatWidget />)
}
