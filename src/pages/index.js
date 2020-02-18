import React from 'react'
import { ContextProvider } from '../components/Context'
import { App } from '../components/App'
import { unregister as unregisterServiceWorker } from '../serviceWorker'
import '../style/index.scss'
export default () => (
	<ContextProvider>
		<App />
	</ContextProvider>
)

// Service workers: https://bit.ly/CRA-PWA
unregisterServiceWorker()

// Todo: Fullscreen mode on mobile?
