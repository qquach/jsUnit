/**
 * testing module library
 */

phantom.injectJs("lib/module.js");
var fs = require('fs');

//test fs
var m1Content = fs.read("tmodules/module1.js");
module.define('m1', m1Content);
var m1 = require('m1');
m1.log("testing");

//test object
var content = "module.exports = {"+
"      a: function(str){"+
"        console.log(\"testing something: %s\", str);"+
"      }"+
"  };";
module.define('obj', content);

var m = require("obj");
m.a("abas");

//test function
var m2Content = fs.read("tmodules/module2.js");
module.define('m2', m2Content);
var Log = require('m2');
var m2 = new Log("prefix");
m2.log("testing");
Log.check();

//test preloading module
var Log = require('m3');
var m3Content = fs.read("tmodules/module3.js");
module.define('m3', m3Content);
var m3 = new Log("prefix");
m3.log("testing");
Log.check();

//test duplicate
try{
  module.define('m3',m3Content);
}
catch(e){
  console.log(e.message);
}

//test calling before define;
var t = require('m4');
try{
  t.test();
}
catch(e){
  console.log(e.message);
}

var fUtil = require("modules/util.js");
var str = fUtil.format("test: %s", "check dynamic module");
console.log(str);
phantom.exit();
