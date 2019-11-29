import React, { useState, useLayoutEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { AuthenticationUI, AuthenticationPanel } from './AuthenticationUI'
import { getAuthenticatedUser } from '../lib/authentication'
import { Chat } from './Chat'
import { Workshop } from './Workshop'

const Page = ({ authenticatedUser }) => {
	const [pageElement, setPageElement] = useState(<AuthenticationPanel />)

	// If the authenticated user changes, then change the UI accordingly.
	useLayoutEffect(() => {
		;(async () => {
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
			} else {
				setPageElement(<AuthenticationPanel />)
			}
		})()
	}, [authenticatedUser])

	return pageElement
}

export const App = () => {
	const [authenticatedUser, setAuthenticatedUser] = useState()
	// On page load, get the authenticated user and set the UI.
	useLayoutEffect(() => {
		;(async () => {
			setAuthenticatedUser(await getAuthenticatedUser())
		})()
	})
	return (
		<Router>
			<div id="layout" className="full-height">
				<nav className="px-0 py-2 justify-content-between navbar navbar-expand navbar-dark">
					<Link to="/" className="centered">
						<img alt="💀" src="/icons/favicon.png" className="align-baseline icon" />
						Goldbug Club
					</Link>
					<AuthenticationUI authenticatedUser={authenticatedUser} setAuthenticatedUser={setAuthenticatedUser} />
				</nav>
				<Page authenticatedUser={authenticatedUser} setAuthenticatedUser={setAuthenticatedUser} />
			</div>
		</Router>
	)
}
