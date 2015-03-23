/**
 * testing module library
 */

phantom.injectJs("lib/bootstrap.js");
var util = require('util');
var str = util.format("test: %s, other: %d, and %j", "string", 1324, {obj:"test", "esdf":234});
console.log(str);

var log = require('log');
log.debug('test');

phantom.exit();
