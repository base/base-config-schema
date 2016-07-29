'use strict';

var utils = require('../utils');

module.exports = function(app, options) {
  return function(obj, prop, config, schema) {
    if (!obj || utils.isEmpty(obj)) return null;
    if (!utils.isObject(obj)) {
      throw new TypeError(`expected package.json "${app._name}.middleware" to be an object`);
    }

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        var arr = obj[key];
        if (utils.isObject(arr)) {
          arr = [arr];
        }
        if (!Array.isArray(arr)) {
          throw new TypeError(`expected package.json "${app._name}.middleware.${key}" to be an object or array`);
        }

        obj[key] = arr.map(function(val) {
          if (typeof val === 'string') {
            val = { name: val };
            try {
              val.fn = require(val);
            } catch (err) {
              try {
                val.fn = require(path.resolve(val));
              } catch (err) {}
            }
          }

          if (typeof val === 'function') {
            val = { fn: val };
          }
          if (!utils.isObject(val)) {
            throw new TypeError('expected middleware options to be an object or a string (path or package name)');
          }

          var opts = {};
          if (utils.isObject(val.options)) {
            opts = val.options;
            delete val.options;
          }

          if (typeof val.fn !== 'function') {
            if (typeof val.name !== 'string') {
              var keys = Object.keys(val).filter(function(k) {
                return ['fn', 'method', 'name', 'options'].indexOf(k) === -1;
              });

              var temp = val[keys[0]];
              if (keys.length === 1) {
                if (typeof val.method === 'string') {
                  val.fn = temp[val.method];
                } else if (typeof temp === 'function') {
                  val.fn = temp;
                } else {
                  opts = utils.extend({}, opts, temp);
                }
                delete val[keys[0]];
                val.name = keys[0];
              }
            }
            if (typeof val.name === 'string' && typeof val.fn !== 'function') {
              val.fn = require(val.name);
            }
          }

          val.options = utils.extend({}, val.options, opts);
          return val;
        });
      }
    }
    return obj;
  };
};
