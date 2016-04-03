'use strict';

var utils = require('../utils');

module.exports = function(app, options) {
  return function(val, key, config, schema) {
    return utils.unique(utils.flatten(utils.arrayify(val)));
  };
};
