'use strict';

var debug = require('../debug');
var utils = require('../utils');

module.exports = function(app) {
  return function(val, key, config, schema) {
    debug.field(key, val);

    if (utils.isObject(val)) {
      if (!val.hasOwnProperty('name')) {
        throw new Error('expected `layout.name` to be a string');
      }
      // app.option('sections.placement', val.sections);
      // app.option('sections.layout', val.name);
      config.sections = val.sections;
      val = val.name;
    }
    return val;
  };
};
