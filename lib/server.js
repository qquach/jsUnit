/**
 * Entry point to start the server for debugging in browser.
 */
phantom.injectJs("lib/bootstrap.js");
var log = require('log');
var WebServer = require('web_server');
var server = new WebServer(7777);