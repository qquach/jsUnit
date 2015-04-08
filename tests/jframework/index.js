/**
 *
 */
var Client = require('client');
module.exports = {

    checkIndex: function(test){
      var client = new Client(test, {url:"http://localhost/github/jFramework/"});
      client.run(function(test){
        var log = jsUnit.require("log");
        log.debug("test one | length: %s",$("a").length);
        log.debug("type: %s", typeof(test.waitForElement));
        test.waitForElement("a[href='#home/partialDemo']",function(){
          /*
          $("a").each(function(i,e){
            log.debug(e.href);
          });
          */
          test.assertEquals($("a").length,8);
          test.next();
        });
      });
      client.run(function(test){
        console.log("next test");
        var a = $("a[href='#home/linkDemo']").get(0);
        console.log(typeof(a.click));
        a.click();
        test.waitForElement("a[href='#home/simpleModel?name=quoc quach&age=20']",function(){
          test.assertEquals($("a").length,7);
          test.done();
        });
      });
    }
}