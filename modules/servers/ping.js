/**
 * reflect request information on the response
 * application object is injected in to handle the request similar to Nodejs Express
 */
var log = require('log');
module.exports = function(app){
  app.get('/ping',function(req,res){
    log.debug('get ping');
    res.status(200).send("get ping");
  });
  app.put('/ping', function(req, res){
    log.debug('put ping');
    res.send("put ping");
  });
  app.post('/ping', function(req, res){
    log.debug('post ping');
    res.send("post ping");
  });
  app["delete"]('/ping', function(req, res){
    log.debug('delete ping');
    res.send("delete ping");
  });
}