Use [Ractive](http://www.ractivejs.org/) with [abstract-state-router](https://github.com/TehShrike/abstract-state-router)!

## Install

npm + your favorite CommonJS bundler is easiest.

```sh
npm install ractive-state-router
```

You can also [download the stand-alone build from wzrd.in](https://wzrd.in/standalone/ractive-state-router@latest).  If you include it in a `<script>` tag, a `ractiveStateRouter` function will be available on the global scope.

## Usage

```js
var StateRouter = require('abstract-state-router')
var Ractive = require('ractive')
var makeRactiveStateRenderer = require('ractive-state-router')
var domready = require('domready')

var renderer = makeRactiveStateRenderer(Ractive)

var stateRouter = StateRouter(renderer, 'body')

// add whatever states to the state router

domready(function() {
	stateRouter.evaluateCurrentRoute('login')
})
```

## makeRactiveStateRenderer(Ractive, [ractiveOptions, [options]])

`ractiveOptions` is an object that is passed into [Ractive.extend](http://docs.ractivejs.org/latest/ractive-extend) and takes [Ractive's options](http://docs.ractivejs.org/latest/options).

`options` is an object with one optional property: `deepCopyDataOnSet` (defaults to `false`).  When `true`, the content from the resolve function will be deep copied before being set on the Ractive object, in order to try to maintain the immutability of whatever objects you pass in.

```js
var StateRouter = require('abstract-state-router')
var Ractive = require('ractive')
var RactiveRenderer = require('ractive-state-router')

var renderer = RactiveRenderer(Ractive, {
	data: { hello: 'world' }
})
var stateRouter = StateRouter(renderer, 'body')
```

## In templates

The `active` decorator adds the `active` class to an element if the given state is currently active.

The `makePath` function [from the abstract-state-router](https://github.com/TehShrike/abstract-state-router#stateroutermakepathstatename-stateparameters-options) is also exposed.

```html
<li decorator="active:app.some-state">
	<a href="{{ makePath('app.some-state') }}">Some state</a>
</li>
```

## Passing templates to `addState`

When calling the abstract-state-router's addState function, you may provide any of these values as the `template`:

- a Ractive template string
- a parsed Ractive template object
- an object of [Ractive initialization options](http://docs.ractivejs.org/latest/options) to instantiate the Ractive object with.  Should contain a `template` property.
