'use strict';

require('mocha');
require('through2');
var path = require('path');
var assert = require('assert');
var configSchema = require('..');
var Base = require('base');
var app;

require('engine-handlebars');
require('engine-base');
var dir = path.resolve(__dirname, '..');

describe('.field.engine', function() {
  beforeEach(function() {
    app = new Base();
  });

  describe('engines', function() {
    it('should throw when a module does not exist', function(cb) {
      var schema = configSchema(app);

      try {
        schema.normalize({engine: ['foo-bar-baz']});
        return cb(new Error('expected an error'));
      } catch (err) {
        assert.equal(err.message, 'package.json "base" config property "engine" > Cannot find module \'foo-bar-baz\' from \'' + dir + '\'');
        cb();
      }
    });

    it('should omit an empty object', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        engine: {}
      });
      assert.deepEqual(config, {});
    });

    it('should normalize an object of engine functions', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        engine: {
          base: function() {},
          hbs: function() {}
        }
      });
      assert.equal(typeof config.engine.base.fn, 'function');
      assert.equal(typeof config.engine.hbs.fn, 'function');
    });

    it('should normalize an object of engine objects', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        engine: {
          '*': {
            render: function() {}
          }
        }
      });
      assert.equal(typeof config.engine['*'].render, 'function');
    });

    it('should normalize an object of engine modules', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        engine: {
          '*': 'engine-base'
        }
      });
      assert.equal(typeof config.engine['*'].fn, 'function');
    });

    it('should normalize options on engine objects', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        engine: {
          'gulp-format-md': {foo: 'bar'}
        }
      });
      assert.equal(typeof config.engine.formatMd.fn, 'function');
      assert.equal(config.engine.formatMd.options.foo, 'bar');
    });

    it('should register an object of engines by filepaths', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        engine: {
          md: './test/fixtures/engines/md.js',
          hbs: './test/fixtures/engines/hbs.js'
        }
      });
      assert.equal(typeof config.engine.md.fn, 'function');
      assert.equal(typeof config.engine.hbs.fn, 'function');
    });

    it('should register an object of engines by a file path', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        engine: './test/fixtures/engines/obj.js'
      });
      assert.equal(typeof config.engine.hbs.fn, 'function');
      assert.equal(typeof config.engine.md.fn, 'function');
    });

    it('should register a engine function by file path', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        engine: './test/fixtures/engines/md.js'
      });
      assert.equal(typeof config.engine.md.fn, 'function');
    });

    it('should register an array of engines by filepaths', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        engine: ['./test/fixtures/engines/md.js', './test/fixtures/engines/hbs.js']
      });
      assert.equal(typeof config.engine.md.fn, 'function');
      assert.equal(typeof config.engine.hbs.fn, 'function');
    });

    it('should register an array of engine objects by filepaths', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        engine: ['./test/fixtures/engines/obj.js']
      });
      assert.equal(typeof config.engine.md.fn, 'function');
      assert.equal(typeof config.engine.hbs.fn, 'function');
    });

    it('should register an array of engine modules', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        engine: ['engine-base', 'engine-handlebars']
      });
      assert.equal(typeof config.engine.handlebars.fn, 'function');
      assert.equal(typeof config.engine.base.fn, 'function');
    });

    it('should register a glob of engines', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        engine: [path.resolve(__dirname, 'fixtures/engines/*.js')]
      });

      assert.equal(typeof config.engine.md.fn, 'function');
      assert.equal(typeof config.engine.hbs.fn, 'function');
    });
  });
});
