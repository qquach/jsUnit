/**
 * create the client or web page interface to run tests in the context of a page.
 */
var webPage = require('webpage'),
    fs = require('fs'),
    util = require('util'),
    log = require('log').init("client","debug");

var defaultOptions = {
    url:"",
    host: "localhost",
    path: "/blank"
}
var Client = function(test, opts){
  this.test = test;
  this.options = util.extend({},defaultOptions, opts);
  this.url = "";
  this.page = webPage.create();
  this._init();
  this.isLoaded = false;
  this.testHandlers = [];
};

Client.prototype = {
    /**
     * binding event to page
     */
    _init: function(){
      log.debug("_init");
      createInitScript();
      createScriptServer();
      this.url = this.options.url || "http://"+this.options.host+":"+randPort + this.options.path;
      var self = this;

      this.page.onInitialized = function(){
        log.debug("page.onInitialized");
        self.page.evaluateJavaScript("function(){"+initScript+"}");
        log.debug("page.onInitialized: after initScript");
        self.page.evaluate(function(){
          //console.log("page.onInitialized one client side");
          //initialize test object
          jsUnit.test = jsUnit.require("client_test");
          jsUnit.test.done = function(){
            window.callPhantom({ op: "done"});
          }
          //initialize testResults.
          var testResults = jsUnit.require('test_results');
          Object.defineProperty(testResults, "totalAssert",{
            get: function(){
              return this._totalAssert;
            },
            set: function(val){
              this._totalAssert = val;
              window.callPhantom({ op: "assert"});
            }
          });
        });
        log.debug("initialized");
      };
      this.page.open(this.url, function(){
        log.debug("page loaded on %s", self.page.url);
      });
      this.page.onLoadFinished = function(status){
        log.debug("page load finished: %s", status);
        self.isLoaded = true;
        if(self.testHandlers.length>0){
          self.invokeTestHandler();
        }
      }
      this.page.onCallback = function(data){
        //log.debug("page.onCallback: %j", data);
        if(!util.isObject(data)) return;
        switch(data.op){
          case "done":
            self.test.done();
            break;
          case "assert":
            self.test.assert();
            break;
          case "failed":
            setTimeout(function(){
              self.test.error = {type:"failed", message: data.message}
            },10);
            break;
          case "error":
            setTimeout(function(){
              self.test.error = {type:"error", message: data.message, stack: data.stack};
            },10);
            break;
          case "next":
            self.invokeTestHandler();
            break;
        }
      }
      this.page.onConsoleMessage = function(msg){
        console.log("client message: " + msg);
      }
    },

    run: function(testHandler){
      log.debug("run")
      if(this.isLoaded){
        self.invokeTestHandler();
      }
      else{
        log.debug("page is not ready");
        this.testHandlers.push(testHandler);
      }
    },
    invokeTestHandler: function(){
      log.debug("invokeTestHandler");
      var nextHandler = this.testHandlers.shift();
      if(!nextHandler) {
        log.info("no more test handler");
        this.test.done();
      }
      var testHandlerStr = nextHandler.toString();
      this.page.evaluate(function(testStr){
        console.log("invokeTestHandler on client side");
        try{
          var testHandler;
          eval("testHandler = " + testStr);
          testHandler(jsUnit.test);
        }catch(e){
          console.log("error");
          if(e.type == "failed"){
            window.callPhantom({ op: "failed", message: e.message});
          }
          else{
            window.callPhantom({ op: "error", message: e.message, stack: e.stack});
          }
        }
      }, testHandlerStr);
    }
}

module.exports = Client;

//======================

var WebServer = require('web_server');
var initScript = "";
var randPort = 0;
var scriptServer = null;

function createScriptServer(){
  if(scriptServer) return;
  log.info("createScriptServer");
  randPort = Math.floor(Math.random()*55535) + 1000;
  scriptServer = new WebServer(randPort);
  log.info("script server running on port: %d", randPort);
}

function createInitScript(){
  if(initScript) return;
  log.info("createInitScript");
//load module and shim no need to encapsulate the scope
  var list = ["module.js","shim.js"];
  for(var x = 0; x < list.length; x++){
      var file = "modules/client/" + list[x];
      initScript += fs.read(file) + "\n";
  }
  //load share script.
  list = ["share/util.js","share/log.js","share/cc.js","share/test_results.js","share/test.js","client/client_test.js"];

  for(var x = 0; x < list.length; x++){
      var file = "modules/" + list[x];
      var i = list[x].indexOf("/")+1;
      var content = "(function(module, require) {\n";
      content += "module.loadingName = '" + list[x].slice(i,-3) +"';\n";
      content += fs.read(file);
      content += "\n})(jsUnit.module, jsUnit.require);\n";
      initScript += content;
  }
  //log.debug("initScript: %s", initScript);
}
