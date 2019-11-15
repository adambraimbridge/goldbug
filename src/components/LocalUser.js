// import React, { createContext, useContext, useState, useLayoutEffect } from 'react'
// import { getAuthenticatedUser } from '../lib/authentication'

// const LocalUser = createContext(Promise.resolve(getAuthenticatedUser()))

// export const AuthenticationUI = () => {
// 	debugger
// 	const authenticatedUser = useContext(LocalUser)
// 	const [authenticationUI, setAuthenticationUI] = useState(<SignInUI />)
// 	useLayoutEffect(async () => {
// 		if (authenticatedUser) setAuthenticationUI(<SignOutUI authenticatedUser={authenticatedUser} />)
// 	}, [authenticatedUser])
// 	return authenticationUI
// }
