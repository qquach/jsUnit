/**
 * reflect request information on the response
 * application object is injected in to handle the request similar to Nodejs Express
 */

module.exports = function(app){
  app.get('ping',function(req,res){
    res.send("get ping");
  });
  app.put('ping', function(req, res){
    res.send("put ping");
  });
  app.post('ping', function(req, res){
    res.send("post ping");
  });
  app["delete"]('ping', function(req, res){
    res.send("delete ping");
  });
}