'use strict';

var utils = require('../utils');
var debug = require('../debug');

module.exports = function(app) {
  return function(val, key, options, schema) {
    debug.field(key, val);

    if (utils.isEmpty(val)) {
      return;
    }

    var cache = {};
    var views = utils.loader();

    if (typeof val === 'string' || Array.isArray(val)) {
      cache = views(val);
    } else {
      var obj = val;

      for (var prop in obj) {
        cache[prop] = views(obj[prop]);
      }
    }

    return cache;
  };
};
