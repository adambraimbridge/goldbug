const PouchDB = require('pouchdb-browser')
import 'netlify-identity-widget'

const DB_HOST = 'https://658ec9bf-a8e5-40e2-8fae-4c14ca03b65b-bluemix.cloudantnosqldb.appdomain.cloud'
const ORGANIZATION_TITLE = 'The Ministry of Information'

const sleep = milliseconds => {
	if (!milliseconds) milliseconds = Math.floor(Math.random() * (2000 - 500)) + 500
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
		await sleep(content.length * 50)
		printMessage(id, content)
		toast()
	}
}

const initialise = async () => {
	const syncOptions = {
		live: true,
		retry: true,
		continuous: true,
	}
	const localDb = new PouchDB('bracken')
	const remoteDb = new PouchDB(DB_HOST)
	localDb.sync(remoteDb, syncOptions).on('change', info => {
		console.log(8888, 'change', info)
	})

	console.log({ remoteDb, localDb })
	//db.replicate.from(DB_REMOTE_URL) //, opts, syncError
	// const adventure = await db.find({ selector: { } })
	// console.log(adventure)
}

const onboard = async () => {
	const headerElement = document.getElementById('header-content')
	headerElement.innerHTML = `${ORGANIZATION_TITLE} | Initialising Secure Channel ...`
	await sleep()
	headerElement.innerHTML = `${ORGANIZATION_TITLE} | Secure Channel #SC-836.20.2`
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
	await sleep()
	toast('Authenticating | #CN-836.20.2 ...')
	await sleep()
	toast()
	document.getElementById('codename-ui').classList.remove('hidden')
}

export async function punchItChewey() {
	// Initialise
	await initialise()

	// If appropriate, do onboarding
	await onboard()
}
