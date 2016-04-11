'use strict';

require('mocha');
require('through2');
var path = require('path');
var assert = require('assert');
var configSchema = require('..');
var Base = require('base');
var app;

var dir = path.resolve(__dirname, '..');

describe('.field.plugins', function() {
  beforeEach(function() {
    app = new Base();
  });

  describe('plugins', function() {
    it('should throw when a module does not exist', function(cb) {
      var schema = configSchema(app);

      try {
        schema.normalize({plugins: ['foo-bar-baz']});
        return cb(new Error('expected an error'));
      } catch (err) {
        assert.equal(err.message, 'package.json "base" config property "plugins" > Cannot find module \'foo-bar-baz\' from \'' + dir + '\'');
        cb();
      }
    });

    it('should throw when a local module does not exist', function(cb) {
      var schema = configSchema(app);

      try {
        schema.normalize({plugins: ['./foo']});
        return cb(new Error('expected an error'));
      } catch (err) {
        assert.equal(err.message, 'package.json "base" config property "plugins" > Cannot find module \'' + path.resolve('foo') + '\'');
        cb();
      }
    });

    it('should omit an empty object', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        plugins: {}
      });
      assert.deepEqual(config, {});
    });

    it('should normalize an object of plugin functions', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        plugins: {
          lower: function() {},
          upper: function() {}
        }
      });
      assert.equal(typeof config.plugins.lower.fn, 'function');
      assert.equal(typeof config.plugins.upper.fn, 'function');
    });

    it('should normalize an object of plugin objects', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        plugins: {
          'gulp-format-md': {}
        }
      });
      assert.equal(typeof config.plugins.formatMd.fn, 'function');
    });

    it('should normalize options on plugin objects', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        plugins: {
          'gulp-format-md': {foo: 'bar'}
        }
      });
      assert.equal(typeof config.plugins.formatMd.fn, 'function');
      assert.equal(config.plugins.formatMd.options.foo, 'bar');
    });

    it('should normalize when the key is a path to the cwd', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        plugins: {
          './': {foo: 'bar'}
        }
      });
      assert.equal(typeof config.plugins.configSchema.fn, 'function');
      assert.equal(config.plugins.configSchema.options.foo, 'bar');
    });

    it('should register an object of plugins by filepaths', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        plugins: {
          lower: './test/fixtures/plugins/lower.js',
          upper: './test/fixtures/plugins/upper.js'
        }
      });
      assert.equal(typeof config.plugins.lower.fn, 'function');
      assert.equal(typeof config.plugins.upper.fn, 'function');
    });

    it('should register an object of plugins by a file path', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        plugins: './test/fixtures/plugins/obj.js'
      });
      assert.equal(typeof config.plugins.one.fn, 'function');
      assert.equal(typeof config.plugins.two.fn, 'function');
      assert.equal(typeof config.plugins.three.fn, 'function');
    });

    it('should register a plugin function by file path', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        plugins: './test/fixtures/plugins/lower.js'
      });
      assert.equal(typeof config.plugins.lower.fn, 'function');
    });

    it('should register an array of plugins by filepaths', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        plugins: ['./test/fixtures/plugins/lower.js', './test/fixtures/plugins/upper.js']
      });
      assert.equal(typeof config.plugins.lower.fn, 'function');
      assert.equal(typeof config.plugins.upper.fn, 'function');
    });

    it('should register an array of plugin objects by filepaths', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        plugins: ['./test/fixtures/plugins/obj.js']
      });
      assert.equal(typeof config.plugins.one.fn, 'function');
      assert.equal(typeof config.plugins.two.fn, 'function');
      assert.equal(typeof config.plugins.three.fn, 'function');
    });

    it('should register an array of plugin modules', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        plugins: ['gulp-format-md']
      });

      assert.equal(typeof config.plugins.formatMd.fn, 'function');
    });

    it('should register a plugin stream by filepath', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        plugins: './test/fixtures/plugins/stream.js'
      });
      assert.equal(typeof config.plugins.stream, 'object');
    });

    it('should register a glob of plugins', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        plugins: [path.resolve(__dirname, 'fixtures/plugins/*.js')]
      });

      assert.equal(typeof config.plugins.lower.fn, 'function');
      assert.equal(typeof config.plugins.upper.fn, 'function');
    });
  });
});
