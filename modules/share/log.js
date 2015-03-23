/**
 * simple log module
 */
var LogLevel = {
    "debug":4,
    "info":3,
    "warn":2,
    "error":1
};
var Log = function(prefix, level){
  this.prefix = prefix || "";
  level = level || "debug";
  this.level = LogLevel[level];
};
Log.prototype = {
    debug:function(){
      if(this.level < 4) return;
      console.log(formatMessage(arguments, this.prefix, "debug"));
    },
    info: function(){
      if(this.level < 3) return;
      console.info(formatMessage(arguments, this.prefix, "info "));
    },
    warn: function(){
      if(this.level < 2) return;
      console.warn(formatMessage(arguments, this.prefix, "warn "));
    },
    error: function(){
      if(this.level < 1) return;
      console.error(formatMessage(arguments, this.prefix, "error"));
    }
};
var log = new Log();
log.init = function(prefix, level){
  return new Log(prefix, level);
};
module.exports = log;
//==============================================
var util = require('util');
/**
 * timestamp | level | prefix | message
 * @param args
 * @param prefix
 * @param type
 */
function formatMessage(args, prefix, level){
  args = util.toArray(args);
  var now = new Date().getTime();
  if(prefix){
    args.splice(1,0,now,level,prefix);
    args[0] = '%s | %s | %s | ' + args[0];
  }
  else{
    args.splice(1,0,now,level);
    args[0] = '%s | %s | ' + args[0];
  }
  return util.format.apply(util,args);
}