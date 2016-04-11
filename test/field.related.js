'use strict';

require('mocha');
var assert = require('assert');
var configSchema = require('..');
var Base = require('base');
var app;

describe('.related', function() {
  beforeEach(function() {
    app = new Base();
  });

  it('should move a string value to `related.list`', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({related: 'default'});
    assert.deepEqual(obj, {related: { list: ['default']}});
  });

  it('should arrayify `related.list`', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({related: {list: 'default'}});
    assert.deepEqual(obj, {related: { list: ['default']}});
  });

  it('should move an array value to `related.list`', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({related: ['default']});
    assert.deepEqual(obj, {related: {list: ['default']}});
  });

  it('should not modify objects', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({related: {list: ['default']}});
    assert.deepEqual(obj, {related: {list: ['default']}});
  });

  it('should split comma-separated related', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({related: 'foo,bar,baz'});
    assert.deepEqual(obj, {related: {list: ['foo', 'bar', 'baz']}});
  });
});
