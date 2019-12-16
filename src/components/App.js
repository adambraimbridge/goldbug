import React from 'react'
import { Context } from './Context'
import { Switch, Route } from 'react-router-dom'
import { AuthenticationUI, AuthenticationPanel } from './AuthenticationUI'
import { Chat } from './Chat'
import { Workshop } from './Workshop'

const Page = () => {
	const { state } = React.useContext(Context)
	const { authenticatedUser } = state || {}

	if (authenticatedUser) {
		return (
			<Switch>
				<Route exact path="/">
					<div id="home">
						<Chat />
					</div>
				</Route>
				<Route path="/workshop/">
					<div id="workshop">
						<Workshop />
					</div>
				</Route>
			</Switch>
		)
	} else {
		return <AuthenticationPanel />
	}
}

export const App = () => {
	const { state } = React.useContext(Context)
	const { loading } = state || false
	const loadingClassName = `test spinner-border spinner-border-sm ${loading ? '' : 'd-none'}`
	return (
		<div id="layout" className="full-height max-with p-0 m-0 mx-auto">
			<nav className="px-0 py-2 justify-content-between navbar navbar-expand navbar-dark">
				<a href="/" className="centered">
					<img alt="💀" src="/icons/favicon.png" className="align-baseline icon" />
					Goldbug Club
					<noscript>Welcome to Goldbug Club. Thanks for visiting. Please enable JavaScript.</noscript>
				</a>
				<span id="loading" className={loadingClassName} role="status" aria-hidden={loading}></span>
				<AuthenticationUI />
			</nav>
			<Page />
		</div>
	)
}
