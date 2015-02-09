Use [Ractive](http://www.ractivejs.org/) with [abstract-state-router](https://github.com/TehShrike/abstract-state-router)!

## Usage

	var StateRouter = require('abstract-state-router')
	var ractiveRenderer = require('ractive-state-router')
	var domready = require('domready')

	var stateRouter = StateRouter(ractiveRenderer, 'body')

	// add whatever states to the state router

	domready(function() {
		stateRouter.evaluateCurrentRoute('login')
	})

