'use strict';

var utils = require('../utils');
var debug = require('../debug');

module.exports = function(app) {
  return function(collections, key, options, schema) {
    debug.field(key, collections);

    if (utils.isEmpty(collections)) {
      return;
    }

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
