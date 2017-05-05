'use strict';

require('mocha');
var path = require('path');
var assert = require('assert');
var configSchema = require('..');
var Base = require('base');
var app;

describe('.views', function() {
  beforeEach(function() {
    app = new Base({isApp: true});
    app.options.renameKey = function(fp) {
      return path.basename(fp);
    };
  });

  it('should get templates on the root of the object from a glob', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({views: {templates: './test/fixtures/templates/*'}});
    assert(obj.views.templates.hasOwnProperty('foo.md'));
    assert(obj.views.templates.hasOwnProperty('bar.hbs'));
  });

  it('should get templates from an array of globs', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({views: {templates: ['./test/fixtures/templates/*']}});
    assert(obj.views.templates.hasOwnProperty('foo.md'));
    assert(obj.views.templates.hasOwnProperty('bar.hbs'));
  });

  it('should get globs of templates from an object', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({
      views: {
        posts: ['./test/fixtures/templates/*'],
        pages: ['./test/fixtures/templates/*']
      }
    });

    assert(obj.views.posts.hasOwnProperty('bar.hbs'));
  });

  it('should get template objects from an object', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({
      views: {
        posts: {
          home: {content: 'this is home'},
          other: {content: 'this is another post'}
        },
        pages: {
          home: {content: 'this is home'},
          other: {content: 'this is another page'}
        }
      }
    });

    assert(obj.views.pages.hasOwnProperty('home'));
    assert(obj.views.posts.hasOwnProperty('other'));
  });

  it('should throw an error when collection is not an own property', function(cb) {
    var schema = configSchema(app);
    try {
      schema.normalize({views: 42});
      cb(new Error('expected an error'));
    } catch (err) {
      assert.equal(err.message, 'expected collections to be an object, received: "number"');
      cb();
    }
  });

  it('should throw an error when collection is invalid', function(cb) {
    var schema = configSchema(app);
    try {
      schema.normalize({views: {posts: 42}});
      cb(new Error('expected an error'));
    } catch (err) {
      assert.equal(err.message, 'expected views to be an object, string or array, received: "number"');
      cb();
    }
  });
});
