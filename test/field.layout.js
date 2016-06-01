'use strict';

require('mocha');
var assert = require('assert');
var configSchema = require('..');
var Base = require('base');
var app;

describe('.layout', function() {
  beforeEach(function() {
    app = new Base({isApp: true});
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
});
