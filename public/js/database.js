/**
 * Data Model
 * 
 * goldbug.club has a number of players called "users".
 * Users submit "messages".

 * goldbug.club has a number of treasure hunts called "adventures".
 * Adventures have one or more non-player characters (NPCs) called "contacts".
 * Contacts have a series of "puzzles".
 * Puzzles have a number of "messages".
 * Puzzles also have a number of "clues".
 * Clues have one or more valid "answers".
 * Clues also have one or more generic "responses".
 * Responses are grouped into "correct" or "incorrect".
 */
;(() => {
	const pouchDB = new PouchDB('bracken')
	const database = {}
	database.get = type => {
		return pouchDB.find({ selector: { type } })
	}
	window.database = database
})()

// const model = () => ({
// 	getPuzzles: () => database.find({
// 		selector: {
// 			type: 'puzzle',
// 		},
// 	},

// 	)
// })

// model.puzzles = () => {
// 	database.find(
// 		(error, response) => {
// 			if (typeof callback === 'function') {
// 				var docs = response ? response.docs || response : null
// 				callback(error, docs)
// 			}
// 		}
// 	)
// }
