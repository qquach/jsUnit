/**
 * Test basic function of phantomjs test
 */
var Client = require('client');
module.exports = {
    simpleAssert:function(test){
      test.skip();
      //keep in mind the run handler executed in context of the browser. test object is injected in by default.
      var client = new Client();
      client.run(function(test){
        console.log("client side test");
        test.assertTrue(true);
        test.done();
      });
    }
};