var extend = require('xtend')

var UPDATE_ROUTE_KEY = 'update_route'

function wrapWackyPromise(promise, cb) {
	promise.then(function() {
		cb()
	}, function(err) {
		cb(err)
	})
}

module.exports = function RactiveStateRouter(Ractive, ractiveOptions, options) {
	function copyIfAppropriate(value) {
		if (options && options.deepCopyDataOnSet) {
			return copy(value)
		} else {
			return value
		}
	}
	return function makeRenderer(stateRouter) {
		var ExtendedRactive = Ractive.extend(ractiveOptions || {})
		var extendedData = ExtendedRactive.defaults.data
		var ractiveData = Ractive.defaults.data

		const globalData = {}
		globalData[UPDATE_ROUTE_KEY] = {}
		var globalRactive = new Ractive({
			data: globalData
		})

		stateRouter.on('stateChangeEnd', function() {
			globalRactive.update(UPDATE_ROUTE_KEY)
		})

		extendedData.makePath = ractiveData.makePath = function makePath() {
			globalRactive.get(UPDATE_ROUTE_KEY)
			return stateRouter.makePath.apply(null, arguments)
		}

		extendedData.active = ractiveData.active = function active(stateName) {
			globalRactive.get(UPDATE_ROUTE_KEY)
			return stateRouter.stateIsActive(stateName) ? 'active' : ''
		}

		return {
			render: function render(context, cb) {
				var element = context.element
				var inputTemplate = context.template

				var defaultDecorators = {
					active: activeStateDecarator.bind(null, stateRouter)
				}

				function getData() {
					var copyOfContent = copyIfAppropriate(context.content)
					return isTemplate(inputTemplate) ? copyOfContent : extend(inputTemplate.data, copyOfContent)
				}
				function getDecorators() {
					return isTemplate(inputTemplate) ? defaultDecorators : extend(defaultDecorators, inputTemplate.decorators)
				}
				function getOptions() {
					var bareOptions = isTemplate(inputTemplate) ? { template: inputTemplate } : inputTemplate

					return extend(bareOptions, {
						decorators: getDecorators(),
						data: getData(),
						el: element
					})
				}

				try {
					var ractive = new ExtendedRactive(getOptions())
					cb(null, ractive)
				} catch (e) {
					cb(e)
				}
			},
			reset: function reset(context, cb) {
				var ractive = context.domApi
				ractive.off()
				wrapWackyPromise(ractive.reset(copyIfAppropriate(context.content)), cb)
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
	}
}

function copy(value) {
	if (Array.isArray(value)) {
		return value.map(copy)
	} else if (object(value)) {
		var target = {}
		Object.keys(value).forEach(function(key) {
			target[key] = copy(value[key])
		})
		return target
	} else {
		return value
	}
}

function object(o) {
	return o && typeof o === 'object'
}

function activeStateDecarator(stateRouter, element, stateName) {
	var parametersToMatch = parseParameters(arguments)
	function onStateChange() {
		var active = stateRouter.stateIsActive(stateName, parametersToMatch)

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

function isTemplate(inputTemplate) {
	return typeof inputTemplate === 'string' || isRactiveTemplateObject(inputTemplate)
}

function isRactiveTemplateObject(template) {
	// Based on https://github.com/ractivejs/ractive/blob/b1c9e1e5c22daac3210ee7db0f511065b31aac3c/src/Ractive/config/custom/template/template.js#L113-L116
	return template && typeof template.v === 'number'
}
