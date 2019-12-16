import React from 'react'

const reducer = (state = {}, payload) => {
	console.log('reducer!', { state, payload })
	return { ...state, ...payload }
}

export const Context = React.createContext()

export const ContextProvider = ({ children }) => {
	const [state, setState] = React.useReducer(reducer)
	return <Context.Provider value={{ state, setState }}>{children}</Context.Provider>
}
