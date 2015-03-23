/**
 * testing log function
 */
var log = require('log');
module.exports = {
    testDebug: function(test){
      log.debug('test');
      test.done();
    },
    testLogLevel:function(test){
      var l = log.init('warn prefix','warn');
      l.debug('debug');
      l.info('info');
      l.warn('warn');
      l.error('error1');
      log.debug('log debug');
      test.done();
    }
};