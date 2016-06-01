'use strict';

require('mocha');
var assert = require('assert');
var configSchema = require('..');
var Base = require('base');
var app;

describe('.toc', function() {
  beforeEach(function() {
    app = new Base({isApp: true});
  });

  it('should return an object', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({toc: {render: false}});
    assert.deepEqual(obj, {toc: {render: false}});
  });

  it('should convert a boolean to an object', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({toc: false});
    assert.deepEqual(obj, {toc: {render: false}});
  });
});
