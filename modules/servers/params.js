/**
 * reflect request information on the response
 * application object is injected in to handle the request similar to Nodejs Express
 */
var log = require('log');
module.exports = function(app){
  app.get('/params/:a/test/:b/:c',function(req,res){
    log.debug('get params');
    res.send("test params: %j", req.params);
  });
  app.get('/query',function(req,res){
    log.debug('get query');
    res.send("test query: %j", req.query);
  });
  app.put('/body', function(req, res){
    log.debug('put body');
    res.send("put body: %j", req.body);
  });
  app.post('/body', function(req, res){
    log.debug('post body');
    res.send("post body: %j", req.body);
  });
}