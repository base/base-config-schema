'use strict';

var utils = require('../utils');

module.exports = function(app, options) {
  return function(val, key, config, schema) {
    if (typeof val === 'undefined') {
      return;
    }

    if (typeof val === 'string') {
      val = val.split(',');
    }

    if (Array.isArray(val)) {
      val = { list: val };
    }

    val.list = utils.unique(utils.flatten(val.list));
    return val;
  };
};
