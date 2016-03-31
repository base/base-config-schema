'use strict';

var normalize = require('../normalize');
var debug = require('../debug');
var utils = require('../utils');

module.exports = function(app, options) {
  return function(val, key, config, schema) {
    debug.field(key, val);
    if (utils.isEmpty(val)) return;
    return normalize(val, key, config, schema);
  };
};
