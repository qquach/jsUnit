/**
 * client side module. It is slightly different from phantomjs module.
 */

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
        module.list[name] = function(){
          if(!module.list[name]._func){
            throw new Error("module is called before defining");
          }
          return module.list[name]._func.apply(this,arguments);
        };      
        return module.list[name];        
      }
    }
};

var require = module.get;

Object.defineProperty(module, "exports", {
  get: function(){
    throw new Error("Cannot get export property");
  },
  set: module.set
});