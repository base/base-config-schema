'use strict';

require('mocha');
var assert = require('assert');
var configSchema = require('..');
var Base = require('base');
var app;

describe('.create', function() {
  beforeEach(function() {
    app = new Base();
    app.use(function() {
      this.create = function() {};
    });
  });

  it('should convert arrays to objects', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({create: ['foo', 'bar', 'baz']});
    assert.equal(obj.create.foo.cwd, process.cwd());
    assert.equal(obj.create.bar.cwd, process.cwd());
    assert.equal(obj.create.baz.cwd, process.cwd());
  });

  it('should convert a string to an object', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({create: 'foo'});
    assert.equal(obj.create.foo.cwd, process.cwd());
  });

  it('should return an object', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({create: {
      foo: {
        cwd: process.cwd()
      }
    }});
    assert.equal(obj.create.foo.cwd, process.cwd());
  });
});
