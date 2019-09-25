import Authentication from '../authentication'
import style from './style'

export default () => (
	<nav id="primary-nav" class="section card is-mobile" role="navigation" aria-label="main navigation">
		<div class="columns is-mobile is-gapless">
			<div class="column">
				<div>💀 Goldbug Club</div>
			</div>
			<Authentication />
		</div>
	</nav>
)
