/**
 * This is the entry point for testing
 */
var fs = require('fs'),
    log = require('log').init("test_manager","info"),
    util = require('util'),
    testUtil = require('test'),
    testResults = require('test_results');

var continueOnError = true;

Object.defineProperty(testUtil,"error",{
  set: function(e){
    //log.debug("testUtil error set: %j", e);
    handleError(e);
  }
});

//collection of all tests will be run.
var testCollection = [];
var testTimeout = 5000; //timeout for test is 5 seconds
var tmpTimeout = 0;
var timeoutHandle = null;
var testCallback = null;
var currentTest = null;

var Test = function(name, handler) {
  this.name = name;
  this.handler = handler;
  this.setUp = null;
  this.tearDown = null;
  this.start = null;
  this.end = null;
};

testUtil.setTimeout = function(time) {
  tmpTimeout = time;
  if (!timeoutHandle)
    return;
  clearTimeout(timeoutHandle);
  timeoutHandle = setTimeout(timeoutError, time);
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
  if(!fs.isDirectory(path)){
    if(fs.exists(path)) loadTestFromFile(path);
    return;
  }
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
    console.log(util.format("Test %s finished - run time: %d\n", test.name, test.end-test.start));
    runTest();
  };
  try{
    testResults.runTests++;
    timeoutHandle = setTimeout(timeoutError, testTimeout);
    test.start = new Date();
    console.log(util.format("\nTest %s started", test.name));
    if(test.setUp) test.setUp();
    log.debug("before calling test handler");
    test.handler(testUtil);
    log.debug("after calling test handler");
  }
  catch(e){
    //handle skip test;
    handleError(e);
  }
}

function handleError(e){
  //log.debug("runTest: exception type: %s", e.type);
  if(e.type=="skip"){
    testResults.skippedTests++;
    testResults.runTests--;
    currentTest.end = new Date();
    var msg = util.format("Test %s skipped - after: %d\n", currentTest.name, currentTest.end-currentTest.start);
    return finishTest(currentTest, msg, true);
  }
  if(e.type == "failed"){
    testResults.failedTests++;
    return finishTest(currentTest, e.message, continueOnError);
  }
  //stop test for now. will handle multiple failed tests later
  //timeout or other exception
  var msg = util.format("Exception happens while running test %s \n %s\n", e.message, e.stack);
  testResults.failedTests++;
  return finishTest(currentTest, msg, continueOnError);
}

function timeoutError(){
  testResults.failedTests++;
  if(currentTest && currentTest.tearDown) currentTest.tearDown();
  endTest(util.format("Test timeout after %s miliseconds\n", tmpTimeout || testTimeout));
}

function finishTest(test, msg, isContinue){
  //log.debug("finishTest: %s, isContinue: %s", msg, isContinue);
  clearTimeout(timeoutHandle);
  if(test.tearDown) test.tearDown();
  if(isContinue) {
    runTest();
  }
  else {
    endTest(msg);
  }
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
  console.log(util.format("Summary - total %s, assert: %s, ran: %s, skipped: %s, failed: %s",
      testResults.totalTests, testResults.totalAssert, testResults.runTests, testResults.skippedTests, testResults.failedTests));
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