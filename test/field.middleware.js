'use strict';

require('mocha');
require('through2');
var assert = require('assert');
var configSchema = require('..');
var Base = require('base');
var app;

describe('.field.middleware', function() {
  beforeEach(function() {
    app = new Base({isApp: true});
  });

  describe('middleware', function() {
    it('should throw when a module does not exist', function() {
      var schema = configSchema(app, {strictRequire: true});

      assert.throws(function() {
        schema.normalize({middleware: ['foo-bar-baz']});
      }, /expected package\.json "base\.middleware" to be an object/);
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
      assert.deepEqual(config.middleware.onLoad[0], { name: 'foo', fn: fn});
    });

    it('should normalize a string', function() {
      var schema = configSchema(app);
      var fn = require('verb-reflinks');
      var config = schema.normalize({
        middleware: {
          onLoad: 'verb-reflinks'
        }
      });
      assert.deepEqual(config.middleware.onLoad[0], { name: 'verb-reflinks', fn: fn});
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
      assert.deepEqual(config.middleware.onLoad[0], { name: 'verb-reflinks', fn: fn});
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

    it('should normalize options on an array of middleware objects', function() {
      var schema = configSchema(app);
      var one = function(options) {
        return function(file, next) {
          next();
        };
      };
      var two = function(options) {
        return function(file, next) {
          next();
        };
      };

      var config = schema.normalize({
        middleware: {
          onLoad: [
            {
              options: {foo: 'bar'},
              one: one
            },
            {
              options: {baz: 'qux'},
              two: two
            }
          ]
        }
      });

      assert.deepEqual(config.middleware.onLoad[0], {
        name: 'one',
        options: {foo: 'bar'},
        fn: one
      });

      assert.deepEqual(config.middleware.onLoad[1], {
        name: 'two',
        options: {baz: 'qux'},
        fn: two
      });
    });

    it('should throw an error on unexpected keys', function(cb) {
      var schema = configSchema(app);
      var one = function(options) {
        return function(file, next) {
          next();
        };
      };
      var two = function(options) {
        return function(file, next) {
          next();
        };
      };

      try {
        schema.normalize({
          middleware: {
            onLoad: [
              {options: {foo: 'bar'}, blah: {}, one: one },
              {options: {baz: 'qux'}, blah: {}, two: two}
            ]
          }
        });
        cb(new Error('expected an error'));
      } catch (err) {
        assert.equal(err.message, 'unexpected keys defined on middleware config: "blah, one"');
        cb();
      }
    });

    it('should use the specified method', function() {
      var schema = configSchema(app);
      var one = {
        foo: function(options) {
          return function(file, next) {
            next();
          };
        },
        bar: function(options) {
          return function(file, next) {
            next();
          };
        }
      };
      var two = {
        foo: function(options) {
          return function(file, next) {
            next();
          };
        },
        bar: function(options) {
          return function(file, next) {
            next();
          };
        }
      };

      var config = schema.normalize({
        middleware: {
          onLoad: [
            {
              options: {foo: 'bar'},
              method: 'foo',
              one: one
            },
            {
              options: {baz: 'qux'},
              method: 'bar',
              two: two
            }
          ]
        }
      });

      assert.deepEqual(config.middleware.onLoad[0], {
        name: 'one',
        method: 'foo',
        options: {foo: 'bar'},
        fn: one.foo
      });

      assert.deepEqual(config.middleware.onLoad[1], {
        name: 'two',
        method: 'bar',
        options: {baz: 'qux'},
        fn: two.bar
      });
    });
  });
});
