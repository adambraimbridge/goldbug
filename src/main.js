import { getUserWidget } from './components/user'
import { getChatWidget, sendDelayedMessages, onboard } from './components/chat'
;(async appElement => {
	const userWidgetHTML = await getUserWidget()
	const chatWidgetHTML = await getChatWidget()
	appElement.innerHTML = `
		${userWidgetHTML} 
		${chatWidgetHTML}
	`
	await onboard()
})(document.getElementById('app'))
