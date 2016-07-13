# base-config-schema [![NPM version](https://img.shields.io/npm/v/base-config-schema.svg?style=flat)](https://www.npmjs.com/package/base-config-schema) [![NPM downloads](https://img.shields.io/npm/dm/base-config-schema.svg?style=flat)](https://npmjs.org/package/base-config-schema) [![Build Status](https://img.shields.io/travis/jonschlinkert/base-config-schema.svg?style=flat)](https://travis-ci.org/jonschlinkert/base-config-schema)

Schema for the base-config plugin, used for normalizing config values before passing them to config.process().

## Table of Contents

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save base-config-schema
```

## Usage

```js
var Base = require('base');
var config = require('base-config');
var configSchema = require('base-config-schema');

var app = new Base();
app.use(config());
var schema = configSchema(app);

var pkg = require('./package');
var obj = schema.normalize(pkg.verb);

app.config.process(obj, function(err) {
  if (err) throw err;
});
```

## API

### [.asyncHelpers](lib/fields/asyncHelpers.js#L21)

Register async template helpers. Can be an array of module names or filepaths, or an object where the keys are filepaths or module names, and the values are options objects.

**Example**

```js
{
  "asyncHelpers": ["helper-foo", "helper-bar"]
}
```

### [.disable](lib/fields/disable.js#L18)

Disable one or more options. This is the API-equivalent of calling `app.disable('foo')`, or `app.option('foo', false)`.

**Example**

```js
{disable: 'foo'}
// or
{disable: ['foo', 'bar']}
```

### [.enable](lib/fields/enable.js#L18)

Enable one or more options. This is the API-equivalent of calling `app.enable('foo')`, or `app.option('foo', false)`.

**Example**

```js
{enable: 'foo'}
// or
{enable: ['foo', 'bar']}
```

## About

### Related projects

* [base-cli](https://www.npmjs.com/package/base-cli): Plugin for base-methods that maps built-in methods to CLI args (also supports methods from a… [more](https://github.com/node-base/base-cli) | [homepage](https://github.com/node-base/base-cli "Plugin for base-methods that maps built-in methods to CLI args (also supports methods from a few plugins, like 'base-store', 'base-options' and 'base-data'.")
* [base-config](https://www.npmjs.com/package/base-config): base-methods plugin that adds a `config` method for mapping declarative configuration values to other 'base… [more](https://github.com/node-base/base-config) | [homepage](https://github.com/node-base/base-config "base-methods plugin that adds a `config` method for mapping declarative configuration values to other 'base' methods or custom functions.")
* [base-option](https://www.npmjs.com/package/base-option): Adds a few options methods to base, like `option`, `enable` and `disable`. See the readme… [more](https://github.com/node-base/base-option) | [homepage](https://github.com/node-base/base-option "Adds a few options methods to base, like `option`, `enable` and `disable`. See the readme for the full API.")

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

### Building docs

_(This document was generated by [verb-generate-readme][] (a [verb](https://github.com/verbose/verb) generator), please don't edit the readme directly. Any changes to the readme must be made in [.verb.md](.verb.md).)_

To generate the readme and API documentation with [verb](https://github.com/verbose/verb):

```sh
$ npm install -g verb verb-generate-readme && verb
```

### Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

### Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

### License

Copyright © 2016, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT license](https://github.com/jonschlinkert/base-config-schema/blob/master/LICENSE).

***

_This file was generated by [verb](https://github.com/verbose/verb), v0.9.0, on July 13, 2016._