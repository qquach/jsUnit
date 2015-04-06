/**
 *
 */

var webPage = require('webpage'),
    log = require('log').init("proxy");
var host = "http://localhost";
var page;

setTimeout(function(){
  page = webPage.create();
});

module.exports = function(app){
  app.get('/proxy/*', function(req,res){
    log.debug('get proxy');
    var index = req.url.indexOf("/proxy");
    var url = host + req.url.substr(index+6);
    log.debug("url: %s", url);
    page.open(url, function(){
      var content = page.content;
      content = content.replace("<head>","<head>\n<base href=\"http://localhost:7777/proxy/\"/>")
      res.send(content);
    });
  });

  app.post('/proxy/*', function(req, res){
    log.debug('post proxy');
    var index = req.url.indexOf("/proxy");
    var url = host + req.url.substr(index+6);
    page.open(url, "post", req.raw, function(){
      res.send(page.content);
    });
  });
};
