'use strict';

var normalize = require('../normalize');
var debug = require('../debug');
var utils = require('../utils');

/**
 * Register async template helpers at the given filepath.
 *
 * ```sh
 * $ --asyncHelpers="./foo.js"
 * ```
 * @name asyncHelpers
 * @api public
 */

module.exports = function(app, options) {
  return function(val, key, config, schema) {
    if (!val) return null;
    debug.field(key, val);
    if (utils.isEmpty(val)) return;
    return normalize(val, key, config, schema);
  };
};
