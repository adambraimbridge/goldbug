import React, { useState, useEffect } from 'react'
import { getAuthenticatedUser } from '../lib/authentication'

/**
 * Render a UI to let the user sign in.
 * @param {string} size Whether to show a small or large button
 */
const SignInUI = ({ size }) => {
	const oAuthUrl = 'https://www.goldbug.club/.netlify/identity/authorize?provider=google'
	const signIn = () => {
		// Redirect to OAuth endpoint. It'll redirect back after the user signs in.
		window.location = oAuthUrl
	}
	const classList = `btn ${size === 'large' ? 'btn-lg btn-primary' : 'btn-sm btn-light'}`
	return (
		<div className={classList} onClick={signIn}>
			Google Sign In
		</div>
	)
}

// TODO: purge local cache for user
const SignOutUI = ({ authenticatedUser }) => {
	const signOut = async () => {
		await authenticatedUser.logout()
	}
	const { full_name, avatar_url } = authenticatedUser.user_metadata
	return (
		<div className="btn btn-sm centered" onClick={signOut}>
			<div>Sign Out</div>
			<div className="avatar-thumbnail">
				<img src={avatar_url} alt={full_name} className="icon rounded-circle border border-primary"></img>
			</div>
		</div>
	)
}

export const AuthenticationUI = () => {
	const [authenticationUI, setAuthenticationUI] = useState(<SignInUI />)
	useEffect(() => {
		;(async () => {
			const authenticatedUser = await getAuthenticatedUser()
			if (authenticatedUser) {
				console.log(authenticatedUser)
				setAuthenticationUI(<SignOutUI authenticatedUser={authenticatedUser} />)
			}
		})()
	}, [])
	return authenticationUI
}

// const SearchResults = () => {
// 	const [data, setData] = useState({ hits: [] })
// 	const [query, setQuery] = useState('react')

// 	useEffect(() => {
// 		let ignore = false

// 		async function fetchData() {
// 			const result = await axios('https://hn.algolia.com/api/v1/search?query=' + query)
// 			if (!ignore) setData(result.data)
// 		}

// 		fetchData()
// 		return () => {
// 			ignore = true
// 		}
// 	}, [query])

// 	return (
// 		<>
// 			<input value={query} onChange={e => setQuery(e.target.value)} />
// 			<ul>
// 				{data.hits.map(item => (
// 					<li key={item.objectID}>
// 						<a href={item.url}>{item.title}</a>
// 					</li>
// 				))}
// 			</ul>
// 		</>
// 	)
// }
