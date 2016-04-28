'use strict';

require('mocha');
var assert = require('assert');
var Base = require('base');
var config = require('base-config');
var configSchema = require('..');
var app;

describe('base-config-schema', function() {
  beforeEach(function() {
    app = new Base();
    app.use(config());
  });

  it('should export a function', function() {
    assert.equal(typeof configSchema, 'function');
  });

  it('should add fields to the schema', function() {
    var schema = configSchema(app)
      .field('foo', 'string', {
        normalize: function() {
          return 'bar';
        }
      });
    assert(schema.fields.hasOwnProperty('foo'));
  });

  it('should normalize properties that do not exist', function() {
    var schema = configSchema(app)
      .field('foo', 'string', {
        normalize: function() {
          return 'bar';
        }
      });

    var obj = schema.normalize({});
    assert.deepEqual(obj, {foo: 'bar'});
  });

  it('should return the object if `isNormalized` is true', function() {
    var schema = configSchema(app);
    var obj = {toc: true, isNormalized: true};
    var a = schema.normalize(obj);
    var b = schema.normalize(a);
    var c = schema.normalize(b);
    assert.deepEqual(c, obj);
  });
});
