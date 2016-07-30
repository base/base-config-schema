'use strict';

require('mocha');
var assert = require('assert');
var configSchema = require('..');
var Base = require('base');
var app;

describe('.reflinks', function() {
  beforeEach(function() {
    app = new Base({isApp: true});
  });

  it('should move a string value to `reflinks`', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({reflinks: 'default'});
    assert.deepEqual(obj, {reflinks: ['default']});
  });

  it('should arrayify `reflinks`', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({reflinks:'default'});
    assert.deepEqual(obj, {reflinks: ['default']});
  });

  it('should move an array value to `reflinks`', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({reflinks: ['default']});
    assert.deepEqual(obj, {reflinks:['default']});
  });

  it('should not modify objects', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({reflinks:['default']});
    assert.deepEqual(obj, {reflinks:['default']});
  });

  it('should split comma-separated reflinks', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({reflinks: 'foo,bar,baz'});
    assert.deepEqual(obj, {reflinks: ['foo', 'bar', 'baz'] });
  });
});
