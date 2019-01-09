module.exports = function makeStateIsActiveDecorator(stateRouter) {
	return function activeDecorator(node, stateName, options, className = `active`) {
		function applyCurrentState() {
			if (stateRouter.stateIsActive(stateName, options)) {
				node.classList.add(className)
			} else {
				node.classList.remove(className)
			}
		}

		stateRouter.on(`stateChangeEnd`, applyCurrentState)

		function teardown() {
			stateRouter.removeListener(`stateChangeEnd`, applyCurrentState)
			node.classList.remove(className)
		}

		return {
			teardown,
		}
	}
}
