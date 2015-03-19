/**
 * This is the entry point for testing
 */
phantom.injectJs("lib/bootstrap.js");
var testManager = require("test_manager");
testManager.loadTest("tests");
testManager.runTest(phantom.exit);