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
	var stateRouter = null

	return {
		render: function render(context, cb) {
			var element = context.element
			var template = context.template
			try {
				var ractive = new ExtendedRactive({
					el: element,
					template: template,
					decorators: {
						active: activeStateDecarator.bind(null, stateRouter)
					},
					data: context.content
				})
				cb(null, ractive)
			} catch (e) {
				cb(e)
			}
		},
		reset: function reset(context, cb) {
			var ractive = context.domApi
			ractive.off()
			wrapWackyPromise(ractive.reset(context.content), cb)
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
		},
		handleStateRouter: function handleStateRouter(newStateRouter) {
			stateRouter = newStateRouter
		}
	}
}

function activeStateDecarator(stateRouter, element, stateName) {
	var parametersToMatch = parseParameters(arguments)
	function onStateChange(toState, toParams) {
		var currentName = toState.name
		var active = currentName.indexOf(stateName) === 0 && allParametersMatch(parametersToMatch, toParams)

		if (active) {
			element.classList.add('active')
		} else {
			element.classList.remove('active')
		}

	}

	stateRouter.on('stateChangeEnd', onStateChange)

	function teardown() {
		stateRouter.removeListener('stateChangeEnd', onStateChange)
	}

	return {
		teardown: teardown
	}
}

function parseParameters(args) {
	args = Array.prototype.slice.call(args, 2)
	return args.reduce(function(allParameters, parameterPair) {
		var keyAndValue = parameterPair.split(':')
		if (keyAndValue.length > 1) {
			allParameters[keyAndValue[0]] = keyAndValue[1]
		}
		return allParameters
	}, {})
}

function allParametersMatch(toMatch, parameters) {
	return Object.keys(toMatch).every(function(key) {
		return toMatch[key] == parameters[key]
	})
}
