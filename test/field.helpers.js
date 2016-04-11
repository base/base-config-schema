'use strict';

require('mocha');
var path = require('path');
var assert = require('assert');
var configSchema = require('..');
require('helper-coverage');
require('helper-example');
var Base = require('base');
var app;

var dir = path.resolve(__dirname, '..');

describe('.field.helpers', function() {
  beforeEach(function() {
    app = new Base();
  });

  describe('helpers', function() {
    it('should throw when a module does not exist', function(cb) {
      var schema = configSchema(app);

      try {
        schema.normalize({helpers: ['foo-bar-baz']});
        return cb(new Error('expected an error'));
      } catch (err) {
        assert.equal(err.message, 'package.json "base" config property "helpers" > Cannot find module \'foo-bar-baz\' from \'' + dir + '\'');
        cb();
      }
    });

    it('should omit an empty object', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        helpers: {}
      });
      assert.deepEqual(config, {});
    });

    it('should normalize an object of helper functions', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        helpers: {
          lower: function() {},
          upper: function() {}
        }
      });
      assert.equal(typeof config.helpers.lower.fn, 'function');
      assert.equal(typeof config.helpers.upper.fn, 'function');
    });

    it('should lowercase single letter helper names', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        helpers: {
          A: function() {},
          B: function() {}
        }
      });
      assert.equal(typeof config.helpers.a.fn, 'function');
      assert.equal(typeof config.helpers.b.fn, 'function');
    });

    it('should normalize an object of helper objects', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        helpers: {
          'helper-coverage': {},
          'helper-example': {}
        }
      });
      assert.equal(typeof config.helpers.coverage.fn, 'function');
      assert.equal(typeof config.helpers.example.fn, 'function');
    });

    it('should normalize options on helper objects', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        helpers: {
          'helper-coverage': {foo: 'bar'},
          'helper-example': {baz: 'qux'}
        }
      });
      assert.equal(typeof config.helpers.coverage.fn, 'function');
      assert.equal(typeof config.helpers.example.fn, 'function');
    });

    it('should register an object of helpers by filepaths', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        helpers: {
          lower: './test/fixtures/helpers/lower.js',
          upper: './test/fixtures/helpers/upper.js'
        }
      });
      assert.equal(typeof config.helpers.lower.fn, 'function');
      assert.equal(typeof config.helpers.upper.fn, 'function');
    });

    it('should register an object of helpers by a file path', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        helpers: './test/fixtures/helpers/obj.js'
      });
      assert.equal(typeof config.helpers.one.fn, 'function');
      assert.equal(typeof config.helpers.two.fn, 'function');
      assert.equal(typeof config.helpers.three.fn, 'function');
    });

    it('should register a helper function by file path', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        helpers: './test/fixtures/helpers/lower.js'
      });
      assert.equal(typeof config.helpers.lower.fn, 'function');
    });

    it('should register an array of helpers by filepaths', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        helpers: ['./test/fixtures/helpers/lower.js', './test/fixtures/helpers/upper.js']
      });
      assert.equal(typeof config.helpers.lower.fn, 'function');
      assert.equal(typeof config.helpers.upper.fn, 'function');
    });

    it('should register an array of helper objects by filepaths', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        helpers: ['./test/fixtures/helpers/obj.js']
      });
      assert.equal(typeof config.helpers.one.fn, 'function');
      assert.equal(typeof config.helpers.two.fn, 'function');
      assert.equal(typeof config.helpers.three.fn, 'function');
    });

    it('should register an array of helper modules', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        helpers: ['helper-coverage', 'helper-example']
      });

      assert.equal(typeof config.helpers.coverage.fn, 'function');
      assert.equal(typeof config.helpers.example.fn, 'function');
    });

    it('should register a glob of helpers', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        helpers: [path.resolve(__dirname, 'fixtures/helpers/*.js')]
      });

      assert.equal(typeof config.helpers.lower.fn, 'function');
      assert.equal(typeof config.helpers.upper.fn, 'function');
    });
  });
});
