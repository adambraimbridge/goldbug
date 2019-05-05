/**
 * Clear node module cache when local files are modified.
 * @see https://codeburst.io/dont-use-nodemon-there-are-better-ways-fc016b50b45e
 */
;(() => {
	if (process.env.NODE_ENV === 'production') {
		return true
	}
	const chokidar = require('chokidar')
	const log = console.log.bind(console)
	chokidar
		.watch('src')
		.on('error', error => log(`Watcher error: ${error}`))
		.on('change', path => {
			Object.keys(require.cache).forEach(id => delete require.cache[id])
			log(`${path} changed. Cleared require.cache`)
		})
		.on('ready', () => log(`Watching ${process.cwd()}/src for changes`))
})()
