var stateRouter = require('./')('body')

stateRouter.addState({
	name: 'top1',
	route: '/top1',
	data: 'I am data',
	template: ['<p>tell me {{sweets}} nothings</p>',
		'<ui-view></ui-view>',
		'<p>{{data}}</p>'].join(''),
	resolve: function(data, parameters, cb) {
		setTimeout(function() {
			cb(null, {
				stuff: 'Here\'s that data you were looking for!'
			})
		}, 100)
	},
	querystringParameters: ['wat'],
	activate: function(ractive, data, parameters, content) {
		var words = ['sweet', 'nothingless', 'meaningful']

		function update() {
			var index = Math.round(Math.random() * 2)
			ractive.set('sweets', words[index])
		}

		setInterval(update, 2000)

		update()
		ractive.set('data', data)
	}
})

stateRouter.addState({
	name: 'top1.bottom1',
	route: '/bottom1',
	data: { something: 'This is a thing' },
	template: '<h1>CHILD HERE!</h1><p>Like Billy Mays but {{somethinger}}<p>',
	resolve: function(data, parameters, cb) {
		setTimeout(function() {
			cb(null, {
				childData: 'Whatever'
			})
		}, 50)
	},
	querystringParameters: [],
	activate: function(ractive, data, parameters, content) {
		var words = ['louder', 'prettier', 'headier']

		function update() {
			var index = Math.round(Math.random() * 5)
			ractive.set('somethinger', words[index])
		}

		setInterval(update, 5000)

		update()

	}
})

stateRouter.go('top1.bottom1', {
	wat: 'WHAAAAAT'
})
