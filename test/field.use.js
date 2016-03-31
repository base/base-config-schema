'use strict';

require('mocha');
require('through2');
var path = require('path');
var assert = require('assert');
var configSchema = require('..');
var plugins = require('base-plugins');
var Base = require('base');
var app;

describe('.field.use', function() {
  beforeEach(function() {
    app = new Base();
    app.use(plugins());
  });

  describe('use', function() {
    it('should omit an empty object', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        use: {}
      });
      assert.deepEqual(config, {});
    });

    it('should normalize an object of plugin functions', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        use: {
          aaa: function() {},
          bbb: function() {}
        }
      });
      assert.equal(typeof config.use.aaa.fn, 'function');
      assert.equal(typeof config.use.bbb.fn, 'function');
    });

    it('should normalize an object of plugin objects', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        use: {
          'base-plugins': {}
        }
      });
      assert.equal(typeof config.use.plugins.fn, 'function');
    });

    it('should normalize options on plugin objects', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        use: {
          'base-plugins': {foo: 'bar'}
        }
      });
      assert.equal(typeof config.use.plugins.fn, 'function');
      assert.equal(config.use.plugins.options.foo, 'bar');
    });

    it('should register an object of plugins by filepaths', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        use: {
          aaa: './test/fixtures/use/aaa.js',
          bbb: './test/fixtures/use/bbb.js'
        }
      });
      assert.equal(typeof config.use.aaa.fn, 'function');
      assert.equal(typeof config.use.bbb.fn, 'function');
    });

    it('should register an object of plugins by a file path', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        use: './test/fixtures/use/obj.js'
      });
      assert.equal(typeof config.use.one.fn, 'function');
      assert.equal(typeof config.use.two.fn, 'function');
      assert.equal(typeof config.use.three.fn, 'function');
    });

    it('should register a plugin function by file path', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        use: './test/fixtures/use/aaa.js'
      });
      assert.equal(typeof config.use.aaa.fn, 'function');
    });

    it('should register an array of plugins by filepaths', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        use: ['./test/fixtures/use/aaa.js', './test/fixtures/use/bbb.js']
      });
      assert.equal(typeof config.use.aaa.fn, 'function');
      assert.equal(typeof config.use.bbb.fn, 'function');
    });

    it('should register an array of plugin objects by filepaths', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        use: ['./test/fixtures/use/obj.js']
      });
      assert.equal(typeof config.use.one.fn, 'function');
      assert.equal(typeof config.use.two.fn, 'function');
      assert.equal(typeof config.use.three.fn, 'function');
    });

    it('should register an array of plugin modules', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        use: ['base-plugins']
      });

      assert.equal(typeof config.use.plugins.fn, 'function');
    });

    it('should throw when a module does not exist', function(cb) {
      var schema = configSchema(app);

      try {
        schema.normalize({use: ['foo-bar-baz']});
        return cb(new Error('expected an error'));
      } catch (err) {
        assert.equal(err.message, 'package.json "base" config property "use" > Cannot find module \'foo-bar-baz\'');
        cb();
      }
    });

    it('should register a glob of plugins', function() {
      var schema = configSchema(app);
      var config = schema.normalize({
        use: [path.resolve(__dirname, 'fixtures/use/*.js')]
      });

      assert.equal(typeof config.use.aaa.fn, 'function');
      assert.equal(typeof config.use.bbb.fn, 'function');
    });
  });
});
