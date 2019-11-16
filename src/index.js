import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './components/App'
import { unregister as unregisterServiceWorker } from './serviceWorker'
import './style/index.scss'

ReactDOM.render(<App />, document.getElementById('root'))

// Learn more about service workers: https://bit.ly/CRA-PWA
unregisterServiceWorker()
