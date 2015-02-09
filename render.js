var Ractive = require('ractive')

function wrapWackyPromise(promise, cb) {
	promise.then(function() {
		cb()
	}, function(err) {
		cb(err)
	})
}

module.exports = {
	render: function render(element, template, cb) {
		try {
			var ractive = new Ractive({
				el: element,
				template: template
			})
			cb(null, ractive)
		} catch (e) {
			cb(e)
		}
	},
	reset: function reset(ractive, cb) {
		wrapWackyPromise(ractive.reset(), cb)
	},
	destroy: function destroy(ractive, cb) {
		wrapWackyPromise(ractive.teardown(), cb)
	},
	getChildElement: function getChildElement(ractive, cb) {
		try {
			var child = ractive.find('ui-view')
			cb(null, child)
		} catch (e) {
			cb(e)
		}
	}
}
