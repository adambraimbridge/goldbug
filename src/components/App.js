import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import screenfull from 'screenfull'
import { Context } from './Context'
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import { AuthenticationUI, AuthenticationPanel } from './Authentication'
import { Chat } from './Chat'
import { Workshop } from './Workshop'

const Page = () => {
	const { state } = React.useContext(Context)
	const { authenticatedUser } = state || {}

	if (authenticatedUser) {
		return (
			<BrowserRouter>
				<Switch>
					<Route exact path="/">
						<div id="home" className="full-height">
							<Chat />
						</div>
					</Route>
					<Route path="/workshop/">
						<div id="workshop" className="full-height">
							<Workshop />
						</div>
					</Route>
				</Switch>
			</BrowserRouter>
		)
	} else {
		return <AuthenticationPanel />
	}
}

const FullscreenUI = () => {
	if (!screenfull.isEnabled) return false

	const [fullScreenIcon, setFullScreenIcon] = useState(screenfull.isFullscreen ? '↙️' : '↕️')
	const toggleFullScreen = async () => {
		await screenfull.toggle()
		setFullScreenIcon(fullScreenIcon === '↕️' ? '↙️' : '↕️')
	}
	return (
		<div className="btn btn-sm btn-secondary ml-1 px-3" onClick={() => toggleFullScreen()}>
			<div className="full-screen-ui">{fullScreenIcon}</div>
		</div>
	)
}

export const App = () => {
	const { state } = React.useContext(Context)
	const { loading } = state || false
	const loadingClassName = `test spinner-border spinner-border-sm ${loading ? '' : 'd-none'}`
	const description = '💀Goldbug Club. The real treasure was inside you the whole time.'
	return (
		<>
			<Head>
				<link rel="manifest" href="/manifest.json" />
				<meta key="author" name="author" content="Adam Braimbridge <adam@braimbridge.com>" />
				<meta key="description" name="description" content={description} />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="mobile-web-app-capable" content="yes" />
				<script src="https://apis.google.com/js/platform.js?onload=init" async defer></script>
			</Head>
			<div id="layout" className="full-height p-0 m-0 mx-auto">
				<nav className="p-2 justify-content-between navbar navbar-expand navbar-dark">
					<a href="/" className="centered btn btn-lg p-0 pt-1 mr-auto">
						<img alt="💀" src="/icons/favicon.png" className="icon" />
						Goldbug Club
					</a>
					<span id="loading" className={loadingClassName} role="status" aria-hidden={loading}></span>

					<AuthenticationUI />

					<FullscreenUI />
				</nav>
				<noscript>{description} Sorry, Goldbug needs JavaScript to work.</noscript>
				<Page />
			</div>
		</>
	)
}
