'use strict';

var utils = require('../utils');

module.exports = function(app, options) {
  return function(val, key, config, schema) {
    if (typeof val === 'string') {
      return val.split(',');
    }

    if (!Array.isArray(val)) {
      return [];
    }

    return utils.unique(utils.flatten(val));
  };
};
