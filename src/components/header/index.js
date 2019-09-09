import { h } from 'preact'
import { Link } from 'preact-router/match'
import style from './style'

const Header = () => (
	<nav class="section card is-mobile" role="navigation" aria-label="main navigation">
		<div class="is-pulled-right">
			<button class="button is-small">Sign out</button>
		</div>
		<div>💀 goldbug.club</div>
	</nav>
)

export default Header
