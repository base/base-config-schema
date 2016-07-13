'use strict';

var utils = require('../utils');
var debug = require('../debug');

module.exports = function(app) {
  return function(collections, prop, options, schema) {
    if (!collections || utils.isEmpty(collections)) {
      return null;
    }

    debug.field(prop, collections);
    var views = {};
    if (utils.isObject(collections)) {
      for (var key in collections) {

        if (collections.hasOwnProperty(key)) {
          var collection = collections[key];

          if (typeof collection === 'string' || Array.isArray(collection)) {
            var loader = utils.loader();
            views[key] = loader(collection);

          } else if (utils.isObject(collection)) {
            views[key] = collection;
          }
        }
      }
    }

    return views;
  };
};
