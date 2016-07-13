'use strict';

require('mocha');
require('through2');
var path = require('path');
var assert = require('assert');
var configSchema = require('..');
var Base = require('base');
var app;

var dir = path.resolve(__dirname, '..');

describe('.field.middleware', function() {
  beforeEach(function() {
    app = new Base({isApp: true});
  });

  describe('middleware', function() {
    it('should throw when a module does not exist', function(cb) {
      var schema = configSchema(app, {strictRequire: true});

      try {
        schema.normalize({middleware: ['foo-bar-baz']});
        return cb(new Error('expected an error'));
      } catch (err) {
        assert.equal(err.message, 'expected package.json "base.middleware" to be an object');
        cb();
      }
    });

    it('should throw when a local module does not exist', function(cb) {
      var schema = configSchema(app, {strictRequire: true});
      try {
        schema.normalize({middleware: {onLoad: ['./foo']}});
        return cb(new Error('expected an error'));
      } catch (err) {
        assert.equal(err.message, 'Cannot find module \'./foo\'');
        cb();
      }
    });

    it('should omit an empty object', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        middleware: {}
      });
      assert.deepEqual(config, {});
    });

    it('should normalize an array of middleware objects', function() {
      var schema = configSchema(app);
      var fn = function() {};
      var config = schema.normalize({
        middleware: {
          onLoad: [{
            name: 'foo',
            fn: fn
          }]
        }
      });
      assert.deepEqual(config.middleware.onLoad[0], { name: 'foo', fn: fn, options: {} });
    });

    it('should normalize an object of middleware objects', function() {
      var schema = configSchema(app);
      var fn = require('verb-reflinks');
      var config = schema.normalize({
        middleware: {
          onLoad: {
            'verb-reflinks': {}
          }
        }
      });
      assert.deepEqual(config.middleware.onLoad[0], { name: 'verb-reflinks', fn: fn, options: {} });
    });

    it('should normalize options on middleware objects', function() {
      var schema = configSchema(app);
      var fn = require('verb-reflinks');
      var config = schema.normalize({
        middleware: {
          onLoad: {
            'verb-reflinks': {foo: 'bar'}
          }
        }
      });
      assert.deepEqual(config.middleware.onLoad[0], { name: 'verb-reflinks', fn: fn, options: {foo: 'bar'} });
    });
  });
});
