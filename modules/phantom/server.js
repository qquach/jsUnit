/**
 * web server module to handle request for testing,
 * it acting as a simple rest server with
 */
var webserver = require('webserver');
var RestServer = require('rest_server');

var Server = function(port){
  this.server = webserver.create();
  var restServer = new RestServer();
  restServer.loadHandlers("modules/servers.js");
  this.service = server.listen(port, restServer.processRequest);
}

module.exports = Server;