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
    }
}