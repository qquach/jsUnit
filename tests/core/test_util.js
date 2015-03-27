/**
 * test util module
 */

var util = require('util');
module.exports = {
    testSequence: function(test){
      test.assertEquals(util.sequence(),[]);
      test.assertEquals(util.sequence(4),[0, 1, 2, 3]);
      test.assertEquals(util.sequence(3, 2),[2, 3, 4]);
      test.assertEquals(util.sequence(3, 2, 2),[2, 4, 6]);
      test.done();
    },
    testClone: function(test){
      var a = {"a":"A", b: [1,2,3], c: 12, d:new Date("12/23/2015"), e: /\w+/g};
      b = util.clone(a);
      test.assertEquals(a,b);
      test.done();
    },
    testExtend: function(test){
      var a = {"a":"A", b: [1,2,3], c: 12, d:new Date("12/23/2015"), e: /\w+/g};
      var b = util.extend({a:"B", b: [], f: "asf"},a);
      test.assertNotEquals(a,b);
      a.f = "asf";
      test.assertEquals(a,b);
      var c = util.extend({a:"A"},{b:[1,2,3]},{c:12},{d:new Date("12/23/2015")},{e:/\w+/g},{f:"asf"});
      test.assertEquals(a,c);
      test.done();
    }
}