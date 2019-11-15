import React from 'react'
import { AuthenticationUI } from './AuthenticationUI'
import { Home } from '../routes/home'

export const App = () => (
	<div id="layout" className="full-height py-0 px-3 m-0 mx-auto">
		<nav className="px-0 py-2 justify-content-between navbar navbar-expand navbar-dark">
			<div href="/" className="centered">
				<img alt="💀" src="/icons/favicon.png" className="align-baseline mr-2 icon" />
				Goldbug Club
			</div>
			<AuthenticationUI />
		</nav>
		<Home path="/" />
	</div>
)
