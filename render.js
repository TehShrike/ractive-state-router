var Ractive = require('ractive')

function wrapWackyPromise(promise, cb) {
	promise.then(function() {
		cb()
	}, function(err) {
		cb(err)
	})
}

module.exports = function RactiveStateRouter(options) {
	var ExtendedRactive = Ractive.extend(options || {})

	return {
		render: function render(element, template, cb) {
			try {
				var ractive = new ExtendedRactive({
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
		},
		setUpMakePathFunction: function setUpMakePathFunction(makePath) {
			ExtendedRactive.defaults.data.makePath = Ractive.defaults.data.makePath = makePath
		},
		setUpStateIsActiveFunction: function setUpStateIsActiveFunction(stateIsActive) {
			ExtendedRactive.defaults.data.active = Ractive.defaults.data.active = function(stateName) {
				return stateIsActive(stateName) ? 'active' : ''
			}
		}
	}
}
