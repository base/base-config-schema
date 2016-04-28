/*!
 * base-config-schema <https://github.com/jonschlinkert/base-config-schema>
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var debug = require('debug')('base:config:schema');
var fields = require('./lib/fields');
var utils = require('./lib/utils');

module.exports = function configSchema(app, options) {
  debug('initializing <%s>, called from <%s>', __filename, module.parent.id);

  if (typeof app.pkg === 'undefined') {
    app.use(utils.pkg());
  }

  var opts = utils.merge({sortArrays: false, omitEmpty: true}, options);
  var schema = new utils.Schema(opts);
  schema.app = app;

  // Configuration, settings and data
  schema
    .field('options', ['object', 'boolean'], {
      normalize: fields.options(app, opts)
    })
    .field('data', ['object', 'boolean'], {
      normalize: fields.data(app, opts)
    });

  // modules
  schema
    .field('helpers', ['array', 'object', 'string'], {
      normalize: fields.helpers(app, opts)
    })
    .field('asyncHelpers', ['array', 'object', 'string'], {
      normalize: fields.asyncHelpers(app, opts)
    })
    .field('engine', ['array', 'object', 'string'], {
      normalize: fields.engines(app, opts)
    })
    .field('engines', ['array', 'object', 'string'], {
      normalize: fields.engines(app, opts)
    })
    .field('plugins', ['array', 'object', 'string'], {
      normalize: fields.plugins(app, opts)
    })
    .field('use', ['array', 'object', 'string'], {
      normalize: fields.use(app, opts)
    });

  // misc
  schema
    .field('tasks', ['array', 'string'], {
      normalize: fields.tasks(app, opts)
    })
    .field('related', ['array', 'object', 'string'], {
      normalize: fields.related(app, opts)
    })
    .field('reflinks', ['array', 'object', 'string'], {
      normalize: fields.reflinks(app, opts)
    })
    .field('toc', ['object', 'string'], {
      normalize: fields.toc(app, opts)
    });

  // template related
  schema
    .field('create', 'object', {
      normalize: fields.create(app, opts)
    })
    .field('layout', ['object', 'string', 'boolean', 'null'], {
      normalize: fields.layout(app, opts)
    })
    .field('templates', ['array', 'object'], {
      normalize: fields.views(app, opts)
    })
    .field('views', ['array', 'object'], {
      normalize: fields.views(app, opts)
    });

  var fieldFn = schema.normalizeField;
  schema.normalizeField = function(key) {
    var val = fieldFn.apply(schema, arguments);
    if (typeof val !== 'undefined') {
      debug('normalized', key, val);
    }
    return val;
  };

  var fn = schema.normalize;
  schema.normalize = function(config) {
    if (config.isNormalized) {
      return config;
    }

    var obj = fn.apply(this, arguments);
    utils.define(obj, 'isNormalized', true);
    return obj;
  };

  return schema;
};
