'use strict';

require('mocha');
var assert = require('assert');
var utils = require('../lib/utils');
var app;

describe('utils', function() {
  describe('.isEmpty', function() {
    it('should return true if an object is empty', function() {
      assert.equal(utils.isEmpty({}), true);
    });

    it('should return true if an array is empty', function() {
      assert.equal(utils.isEmpty([]), true);
    });

    it('should return false if the value is a function', function() {
      assert.equal(utils.isEmpty(function() {}), false);
    });
  });

  describe('.arrayify', function() {
    it('should cast a string to an array', function() {
      assert.deepEqual(utils.arrayify('foo'), ['foo']);
    });

    it('should return an array', function() {
      assert.deepEqual(utils.arrayify(['foo']), ['foo']);
    });

    it('should return an empty array when undefined', function() {
      assert.deepEqual(utils.arrayify(), []);
    });
  });
});
