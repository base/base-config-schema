'use strict';

require('mocha');
var assert = require('assert');
var configSchema = require('..');
var Base = require('base');
var app;

describe('.views', function() {
  beforeEach(function() {
    app = new Base({isApp: true});
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

    assert(obj.views.pages.hasOwnProperty('foo.md'));
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
});
