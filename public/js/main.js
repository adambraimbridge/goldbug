;(() => {
	const sleep = milliseconds => {
		if (!milliseconds) milliseconds = Math.floor(Math.random() * (3000 - 1000)) + 1000
		return new Promise(resolve => setTimeout(resolve, milliseconds))
	}

	const toast = html => {
		document.getElementById('toast').innerHTML = html || ''
	}

	const printMessageCard = name => {
		const id = 'foo'
		const html = `<div class="message-card" id="${id}">
			<div class="contact">${name}</div>
		</div>`
		document.getElementById('messages').innerHTML += html
		return id
	}

	const printMessage = (id, content) => {
		const html = `<div class="message-content">${content}</div>`
		document.getElementById(id).innerHTML += html
	}

	const sendDelayedMessages = async ({ name, messages }) => {
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
			await sleep(content.length * 100)
			printMessage(id, content)
			toast()
		}
	}

	const initialise = async () => {
		const organisationTitle = 'The Ministry of Information'
		const headerElement = document.getElementById('header-content')
		headerElement.innerHTML = `${organisationTitle} | Initialising Secure Channel ...`
		const adventure = await database.get('adventure')
		console.dir(adventure)
		await sleep()
		headerElement.innerHTML = `${organisationTitle} | Secure Channel #SC-836.20.2`
	}

	const onboard = async () => {
		const onboardingMessages = {
			name: '<span class="rank">Agent</span> <span class="name bold">Selaginel</span>',
			messages: [
				// prettier-ignore
				'Good morning.',
				'As per usual protocol we must first confirm your identification.',
				"Once you've indicated your codename we may proceed.",
			],
		}
		await sendDelayedMessages(onboardingMessages)
		await sleep()
		toast('Authenticating | #CN-836.20.2 ...')
		await sleep()
		toast()
		document.getElementById('codename-ui').classList.remove('hidden')
	}

	const run = async () => {
		// Initialise
		await initialise()

		// If appropriate, do onboarding
		await onboard()
	}

	window.addEventListener('DOMContentLoaded', run)
})()
