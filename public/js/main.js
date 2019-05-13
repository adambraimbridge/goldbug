;(function() {
	'use strict'
	var model = null
	var sanitize = function(id) {
		return id.replace(/[:.]/gi, '-')
	}

	var addToPuzzle = function(docs) {
		for (var i = 0; i < docs.length; i++) {
			var doc = docs[i]

			var isPuzzle = doc.type === 'puzzle' || doc._id.indexOf('puzzle:') === 0
			var puzzles = null

			if (isPuzzle) {
				puzzles = document.getElementById('puzzle')
			} else {
				continue
			}

			doc._sanitizedid = sanitize(doc._id)

			var template = document.getElementById('puzzle-template').innerHTML
			template = template.replace(/\{\{(.+?)\}\}/g, function($0, $1) {
				var fields = $1.split('.')
				var value = doc
				while (fields.length) {
					if (value.hasOwnProperty(fields[0])) {
						value = value[fields.shift()]
					} else {
						value = null
						break
					}
				}
				return value || ''
			})

			var puzzlediv = document.createElement('div')
			puzzlediv.id = doc._sanitizedid
			puzzlediv.className = 'card collapsible'
			puzzlediv.innerHTML = template

			var existingdiv = document.getElementById(doc._sanitizedid)
			if (existingdiv) {
				puzzles.replaceChild(puzzlediv, existingdiv)
			} else {
				puzzles.insertBefore(puzzlediv, puzzles.firstChild)
			}
		}
	}

	var player = function(themodel) {
		if (themodel) {
			themodel(function(err, response) {
				if (err) {
					console.error(err)
				} else {
					model = response
					model.puzzles(function(err, docs) {
						if (err) {
							console.error(err)
						} else {
							addToPuzzle(docs, true)
						}
						console.log('Player is ready.')
					})
				}
			})
		}
		return this
	}

	player.openadd = function() {
		var form = document.getElementById('puzzle-add')
		form.reset()
		document.body.className += ' ' + form.id
	}

	player.closeadd = function() {
		document.body.className = document.body.className.replace('puzzle-add', '').trim()
	}

	player.add = function(event) {
		var form = event.target
		var elements = form.elements
		var doc = {}

		for (var i = 0; i < elements.length; i++) {
			if (elements[i].tagName.toLowerCase() !== 'button') {
				doc[elements[i].name] = elements[i].value
			}
		}

		model.save(doc, function(err, updated) {
			if (err) {
				console.error(err)
			} else {
				doc._id = doc._id || updated._id || updated.id
				addToPuzzle([doc])
				player.closeadd()
			}
		})
	}

	window.player = player

	
})()
