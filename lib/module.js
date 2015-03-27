/**
 * simple approach for loading module
 */

var module = {
    loadingName:"",
    override: function(name, obj){
      name = name.toLowerCase();
      module.tmpList[name] = obj;
    },
    define: function(name, content){
      //console.log("define | name: " + name);
      if(name in module.list && module.list[name]._func){
        throw new Error('module defined');
      }
      module.loadingName = name;
      var func = "(function() {\n"+content+"\n})()";
      eval(func);
    },
    tmpList: {},
    list: {
      "fs": require("fs"),
      "system": require("system"),
      "webserver": require("webserver"),
      "webpage": require("webpage")
    },
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
      if(name in module.tmpList){
        tmp = module.tmpList[name];
        //delete module.tmpList[name];
        return tmp;
      }
      if(name in module.list){
        return module.list[name];
      }
      else{
        //check for phantomjs module
        if(phantom){
          //try to load dynamic module from file
          var fs = module.list['fs'];
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
          return module.list[name];
        }
        //running in context of client side
        else{
          module.list[name] = function(){
            if(!module.list[name]._func){
              throw new Error("module is called before defining");
            }
            return module.list[name]._func.apply(this,arguments);
          };
          return module.list[name];
        }
      }
    },
    phantomRequire: require
};

//module.phantomRequire = require;
require = module.get;

Object.defineProperty(module, "exports", {
  get: function(){
    throw new Error("Cannot get export property");
  },
  set: module.set
});