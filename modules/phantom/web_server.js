/**
 * web server module to handle request for testing,
 * it acting as a simple rest server with
 */
var webserver = require('webserver');
var RestServer = require('rest_server');
var log = require('log');

var Server = function(port){
  this.server = webserver.create();
  var restServer = new RestServer();
  console.log("get here");
  restServer.loadHandlers("modules/servers");
  console.log("get here");
  this.service = this.server.listen(port, function(request, response){
    restServer.processRequest(request, response);
  });
}

module.exports = Server;