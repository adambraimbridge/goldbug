/**
 * Authenticate against Google via Netlify.
 */
import GoTrue from 'gotrue-js'
const goTrueAuth = new GoTrue({
	APIUrl: 'https://www.goldbug.club/.netlify/identity',
	setCookie: true,
})

const getAuthenticationFromHash = () => {
	try {
		const authenticationData = document.location.hash.length
			? document.location.hash
					.replace(/^#/, '')
					.split('&')
					.reduce((result, pair) => {
						const keyValue = pair.split('=')
						result[keyValue[0]] = keyValue[1]
						return result
					}, {})
			: undefined
		if (authenticationData) {
			goTrueAuth
				.createUser(authenticationData, true)
				.then(authenticatedUser => authenticatedUser)
				.catch(console.error)
		}
	} catch (error) {
		console.error(error)
	}
}

/**
 * Local storage trumps URL hash. To sign out local user, the Sign Out UI must be used.
 */
const getAuthenticatedUser = () => {
	let currentUser = goTrueAuth.currentUser()
	if (!currentUser) {
		currentUser = getAuthenticationFromHash()
	}

	// Remove tokens from hash so that token does not remain in browser history.
	history.replaceState(null, null, '/')

	return currentUser
}

const UserComponent = () => {
	const handleAuthentication = () => {
		if (authenticatedUser) {
			// Todo: Wire this up to setState() to trigger a render of the component
			authenticatedUser
				.logout()
				.then(console.log('Signed out.'))
				.catch(console.error)
		} else {
			// Redirect to OAuth endpoint to sign in
			location = 'https://www.goldbug.club/.netlify/identity/authorize?provider=google'
		}
	}
	const UserMeta = () => {
		if (!authenticatedUser) return false

		const { avatar_url, full_name } = authenticatedUser.user_metadata
		return (
			<Fragment>
				<figure class="media-left image is-24x24">
					<img class="is-rounded" src={avatar_url} />
				</figure>
				<div class="media-content">{full_name}</div>
			</Fragment>
		)
	}

	const UserUI = () => {
		const buttonText = authenticatedUser ? 'Sign Out' : 'Sign In'
		return (
			<div class="media-right">
				<button class="button is-small" onClick={handleAuthentication}>
					{buttonText}
				</button>
			</div>
		)
	}

	const authenticatedUser = getAuthenticatedUser()
	return (
		<div class="media">
			<UserMeta />
			<UserUI />
		</div>
	)
}
// =============================================================
// const initialValue = {}

// const userComponent = () => {
//   const [user, setValue] = useState(initialValue);
//   const updateUser = useCallback(() => {
// 		alert(JSON.stringify(user))
// 		setValue({
// 			...user,
// 			testing: "yes"
// 		}), [user]
// 	});
//   return { user, updateUser };
// }

// function () {
//   const { user, updateUser } = userComponent();
//   return (
//     <div>
//       {user.name} {user.testing}
//       <button onClick={updateUser}>Update User</button>
//     </div>
//   );
// }

export default () => (
	<div class="is-pulled-right">
		<UserComponent />
	</div>
)
