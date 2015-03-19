/**
 *
 */
phantom.injectJs("lib/module.js");
(function(){
  var fs = require('fs');

  function loadFile(file, path){
    var name = file.slice(0,-3);
    var content = fs.read(path);
    module.define(name, content);
  }

  //load core module log and util
  var cores = ["log.js","util.js","cc.js"];
  for(var i=0;i<cores.length;i++){
    var path = "modules/" + cores[i];
    loadFile(cores[i],path);
  }

  function loadModules(path){
    //console.log(path);
    var list = fs.list(path);
    for(var x = 0; x < list.length; x++){
        if(list[x] == "." || list[x] == ".." || cores.indexOf(list[x])!=-1) continue;
        var file = path + "/" + list[x];
        if(fs.isDirectory(file)){
          loadModules(file);
        }
        else{
          loadFile(list[x],file);
        }
    }
  }

  loadModules("modules");
})();
