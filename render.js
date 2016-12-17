const UPDATE_ROUTE_KEY = 'update_route'

function wrapWackyPromise(promise, cb) {
	promise.then((...args) => {
		cb(null, ...args)
	}, cb)
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
		const ExtendedRactive = Ractive.extend(ractiveOptions || {})
		const extendedData = ExtendedRactive.defaults.data
		const ractiveData = Ractive.defaults.data

		const globalData = {}
		globalData[UPDATE_ROUTE_KEY] = {}
		const globalRactive = new Ractive({
			data: globalData
		})

		stateRouter.on('stateChangeEnd', function() {
			globalRactive.update(UPDATE_ROUTE_KEY)
		})

		extendedData.makePath = ractiveData.makePath = function makePath() {
			globalRactive.get(UPDATE_ROUTE_KEY)
			return stateRouter.makePath.apply(null, arguments)
		}

		extendedData.active = ractiveData.active = function active(stateName, options, className = 'active') {
			globalRactive.get(UPDATE_ROUTE_KEY)
			return stateRouter.stateIsActive(stateName, options) ? className : ''
		}

		const activeDecorator = makeStateIsActiveDecorator(stateRouter)

		return {
			render: function render(context, cb) {
				const element = context.element
				const inputTemplate = context.template

				const defaultDecorators = {
					active: activeDecorator
				}

				function getData() {
					const copyOfContent = copyIfAppropriate(context.content)
					return isTemplate(inputTemplate) ? copyOfContent : Object.assign({}, inputTemplate.data, copyOfContent)
				}
				function getDecorators() {
					return isTemplate(inputTemplate) ? defaultDecorators : Object.assign(defaultDecorators, inputTemplate.decorators)
				}
				function getOptions() {
					const bareOptions = isTemplate(inputTemplate) ? { template: inputTemplate } : inputTemplate

					return Object.assign({}, bareOptions, {
						decorators: getDecorators(),
						data: getData(),
						el: element
					})
				}

				try {
					const ractive = new ExtendedRactive(getOptions())
					cb(null, ractive)
				} catch (e) {
					cb(e)
				}
			},
			reset: function reset(context, cb) {
				const ractive = context.domApi
				ractive.off()
				wrapWackyPromise(ractive.reset(copyIfAppropriate(context.content)), cb)
			},
			destroy: function destroy(ractive, cb) {
				wrapWackyPromise(ractive.teardown(), cb)
			},
			getChildElement: function getChildElement(ractive, cb) {
				try {
					const child = ractive.find('ui-view')
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
		const target = {}
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

function makeStateIsActiveDecorator(stateRouter) {
	return function activeDecorator(node, stateName, options, className = 'active') {
		function applyCurrentState() {
			if (stateRouter.stateIsActive(stateName, options)) {
				node.classList.add(className)
			} else {
				node.classList.remove(className)
			}
		}

		stateRouter.on('stateChangeEnd', applyCurrentState)

		function teardown() {
			stateRouter.removeListener('stateChangeEnd', applyCurrentState)
			node.classList.remove(className)
		}

		return {
			teardown
		}
	}
}

function isTemplate(inputTemplate) {
	return typeof inputTemplate === 'string' || isRactiveTemplateObject(inputTemplate)
}

function isRactiveTemplateObject(template) {
	// Based on https://github.com/ractivejs/ractive/blob/b1c9e1e5c22daac3210ee7db0f511065b31aac3c/src/Ractive/config/custom/template/template.js#L113-L116
	return template && typeof template.v === 'number'
}
