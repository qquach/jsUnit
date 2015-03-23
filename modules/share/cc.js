/**
 * Common functional function collection
 * Every function should take in at least one function as parameter, do something or return another function.
 */
module.exports = {
    /**
     * calling callback n times
     * @param n
     * @param callback
     */
    times: function(n,callback){

    },
    /**
     * return the difference in time before and after exceuting the callback
     * @param callback
     */
    timer: function(callback){

    },
    /**
     * return the function that return negative value of the callback function.
     * @param callback
     * @returns {Function}
     */
    not: function(callback){
      return function() {
        return !callback.call(arguments);
      };
    }
};