'use strict';

require('mocha');
var assert = require('assert');
var configSchema = require('..');
var Base = require('base');
var app;

describe('.tasks', function() {
  beforeEach(function() {
    app = new Base({isApp: true});
  });

  it('should arrayify a string', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({tasks: 'default'});
    assert.deepEqual(obj, {tasks: ['default']});
  });

  it('should return an array', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({tasks: ['default']});
    assert.deepEqual(obj, {tasks: ['default']});
  });

  it('should split comma-separated tasks', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({tasks: 'foo,bar,baz'});
    assert.deepEqual(obj, {tasks: ['foo', 'bar', 'baz']});
  });
});
