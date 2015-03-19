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
    }
};

module.exports = util;