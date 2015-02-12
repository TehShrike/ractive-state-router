Use [Ractive](http://www.ractivejs.org/) with [abstract-state-router](https://github.com/TehShrike/abstract-state-router)!

## Usage

```js
var StateRouter = require('abstract-state-router')
var ractiveRenderer = require('ractive-state-router')()
var domready = require('domready')

var stateRouter = StateRouter(ractiveRenderer, 'body')

// add whatever states to the state router

domready(function() {
	stateRouter.evaluateCurrentRoute('login')
})
```

## ractiveRenderer([options])

`options` is an optional object:

- [Ractive.defaults](http://docs.ractivejs.org/latest/ractive-defaults) is set to `options.defaults`.
- [Ractive.easing](http://docs.ractivejs.org/latest/ractive-easing) is set to `options.easing`.
- [Ractive.partials](http://docs.ractivejs.org/latest/ractive-partials-global) is set to `options.partials`.
