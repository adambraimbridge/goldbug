;(() => {
	const sleep = milliseconds => {
		if (!milliseconds) milliseconds = Math.floor(Math.random() * (3000 - 1000)) + 1000
		return new Promise(resolve => setTimeout(resolve, milliseconds))
	}

	const sendDelayedMessages = async onboardingMessages => {
		for (let { name, content } of onboardingMessages) {
			await sleep()
			console.log(`${name} is typing ... `)
			await sleep(content.length * 100)
			console.log(content)
		}
	}

	const initialise = async () => {
		const adventure = await database.get('adventure')
		console.dir(adventure)
		await sleep()
		document.getElementById('header-content').innerHTML = 'The Ministry | Secure Channel #SC-836.20.2'
	}

	const onboard = async () => {
		const onboardingMessages = [
			{
				name: 'Agent Selaginel',
				content: 'Good morning.',
			},
			{
				name: 'Agent Selaginel',
				content: 'As per usual protocol we must first confirm your identification.',
			},
			{
				name: 'Agent Selaginel',
				content: "Once you've indicated your codename we may proceed.",
			},
		]
		await sendDelayedMessages(onboardingMessages)
		await sleep(1000)
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
