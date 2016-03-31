'use strict';

var debug = require('debug');
var field = debug('base:config:field');

module.exports.schema = debug('base:config:schema');
module.exports.field = function(key, val) {
  field(`expanding ${key}, ${val}`);
};
