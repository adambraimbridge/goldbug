import { render, Fragment } from 'preact'
import { Router } from 'preact-router'

import Header from './header'
import Home from '../routes/home'
import Profile from '../routes/profile'

/** Gets fired when the route changes.
 *	@param {Object} event "change" event from [preact-router](http://git.io/preact-router)
 *	@param {string} event.url	The newly routed URL
 */
const handleRoute = e => {
	const currentUrl = e.url
}

export default () => {
	return (
		<Fragment>
			<Header />
			<Router onChange={handleRoute}>
				<Home path="/" />
				<Profile path="/profile/" user="me" />
				<Profile path="/profile/:user" />
			</Router>
		</Fragment>
	)
}
