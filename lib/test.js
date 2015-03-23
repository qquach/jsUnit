/**
 * This is the entry point for testing
 */
phantom.injectJs("lib/bootstrap.js");
var system = require('system');
var args = system.args;
var testManager = require("test_manager"),
    log = require('log');

if(args.length == 2){
  path = args[1];
  testManager.loadTest(path);
}
else{
  testManager.loadTest("tests");
}
testManager.runTest(phantom.exit);