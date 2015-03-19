var Log = function(level){
  this.level = level;
}
Log.prototype = {
    log: function(msg){
      console.log(this.level + " : " + msg);
    }
}
Log.check = function(){
  console.log("check static function");
}
module.exports = Log;