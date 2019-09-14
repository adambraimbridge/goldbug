import { createElement } from 'preact'
import { Link } from 'preact-router/match'
import Authentication from '../authentication'
import style from './style'

export default () => (
	<nav class="section card is-mobile" role="navigation" aria-label="main navigation">
		<Authentication />
		<div>💀 goldbug.club</div>
	</nav>
)
