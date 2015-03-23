/**
 * utilities function
 */

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
        else if(util.isRegExp(a) && util.isRexExp(b)){
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
    }
};

module.exports = util;