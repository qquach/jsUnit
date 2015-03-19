/**
 * Test feature of test framework
 */
var log = require('log');
module.exports = {
    /**
     * will be called before every test function.
     */
    setUp: function(){
      log.debug("set up test");
    },
    /**
     * will be called after every test function
     */
    tearDown: function(){
      log.debug("tear down test");
    },
    testSimple: function(test){
      log.debug("simple test case");
      test.done();
    },
    testSkip: function(test){
      test.skip();
      log.debug("skip test will not be since");
    },
    testTimeout: function(test){
      log.debug("not calling test.done(), test case will be timeout and exit the test");
    }
};