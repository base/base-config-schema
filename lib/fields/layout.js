'use strict';

var debug = require('../debug');
var utils = require('../utils');

module.exports = function(app) {
  return function(val, key, config, schema) {
    if (!val || utils.isEmpty(val)) return;
    debug.field(key, val);

    if (typeof val === 'string') {
      return val;
    }

    if (!utils.isObject(val)) {
      return;
    }

    config.sections = val.sections;
    config[key] = val.name;
    return config[key];
  };
};
