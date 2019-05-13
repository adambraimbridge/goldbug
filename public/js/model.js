/**
 * Each goldbug.club treasure hunt is called an "Adventure".
 * Each adventure has a series of "Puzzles".
 * Each Puzzle has a number of messages, called "Clues"
 * Each clue has one or more valid "Answers".
 *
 * Each user is called a "Player".
 * Each player is given the puzzles one by one, which is called their "Progress"
 */
;(function() {
	'use strict'

	// PouchDB
	var db = null

	// Puzzle Schema
	var initPuzzleDoc = function(doc) {
		return {
			_id: 'puzzle:' + new Date().toISOString(),
			type: 'puzzle',
			version: 1,
			title: doc.title,
			checked: !!doc.checked,
			createdAt: new Date().toISOString(),
			updatedAt: '',
		}
	}

	var model = function(callback) {
		db = new PouchDB('brackenHouse')

		db.info(function(err, info) {
			if (err) {
				console.error(err)
			} else {
				console.log('model.info', info)
			}
		})

		db.createIndex(
			{
				index: { fields: ['type'] },
			},
			function(err, response) {
				if (typeof callback === 'function') {
					console.log('Model ready.')
					callback(err, model)
				}
			}
		)
	}

	model.puzzles = function(callback) {
		db.find(
			{
				selector: {
					type: 'puzzle',
				},
			},
			function(err, response) {
				if (typeof callback === 'function') {
					var docs = response ? response.docs || response : response
					callback(err, docs)
				}
			}
		)
	}

	model.save = function(d, callback) {
		var doc = null

		if (d.type === 'puzzle') {
			doc = initPuzzleDoc(d)
		}

		if (doc) {
			db.put(doc, function(err, response) {
				if (typeof callback === 'function') {
					callback(err, response)
				}
			})
		} else {
			if (typeof callback === 'function') {
				callback(new Error('Missing or unsupport doc type'), null)
			}
		}
	}

	window.addEventListener('DOMContentLoaded', function() {
		window.player(model)
	})
})()
