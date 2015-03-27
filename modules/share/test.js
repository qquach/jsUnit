/**
 * test object inject into test function
 */
var util = require('util'),
    testResults = require('test_results'),
    log = require('log').init('test');

var test = {
  assertEquals : function(a, b, msg) {
    testResults.totalAssert++;
    if (util.deepEqual(a, b))
      return;
    msg = msg || util.format("%j is not equal to %j", a, b);
    throw {
      type : 'failed',
      message : msg
    };
  },
  assertNotEquals : function(a, b, msg) {
    testResults.totalAssert++;
    if (!util.deepEqual(a, b))
      return;
    msg = msg || util.format("%j is equal to %j", a, b);
    throw {
      type : 'failed',
      message : msg
    };
  },
  assertTrue : function(a, msg) {
    testResults.totalAssert++;
    if (a === true)
      return;
    msg = msg || util.format("%s is not true", a);
    throw {
      type : 'failed',
      message : msg
    };
  },
  assertFalse : function(a, msg) {
    testResults.totalAssert++;
    if (a === false)
      return;
    msg = msg || util.format("%s is not false", a);
    throw {
      type : 'failed',
      message : msg
    };
  },
  assertNull : function(a, msg) {
    testResults.totalAssert++;
    if (a === null)
      return;
    msg = msg || util.format("%s is not null", a);
    throw {
      type : 'failed',
      message : msg
    };
  },
  assertNotNull : function(a, msg) {
    testResults.totalAssert++;
    if (a !== null)
      return;
    msg = msg || util.format("%s is null", a);
    throw {
      type : 'failed',
      message : msg
    };
  },
  assertThrow : function(callback, msg) {
    testResults.totalAssert++;
    try {
      callback();
    } catch (e) {
      return;
    }
    msg = msg || util.format("Handler does not throw exception");
    throw {
      type : 'failed',
      message : msg
    };
  },
  assertNotThrow : function(callback, msg) {
    testResults.totalAssert++;
    try {
      callback();
      return;
    } catch (e) {
      msg = msg || util.format("Handler throws exception: %s", e.message);
      throw {
        type : 'failed',
        message : msg
      };
    }
  },
  assertIdentical : function(a, b, msg) {
    testResults.totalAssert++;
    if (a === b)
      return;
    msg = msg || util.format("%j is not identical to %j", a, b);
    throw {
      type : 'failed',
      message : msg
    };
  },
  assertNotIdentical : function(a, b, msg) {
    testResults.totalAssert++;
    if (a !== b)
      return;
    msg = msg || util.format("%j is identical to %j", a, b);
    throw {
      type : 'failed',
      message : msg
    };
  },
  /**
   * assert every element in collection pass to the handler return true
   *
   * @param collection
   *          {collection}
   * @param handler
   *          {Function}
   * @param msg
   *          {String}
   */
  assertEvery : function(collection, handler, msg) {
    testResults.totalAssert++;
    msg = msg || util.format("not every element in the collection return true");
    if (util.isArray(collection)) {
      for (var i = 0; i < collection.length; i++) {
        if (!handler(collection[i])) {
          throw {
            type : 'failed',
            message : msg
          };
        }
      }
    } else if (util.isObject(collection)) {
      for ( var i in collection) {
        if (!handler(collection[i])) {
          throw {
            type : 'failed',
            message : msg
          };
        }
      }
    } else {
      if (!handler(collection)) {
        throw {
          type : 'failed',
          message : msg
        };
      }
    }
  },
  /**
   * assert if any element in collection pass to the handler return true
   *
   * @param collection
   *          {collection}
   * @param handler
   *          {Function}
   * @param msg
   *          {String}
   */
  assertAny : function(collection, handler, msg) {
    testResults.totalAssert++;
    if (util.isArray(collection)) {
      for (var i = 0; i < collection.length; i++) {
        if (handler(collection[i])) {
          return;
        }
      }
    } else if (util.isObject(collection)) {
      for ( var i in collection) {
        if (handler(collection[i])) {
          return;
        }
      }
    } else {
      if (handler(collection)) {
        return;
      }
    }
    msg = msg || util.format("all element in the collection return false");
    throw {
      type : 'failed',
      message : msg
    };
  },
  /**
   * force to skip a test in code
   */
  skip : function() {
    throw {
      type : "skip"
    };
  },
  /**
   * allow asynchronous call in test function, every test case must call
   * test.done(); it will be set to a real function in runTest
   */
  done : function() {

  },
  setTimeout : function(time) {
    tmpTimeout = time;
    if (!timeoutHandle)
      return;
    clearTimeout(timeoutHandle);
    timeoutHandle = setTimeout(timeoutError, time);
  },
  assert: function(){
    testResults.totalAssert++;
  },
  failed: function(msg){
    log.debug("failed: message: %s", msg);
    throw {
      type: 'failed',
      message: msg
    }
  },
  error: function(msg, stack){
    throw {
      type: 'error',
      message: msg,
      stack: stack
    }
  }
};
module.exports = test;