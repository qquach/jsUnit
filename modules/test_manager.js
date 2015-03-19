/**
 * This is the entry point for testing
 */
var fs = require('fs'),
    cc = require('cc'),
    log = require('log'),
    util = require('util');

//collection of all tests will be run.
var testCollection = [];
var testTimeout = 5000; //timeout for test is 5 seconds
var tmpTimeout = 0;
var timeoutHandle = null;
var testCallback = null;
var currentTest = null;
var testResults = {
    totalTests: 0,
    isPassed: false,
    skippedTests: 0,
    failedTests: 0,
    runTests: 0,
    startTime: null,
    endTime: null
}
var Test = function(name, handler) {
  this.name = name;
  this.handler = handler;
  this.setUp = null;
  this.tearDown = null;
  this.start = null;
  this.end = null;
};

var testUtil = {
  assertEquals : function(a, b, msg) {

  },
  assertNotEquals : function(a, b, msg) {

  },
  assertTrue : function(a, msg) {

  },
  assertFalse : function(a, msg) {

  },
  assertNull : function(a, msg) {

  },
  assertNotNull : function(a, msg) {

  },
  assertIdentical : function(a, msg) {

  },
  assertNotIdentical : function(a, msg) {

  },
  /**
   * assert every element in collection pass to the handler return true
   * @param collection {collection}
   * @param handler {Function}
   * @param msg {String}
   */
  assertEvery : function(collection, handler, msg) {

  },
  /**
   * assert if any element in collection pass to the handler return true
   * @param collection {collection}
   * @param handler {Function}
   * @param msg {String}
   */
  assertAny : function(collection, handler, msg) {

  },
  /**
   * assert at least one element in collection return false
   * @param collection {collection}
   * @param handler {Function}
   * @param msg {String}
   */
  assertNotEvery : function(collection, handler, msg) {
    msg = msg || "every element in collection return true";
    cc.not(assertAny).call(this, collection, handler, msg);
  },
  /**
   * force to skip a test in code
   */
  skip : function() {
    testResults.skippedTests++;
    throw {type: "skip"};
  },
  /**
   * allow asynchronous call in test function, every test case must call test.done();
   * it will be set to a real function in runTest
   */
  done : function() {

  },
  setTimeout: function(time){
    tmpTimeout = time;
    if(!timeoutHandle)return;
    clearTimeout(timeoutHandle);
    timeoutHandle = setTimeout(timeoutError, time);
  }
};
/**
 * load test base on configuration
 */
function loadTestWithConfig(path, config) {

}
/**
 * load test from a file path. Utilize the module feature to load test.
 */
function loadTestFromFile(filePath) {
  var tests = require(filePath);
  var setUpTest = tests.setUp || null;
  var tearDownTest = tests.tearDown || null;
  for ( var name in tests) {
    if(name == "setUp" || name == "tearDown") continue;
    var handler = tests[name];
    var test = new Test(name, handler);
    test.setUp = setUpTest;
    test.tearDown = tearDownTest;
    testCollection.push(test);
    testResults.totalTests++;
  }
}
/**
 * First check if there is test.json in the folder, if there is one, it will be used to load all tests in the folder.
 * If test.json is not available, all files in the test will be loaded for testing.
 * Tests will be load recursively for all folder. And the test.json will be considered for every folder.
 * @param path {String} folder path to load tests from
 */
function loadTest(path) {
  var list = fs.list(path);
  var file = path + "/test.json";
  if (fs.exists(file)) {
    var configText = fs.read(file);
    var config = {};
    configText = "config = " + configText;
    eval(configText);
    log.debug("config: %j", config);
    loadTestWithConfig(path, config);
    return;
  }
  for (var i = 0; i < list.length; i++) {
    var file = list[i].toLowerCase();
    if (file == ".." || file == ".")
      continue;
    var filePath = path + "/" + file;
    if (fs.isDirectory(filePath)) {
      loadTest(filePath);
    } else {
      loadTestFromFile(filePath);
    }
  }
}

/**
 * run all test from the testCollection
 */
function runTest(){
  var test = testCollection.shift();
  currentTest = test;
  if(!test){
    testResults.isPassed = true;
    endTest();
    return;
  }
  //reset tmpTimeout for every run.
  tmpTimeout = 0;
  testUtil.done = function(){
    test.end = new Date();
    if(timeoutHandle !== null){
      clearTimeout(timeoutHandle);
    }
    if(test.tearDown) test.tearDown();
    console.log(util.format("Test %s finished - run time: %d", test.name, test.end-test.start));
    runTest();
  };
  try{
    timeoutHandle = setTimeout(timeoutError, testTimeout);
    testResults.runTests++;
    test.start = new Date();
    console.log(util.format("Test %s started", test.name));
    if(test.setUp) test.setUp();
    test.handler(testUtil);
  }
  catch(e){
    //handle skip test;
    if(e.type=="skip"){
      clearTimeout(timeoutHandle);
      if(test.tearDown) test.tearDown();
      test.end = new Date();
      console.log(util.format("Test %s skipped - after: %d", test.name, test.end-test.start));
      runTest();
      return;
    }
    //stop test for now. will handle multiple failed tests later
    console.log(e.message);
    console.log(e.stack);
    testResults.failedTests++;
    if(test.tearDown) test.tearDown();
    endTest("Exception happens while running test");
  }
}

function timeoutError(){
  testResults.failedTests++;
  if(currentTest && currentTest.tearDown) currentTest.tearDown();
  endTest(util.format("Test timeout after %s miliseconds", tmpTimeout || testTimeout));
}

/**
 * finish testing, show summary of all test results;
 */
function endTest(msg){
  testResults.endTime = new Date();

  if(testResults.isPassed){
    console.log("Test Passed");
  }
  else{
    console.log("Test Failed: " + msg);
  }
  console.log(util.format("Summary - total %s, ran: %s, skipped: %s, failed: %s",testResults.totalTests, testResults.runTests, testResults.skippedTests, testResults.failedTests));
  console.log(util.format("Total run time: %s", testResults.endTime - testResults.startTime));
  if(testCallback) testCallback();
}

module.exports = {
  loadTest : function(path){
    testResults.startTime = new Date();
    loadTest(path);
  },
  runTest : function(callback){
    testCallback = callback;
    runTest();
  }
};