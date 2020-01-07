import React from 'react'
import { ContextProvider } from '../components/Context'
import { App } from '../components/App'
import { unregister as unregisterServiceWorker } from '../serviceWorker'
import '../style/index.scss'
export default () => (
	<>
		<meta name="google-signin-scope" content="profile email" />
		<meta name="google-signin-client_id" content="YOUR_CLIENT_ID.apps.googleusercontent.com" />
		<script src="https://apis.google.com/js/platform.js" async defer></script>
		<ContextProvider>
			<App />
		</ContextProvider>
	</>
)

// Service workers: https://bit.ly/CRA-PWA
unregisterServiceWorker()
