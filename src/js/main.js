import { getUserWidget } from './user'
;(async () => {
	const userWidgetHTML = await getUserWidget()
	console.log({ userWidgetHTML })
	document.getElementById('app').innerHTML = userWidgetHTML
})()
