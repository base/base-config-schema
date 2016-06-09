'use strict';

require('mocha');
var assert = require('assert');
var configSchema = require('..');
var Base = require('base');
var app;

describe('.templates', function() {
  beforeEach(function() {
    app = new Base({isApp: true});
  });

  it('should get templates on the root of the object from a glob', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({templates: {templates: './test/fixtures/templates/*'}});
    assert(obj.templates.templates.hasOwnProperty('foo.md'));
    assert(obj.templates.templates.hasOwnProperty('bar.hbs'));
  });

  it('should get templates from an array of globs', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({templates: {templates: ['./test/fixtures/templates/*']}});
    assert(obj.templates.templates.hasOwnProperty('foo.md'));
    assert(obj.templates.templates.hasOwnProperty('bar.hbs'));
  });

  it('should get globs of templates from an object', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({
      templates: {
        posts: ['./test/fixtures/templates/*'],
        pages: ['./test/fixtures/templates/*']
      }
    });

    assert(obj.templates.pages.hasOwnProperty('foo.md'));
    assert(obj.templates.posts.hasOwnProperty('bar.hbs'));
  });

  it('should get template objects from an object', function() {
    var schema = configSchema(app);
    var obj = schema.normalize({
      templates: {
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

    assert(obj.templates.pages.hasOwnProperty('home'));
    assert(obj.templates.posts.hasOwnProperty('other'));
  });
});
