/**
 * Test basic function of phantomjs test
 */
var Client = require('client');
module.exports = {
  passAssert : function(test) {
    var client = new Client(test);
    client.run(function(test) {
      console.log("client side pass assert");
      test.assertTrue(true);
      test.done();
    });
  },
  failAssert : function(test) {
    //test.skip();
    var client = new Client(test);
    client.run(function(test) {
      console.log("client side fail assert");
      test.assertTrue(false);
      test.done();
    });
  },
  throwException : function(test) {
    var client = new Client(test);
    client.run(function(test) {
      console.log("client side throw exception");
      throw new Error("testing exception");
      test.done();
    });
  },
  loadUrl : function(test) {
    var client = new Client(test, {
      url : "http://localhost/github/jFormat/demo/"
    });
    client.run(function(test) {
      console.log("client side load url");
      test.assertNotNull(document.body);
      var length = document.getElementsByTagName("a").length;
      console.log("length " + length);
      test.assertTrue(length>20);
      test.done();
    });
  },
};