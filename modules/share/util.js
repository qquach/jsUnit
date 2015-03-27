/**
 * utilities function
 */

//console.log("loading util");
var log = require('log');

var util = {
    format:function(){
      var args = util.toArray(arguments);
      var template = args.shift();
      if(!template) return "";
      var regex = /%s|%d|%j/g;
      return template.replace(regex,function(m0){
        var value = args.shift();
        if(m0 == "%j") value = JSON.stringify(value);
        return value;
      });
    },
    toArray: function(args){
      return Array.prototype.slice.apply(args);
    },
    sequence: function(length, start, step){
      lenght = length || 0;
      start = start || 0;
      step = step || 1;
      var out = [];
      for(var i = 0; i<length; i++){
        out.push(start + i*step);
      }
      return out;
    },
    deepEqual:function(a,b){
      if(typeof(a)!="object" && typeof(b)!="object"){
        return a==b;
      }
      else if(typeof(a)=="object" && typeof(b)=="object"){
        if(util.isDate(a) && util.isDate(b)){
          return a.getTime()==b.getTime();
        }
        else if(util.isRegExp(a) && util.isRegExp(b)){
          return a.toString()==b.toString();
        }
        else if(util.isArray(a) && util.isArray(b)){
          if(a.length!=b.length) return false;
          for(var i = 0;i<a.length;i++){
            if(!util.deepEqual(a[i],b[i])) return false;
          }
          return true;
        }
        else if(util.isObject(a) && util.isObject(b)){
          for(var i in a){
            if(!util.deepEqual(a[i],b[i])) return false;
          }
          for(var i in b){
            if(!util.deepEqual(a[i],b[i])) return false;
          }
          return true;
        }
      }
      return false;
    },
    isArray: function(obj){
      return Object.prototype.toString.call(obj)=="[object Array]";
    },
    isDate: function(obj){
      return Object.prototype.toString.call(obj)=="[object Date]";
    },
    isRegExp: function(obj){
      return Object.prototype.toString.call(obj)=="[object RegExp]";
    },
    isObject: function(obj){
      return Object.prototype.toString.call(obj)=="[object Object]";
    },
    isEmpty: function(obj){
      if(util.isArray(obj) && obj.length==0) return true;
      if(util.isObject(obj)){
        for(var i in obj){
          return false;
        }
        return true;
      }
      return false;
    },
    clone: function(obj){
      if(typeof(obj)!="object") return obj;
      if(util.isDate(obj)) return new Date(obj.getTime());
      if(util.isRegExp(obj)) return new RegExp(obj);
      if(typeof(obj.constructor)=="function"){
        var out = obj.constructor();
        for(var i in obj) {
            if(obj.hasOwnProperty(i)) {
                out[i] = util.clone(obj[i]);
            }
        }
        return out;
      }
      throw new Error("unhandle type for cloning");
    },
    extend: function(){
      var args = util.toArray(arguments);
      //log.debug("args.length: %d", args.length);
      if(args.length==0) return undefined;
      else if(args.length == 1) return args[0];
      else{
        var last = args[args.length-1];
        for(var i = args.length-2; i>=0;i--){
          //log.debug("i: %d, last: %j",i , last);
          var tmp = i==0 ? args[0] : util.clone(args[i]);
          //log.debug("tmp: %j", tmp);
          last = _extend(tmp, last);
        }
        return last;
      }
    }
};

module.exports = util;

function _extend(obj1, obj2){
  if(util.isObject(obj1) && util.isObject(obj2)){
    for(var i in obj2){
      obj1[i] = obj2[i];
    }
  }
  else if(util.isArray(obj1) && util.isArray(obj2)) {
    for(var i = 0; i < obj2.length; i++){
      obj1[i] = obj2[i];
    }
  }
  return obj1;
}