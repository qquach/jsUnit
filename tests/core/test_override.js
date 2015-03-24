/**
 * test module override
 */

module.override('log',{
  debug: function(msg){
    console.log("overrided: " + msg);
  }
})
var log = require('log');
module.exports = {
    testOverride: function(test){
      log.debug("testing override");
      var newLog = require('log');
      newLog.debug("test again");
      test.done();
    }
}
