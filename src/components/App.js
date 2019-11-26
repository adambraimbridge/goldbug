import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { AuthenticationUI, AuthenticationPanel } from './AuthenticationUI'
import { getAuthenticatedUser } from '../lib/authentication'
import { Chat } from './Chat'
import { Workshop } from './Workshop'

const Page = () => {
	const [authenticatedUser, setAuthenticatedUser] = useState(false)
	const [pageElement, setPageElement] = useState(<AuthenticationPanel />)
	useEffect(() => {
		;(async () => {
			setAuthenticatedUser(await getAuthenticatedUser())
			if (authenticatedUser) {
				setPageElement(
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
			}
		})()
	}, [authenticatedUser])
	return pageElement
}

export const App = () => {
	return (
		<Router>
			<div id="layout" className="full-height">
				<nav className="px-0 py-2 justify-content-between navbar navbar-expand navbar-dark">
					<Link to="/" className="centered">
						<img alt="💀" src="/icons/favicon.png" className="align-baseline icon" />
						Goldbug Club
					</Link>
					<AuthenticationUI />
				</nav>
				<Page />
			</div>
		</Router>
	)
}
