'use strict';

require('mocha');
var assert = require('assert');
var configSchema = require('..');
var Base = require('base');
var app;

describe('.data', function() {
  beforeEach(function() {
    app = new Base();
  });

  it('should move booleans to `show` property', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({data: true});
    assert.deepEqual(obj, {data: {show: true}});
  });

  it('should not modify an object', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({data: {foo: 'bar'}});
    assert.deepEqual(obj, {data: {foo: 'bar'}});
  });

  it('should omit when not an object', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({data: 'nope'});
    assert.deepEqual(obj, {});
  });
});
