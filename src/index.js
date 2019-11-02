import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './components/App'
import { getLocalDatabase } from './components/Database'
import * as serviceWorker from './serviceWorker'

import './style/index.scss'

getLocalDatabase().then(localDatabase => ReactDOM.render(<App localDatabase={localDatabase} />, document.getElementById('root')))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
