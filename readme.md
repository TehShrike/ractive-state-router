Use [Ractive](http://www.ractivejs.org/) with [abstract-state-router](https://github.com/TehShrike/abstract-state-router)!

## Usage

```js
var StateRouter = require('abstract-state-router')
var Ractive = require('ractive')
var ractiveRenderer = require('ractive-state-router')(Ractive)
var domready = require('domready')

var stateRouter = StateRouter(ractiveRenderer, 'body')

// add whatever states to the state router

domready(function() {
	stateRouter.evaluateCurrentRoute('login')
})
```

## ractiveRenderer(Ractive, [options])

`options` is an object that is passed into [Ractive.extend](http://docs.ractivejs.org/latest/ractive-extend) and takes [Ractive's options](http://docs.ractivejs.org/latest/options).

```js
var StateRouter = require('abstract-state-router')
var Ractive = require('ractive')
var RactiveRenderer = require('ractive-state-router')

var renderer = RactiveRenderer(Ractive, {
	data: { hello: 'world' }
})
var stateRouter = StateRouter(renderer, 'body')
```

## Passing templates to `addState`

When calling the abstract-state-router's addState function, you may provide any of these values as the `template`:

- a Ractive template string
- a parsed Ractive template object
- an object of [Ractive initialization options](http://docs.ractivejs.org/latest/options) to instantiate the Ractive object with.  Should contain a `template` property.
