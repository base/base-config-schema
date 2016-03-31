'use strict';

module.exports = function(app, options) {
  return function(val, key, config, schema) {
    if (typeof val === 'boolean') {
      val = { render: val };
    }
    return val;
  };
};
