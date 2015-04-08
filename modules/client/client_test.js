/**
 * extend test on client side
 */
var test = require("test");
var util = require("util"),
    log = require("log").init("client_test");
var ClientTest = function(){}
var delay = 100;
var defaultTimeout = 3000;
ClientTest.prototype = util.extend({
    waitForElement: function(selector, callback, timeout){
      timeout = timeout || defaultTimeout;
      if(timeout<=0){
        test.error("waitForElement timeout");
      }
      var jObj = $(selector);
      if(jObj.length>0){
        callback();
      }
      var self = this;
      setTimeout(function(){
        self.waitForElement(selector, callback, timeout-delay);
      }, delay);
    },
    next: function(){
      log.debug("next");
      window.callPhantom({op:"next"});
    }
},test);
var clientTest = new ClientTest();
/*
for(var i in clientTest){
  log.debug("function: %s", i);
}
*/
module.exports = clientTest;