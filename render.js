var Ractive = require('ractive')

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
		try {
			ractive.reset()
			cb()
		} catch (e) {
			cb(e)
		}
	},
	destroy: function destroy(ractive, cb) {
		try {
			ractive.teardown()
			cb()
		} catch (e) {
			cb(e)
		}
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
