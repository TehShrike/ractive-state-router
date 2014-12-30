var StateRouter = require('abstract-state-router')
var ractiveRender = require('./render')

module.exports = function RactiveStateRouter(rootElement, router) {
	return StateRouter(ractiveRender, rootElement, router)
}
