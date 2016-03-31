'use strict';

require('mocha');
var assert = require('assert');
var configSchema = require('..');
var Base = require('base');
var app;

describe('.layout', function() {
  beforeEach(function() {
    app = new Base();
  });

  it('should not modify layout when it is a string', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({layout: 'default'});
    assert.deepEqual(obj, {layout: 'default'});
  });

  it('should create a sections object when defined on layout', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({layout: {sections: {foo: 'bar'}, name: 'default'}});

    assert.deepEqual(obj, {
      layout: 'default',
      sections: {
        foo: 'bar'
      }
    });
  });

  it('should throw an error when `layout.sections.name` is not defined', function(cb) {
    var schema = configSchema(app);
    try {
      schema.normalize({layout: {sections: {foo: 'bar'}}});
      cb(new Error('expected an error'));
    } catch (err) {
      assert.equal(err.message, 'expected `layout.name` to be a string');
      cb();
    }
  });
});
