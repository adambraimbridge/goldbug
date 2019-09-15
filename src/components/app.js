import { Fragment } from 'preact'
import { Router } from 'preact-router'

import Header from './header'
import Home from '../routes/home'
import Workshop from '../routes/workshop'

const handleRoute = e => {
	const currentUrl = e.url
}

export default () => {
	return (
		<Fragment>
			<Header />
			<Router onChange={handleRoute}>
				<Home path="/" />
				<Workshop path="/workshop/" />
			</Router>
		</Fragment>
	)
}
