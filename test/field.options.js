'use strict';

require('mocha');
var assert = require('assert');
var configSchema = require('..');
var Base = require('base');
var app;

describe('.options', function() {
  beforeEach(function() {
    app = new Base({isApp: true});
  });

  it('should move booleans to `show` property', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({options: true});
    assert.deepEqual(obj, {options: {show: true}});
  });

  it('should not modify an object', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({options: {foo: 'bar'}});
    assert.deepEqual(obj, {options: {foo: 'bar'}});
  });

  it('should omit when not an object', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({options: 'nope'});
    assert.deepEqual(obj, {});
  });
});
