/*!
 * base-config-schema <https://github.com/jonschlinkert/base-config-schema>
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var debug = require('debug')('base:config:schema');
var expanders = require('./lib/expanders');
var utils = require('./lib/utils');

module.exports = function configSchema(app, options) {
  debug('initializing <%s>, called from <%s>', __filename, module.parent.id);

  var opts = utils.merge({sortArrays: false, omitEmpty: true}, options);
  var schema = new utils.Schema(opts);
  schema.app = app;

  // Configuration, settings and data
  schema
    .field('options', ['object', 'boolean'], {
      normalize: expanders.options(app, opts)
    })
    .field('data', ['object', 'boolean'], {
      normalize: expanders.data(app, opts)
    });

  // modules
  schema
    .field('helpers', ['array', 'object', 'string'], {
      normalize: expanders.helpers(app, opts)
    })
    .field('asyncHelpers', ['array', 'object', 'string'], {
      normalize: expanders.asyncHelpers(app, opts)
    })
    .field('engine', ['array', 'object', 'string'], {
      normalize: expanders.engines(app, opts)
    })
    .field('engines', ['array', 'object', 'string'], {
      normalize: expanders.engines(app, opts)
    })
    .field('plugins', ['array', 'object', 'string'], {
      normalize: expanders.plugins(app, opts)
    })
    .field('use', ['array', 'object', 'string'], {
      normalize: expanders.use(app, opts)
    });

  // misc
  schema
    .field('tasks', ['array', 'string'], {
      normalize: expanders.tasks(app, opts)
    })
    .field('related', ['array', 'object', 'string'], {
      normalize: expanders.related(app, opts)
    })
    .field('reflinks', ['array', 'object', 'string'], {
      normalize: expanders.reflinks(app, opts)
    })
    .field('toc', ['object', 'string'], {
      normalize: expanders.toc(app, opts)
    });

  // template related
  schema
    .field('create', 'object', {
      normalize: expanders.create(app, opts)
    })
    .field('layout', ['object', 'string', 'boolean', 'null'], {
      normalize: expanders.layout(app, opts)
    })
    .field('templates', ['array', 'object'], {
      normalize: expanders.views(app, opts)
    })
    .field('views', ['array', 'object'], {
      normalize: expanders.views(app, opts)
    });

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
