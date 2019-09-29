// import { useState } from 'preact/hooks'
// import { Router } from 'preact-router'

import Authentication from './authentication'
// import Home from '../routes/home'
// import Workshop from '../routes/workshop'

// const handleRoute = e => {
// 	const currentUrl = e.url
// }

// export default () => {
// 	const [visible, setVisible] = useState(false)

// 	return (
// 		<Fragment>
// 			Goldbug Club
// 			<Authentication />
// 			<Router onChange={handleRoute}>
// 				<Home path="/" />
// 				<Workshop path="/workshop/" />
// 			</Router>
// 		</Fragment>
// 	)
// }

export default () => {
	return <Authentication />
}
