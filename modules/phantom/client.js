/**
 * create the client or web page interface to run tests in the context of a page.
 */
var webPage = require('webpage');
var server = require('server');
var Client = function(options){
  this.url = options && options.url || "http://localhost";
  this.page = webPage.create();
  this._init();
};

Client.prototype = {
    _init: function(){

    },
    run: function(testHandler){

    }
}

module.exports = Client;