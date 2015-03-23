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
      test.skip();
      test.setTimeout(500);
      log.debug("not calling test.done(), test case will be timeout and exit the test");
    },
    testAssertTrue: function(test){
      test.assertTrue(true);
      test.done();
    },
    testAssertFalse: function(test){
      test.assertFalse(false);
      test.done();
    },
    testAssertNull: function(test){
      test.assertNull(null);
      test.done();
    },
    testAssertNotNull: function(test){
      test.assertNotNull(1);
      test.done();
    },
    testAssertEquals: function(test){
      test.assertEquals({a:'A',b:[1,2,3]},{a:'A',b:[1,2,3]});
      test.done();
    },
    testAssertNotEquals: function(test){
      test.assertNotEquals({a:'A',b:[1,2,3]},{a:'A',b:[1,2,3],c:{}});
      test.done();
    },
    testAssertIdentical: function(test){
      test.assertIdentical(1,1);
      test.done();
    },
    testAssertNotIdentical: function(test){
      test.assertNotIdentical({a:'A',b:[1,2,3]},{a:'A',b:[1,2,3]});
      test.done();
    },
    testAssertEvery: function(test){
      test.assertEvery([1,1,1],function(a){return a==1;});
      test.done();
    },
    testAssertAny: function(test){
      test.assertAny([1,2,3],function(a){return a==1;});
      test.done();
    },
    testThrow: function(test){
      test.assertThrow(function(){
        throw "test";
      });
      test.done();
    },
    testNotThrow: function(test){
      test.assertNotThrow(function(){
        return true;
      });
      test.done();
    }
};