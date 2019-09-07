import { getUserWidget } from './components/user'
import { getChatWidget, sendDelayedMessages, onboard } from './components/chat'
;(async () => {
	const userWidgetHTML = await getUserWidget()
	const chatWidgetHTML = await getChatWidget()
	console.log({ chatWidgetHTML })
	document.getElementById('app').innerHTML = `
		${userWidgetHTML} 
		${chatWidgetHTML}
	`
	await onboard()
})()
