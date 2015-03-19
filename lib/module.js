/**
 * simple approach for loading module
 */

var fs = require('fs');

//define module library.

var module = {
    loadingName:"",
    define: function(name, content){
      //console.log("define | name: " + name);
      if(name in module.list && module.list[name]._func){
        throw new Error('module defined');
      }
      module.loadingName = name;
      var func = "(function() {\n"+content+"\n})()";
      eval(func);
    },
    list: {},
    set: function(func){
      //handle preloaded
      if(module.loadingName in module.list){
        if(typeof(func) == "object"){
          for(var i in func){
            module.list[module.loadingName][i] = func[i];
          }
        }
        else if(typeof(func) == "function"){
          module.list[module.loadingName]._func = func;
          module.list[module.loadingName].prototype = func.prototype;
          for(var i in func){
            module.list[module.loadingName][i] = func[i];
          }
        }else{
          throw new Exception("bad module definition");
        }
      }else{
        module.list[module.loadingName] = func;
      }
    },
    get: function(name){
      //console.log("get | name: "+ name);
      name = name.toLowerCase();
      if(name in module.list){
        return module.list[name];
      }
      else{
        //check for phantomjs module
        try{
          var tmp = module.phantomRequire(name);
          if(tmp){
            //console.log("load built in phantomJs module");
            return tmp;
          }
        }
        catch(e){
          //try to load dynamic module from file
          if(fs.exists(name)){
            //console.log("dynamic loading file: "+name);
            module.define(name,fs.read(name));
          }
          else{
            module.list[name] = function(){
              if(!module.list[name]._func){
                throw new Error("module is called before defining");
              }
              return module.list[name]._func.apply(this,arguments);
            };
          }
          //console.log("module.loadingName: " + module.loadingName);
          //console.log("name: " + name);
          return module.list[name];
        }
      }
    },
    phantomRequire:null
};

module.phantomRequire = require;

var require = module.get;

Object.defineProperty(module, "exports", {
  get: function(){
    throw new Error("Cannot get export property");
  },
  set: module.set
});