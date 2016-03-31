'use strict';

require('mocha');
var path = require('path');
var assert = require('assert');
var configSchema = require('..');
require('helper-coverage');
require('helper-example');
var Base = require('base');
var app;

describe('.field.asyncHelpers', function() {
  beforeEach(function() {
    app = new Base();
  });

  describe('asyncHelpers', function() {
    it('should throw when a module does not exist', function(cb) {
      var schema = configSchema(app);

      try {
        schema.normalize({asyncHelpers: ['foo-bar-baz']});
        return cb(new Error('expected an error'));
      } catch (err) {
        assert.equal(err.message, 'package.json "base" config property "asyncHelpers" > Cannot find module \'foo-bar-baz\'');
        cb();
      }
    });

    it('should omit an empty object', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        asyncHelpers: {}
      });
      assert.deepEqual(config, {});
    });

    it('should normalize an object of helper functions', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        asyncHelpers: {
          lower: function() {},
          upper: function() {}
        }
      });
      assert.equal(typeof config.asyncHelpers.lower.fn, 'function');
      assert.equal(typeof config.asyncHelpers.upper.fn, 'function');
    });

    it('should normalize an object of helper objects', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        asyncHelpers: {
          'helper-coverage': {},
          'helper-example': {}
        }
      });
      assert.equal(typeof config.asyncHelpers.coverage.fn, 'function');
      assert.equal(typeof config.asyncHelpers.example.fn, 'function');
    });

    it('should normalize options on helper objects', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        asyncHelpers: {
          'helper-coverage': {foo: 'bar'},
          'helper-example': {baz: 'qux'}
        }
      });
      assert.equal(typeof config.asyncHelpers.coverage.fn, 'function');
      assert.equal(typeof config.asyncHelpers.example.fn, 'function');
    });

    it('should register an object of asyncHelpers by filepaths', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        asyncHelpers: {
          lower: './test/fixtures/asyncHelpers/lower.js',
          upper: './test/fixtures/asyncHelpers/upper.js'
        }
      });
      assert.equal(typeof config.asyncHelpers.lower.fn, 'function');
      assert.equal(typeof config.asyncHelpers.upper.fn, 'function');
    });

    it('should register an object of asyncHelpers by a file path', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        asyncHelpers: './test/fixtures/asyncHelpers/obj.js'
      });
      assert.equal(typeof config.asyncHelpers.one.fn, 'function');
      assert.equal(typeof config.asyncHelpers.two.fn, 'function');
      assert.equal(typeof config.asyncHelpers.three.fn, 'function');
    });

    it('should register a helper function by file path', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        asyncHelpers: './test/fixtures/asyncHelpers/lower.js'
      });
      assert.equal(typeof config.asyncHelpers.lower.fn, 'function');
    });

    it('should register an array of asyncHelpers by filepaths', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        asyncHelpers: ['./test/fixtures/asyncHelpers/lower.js', './test/fixtures/asyncHelpers/upper.js']
      });
      assert.equal(typeof config.asyncHelpers.lower.fn, 'function');
      assert.equal(typeof config.asyncHelpers.upper.fn, 'function');
    });

    it('should register an array of helper objects by filepaths', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        asyncHelpers: ['./test/fixtures/asyncHelpers/obj.js']
      });
      assert.equal(typeof config.asyncHelpers.one.fn, 'function');
      assert.equal(typeof config.asyncHelpers.two.fn, 'function');
      assert.equal(typeof config.asyncHelpers.three.fn, 'function');
    });

    it('should register an array of helper modules', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        asyncHelpers: ['helper-coverage', 'helper-example']
      });

      assert.equal(typeof config.asyncHelpers.coverage.fn, 'function');
      assert.equal(typeof config.asyncHelpers.example.fn, 'function');
    });

    it('should register a glob of asyncHelpers', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        asyncHelpers: [path.resolve(__dirname, 'fixtures/asyncHelpers/*.js')]
      });

      assert.equal(typeof config.asyncHelpers.lower.fn, 'function');
      assert.equal(typeof config.asyncHelpers.upper.fn, 'function');
    });
  });
});
