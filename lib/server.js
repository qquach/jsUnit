/**
 * Entry point to start the server for debugging in browser.
 */
phantom.injectJs("lib/bootstrap.js");

var log = require('log');
var system = require('system');
var args = system.args;

var WebServer = require('web_server');
var port = 7777;
if(args.length==2){
  port = parseInt(args[1],10);
}
var server = new WebServer(port);
log.debug("web server started on port: %d", port);