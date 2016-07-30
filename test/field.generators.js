'use strict';

require('mocha');
require('through2');
var path = require('path');
var assert = require('assert');
var configSchema = require('..');
var Base = require('base');
var app;

var dir = path.resolve(__dirname, '..');

describe('.field.generators', function() {
  beforeEach(function() {
    app = new Base({isApp: true});
  });

  describe('generators', function() {
    it('should throw when a module does not exist', function(cb) {
      var schema = configSchema(app, {strictRequire: true});

      try {
        schema.normalize({generators: ['foo-bar-baz']});
        return cb(new Error('expected an error'));
      } catch (err) {
        assert.equal(err.message, 'package.json "base" config property "generators" > Cannot find module \'foo-bar-baz\' from \'' + dir + '\'');
        cb();
      }
    });

    it('should throw when a local module does not exist', function(cb) {
      var schema = configSchema(app, {strictRequire: true});

      try {
        schema.normalize({generators: ['./foo']});
        return cb(new Error('expected an error'));
      } catch (err) {
        assert.equal(err.message, 'package.json "base" config property "generators" > Cannot find module \'' + path.resolve('foo') + '\'');
        cb();
      }
    });

    it('should omit an empty object', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        generators: {}
      });
      assert.deepEqual(config, {});
    });

    it('should normalize an object of plugin functions', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        generators: {
          alpha: function() {},
          omega: function() {}
        }
      });
      assert.equal(typeof config.generators.alpha.fn, 'function');
      assert.equal(typeof config.generators.omega.fn, 'function');
    });

    it('should normalize an object of plugin objects', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        generators: {
          'gulp-format-md': {}
        }
      });
      assert.equal(typeof config.generators.formatMd.fn, 'function');
    });

    it('should normalize options on plugin objects', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        generators: {
          'gulp-format-md': {foo: 'bar'}
        }
      });
      assert.equal(typeof config.generators.formatMd.fn, 'function');
      assert.equal(config.generators.formatMd.options.foo, 'bar');
    });

    it('should normalize when the key is a path to the cwd', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        generators: {
          './': {foo: 'bar'}
        }
      });
      assert.equal(typeof config.generators.configSchema.fn, 'function');
      assert.equal(config.generators.configSchema.options.foo, 'bar');
    });

    it('should register an object of generators by filepaths', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        generators: {
          alpha: './test/fixtures/generators/alpha.js',
          omega: './test/fixtures/generators/omega.js'
        }
      });
      assert.equal(typeof config.generators.alpha.fn, 'function');
      assert.equal(typeof config.generators.omega.fn, 'function');
    });

    it('should register a plugin function by file path', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        generators: './test/fixtures/generators/alpha.js'
      });
      assert.equal(typeof config.generators.alpha.fn, 'function');
    });

    it('should register an array of generators by filepaths', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        generators: ['./test/fixtures/generators/alpha.js', './test/fixtures/generators/omega.js']
      });
      assert.equal(typeof config.generators.alpha.fn, 'function');
      assert.equal(typeof config.generators.omega.fn, 'function');
    });

    it('should register an array of plugin modules', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        generators: ['gulp-format-md']
      });

      assert.equal(typeof config.generators.formatMd.fn, 'function');
    });

    it('should register a glob of generators', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        generators: [path.resolve(__dirname, 'fixtures/generators/*.js')]
      });

      assert.equal(typeof config.generators.alpha.fn, 'function');
      assert.equal(typeof config.generators.omega.fn, 'function');
    });
  });
});
