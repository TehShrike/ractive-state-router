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

`options` is an object that is passed into [Ractive.extend](http://docs.ractivejs.org/latest/ractive-extend) and takes [Ractive's options](http://docs.ractivejs.org/latest/options).

```js
var StateRouter = require('abstract-state-router')
var RactiveRenderer = require('ractive-state-router')

var renderer = RactiveRenderer({
	data: { hello: 'world' }
})
var stateRouter = StateRouter(renderer, 'body')
```
