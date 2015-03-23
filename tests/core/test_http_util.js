/**
 *
 */
var httpUtil = require('http_util'),
    log = require('log'),
    util = require('util');
module.exports = {
    testGetHeader: function(test){
      var headers = {
          "content-type" : "text/html",
          "Check-Something": "test"
      }
      test.assertEquals(httpUtil.getHeader(headers, "Content-Type"),"text/html");
      test.assertEquals(httpUtil.getHeader(headers, "content-type"),"text/html");
      test.assertEquals(httpUtil.getHeader(headers, "check-something"),"test");
      test.assertEquals(httpUtil.getHeader(headers, "none",undefined));
      test.done();
    },
    testParseUrlEncoded: function(test){
      var data = "asdf=wer&sdfd=wer&wer=vsed";
      test.assertEquals(httpUtil.parseUrlEncoded(data),{"asdf":"wer","sdfd":"wer","wer":"vsed"});
      test.done();
    },
    testParseUrl: function(test){
      var urls =
        [
         "http://localhost:8080/path1?query=something&other=check#hash1/hash2?other=test",
         "localhost:8080/path1?query=something&other=check#hash1/hash2?other=test",
         "http://localhost/path1?query=something&other=check#hash1/hash2?other=test",
         "/path1?query=something&other=check#hash1/hash2?other=test",
         "localhost/path1/path2",
        ]
      var uris =
        [
          {"protocol":"http","host":"localhost:8080","hostname":"localhost","port":"8080","path":"/path1","query":"query=something&other=check","params":{"query":"something","other":"check"},"hash":"hash1/hash2?other=test"},
          {"host":"localhost:8080","hostname":"localhost","port":"8080","path":"/path1","query":"query=something&other=check","params":{"query":"something","other":"check"},"hash":"hash1/hash2?other=test"},
          {"protocol":"http","host":"localhost","hostname":"localhost","port":"","path":"/path1","query":"query=something&other=check","params":{"query":"something","other":"check"},"hash":"hash1/hash2?other=test"},
          {"path":"/path1","query":"query=something&other=check","params":{"query":"something","other":"check"},"hash":"hash1/hash2?other=test"},
          {"host":"localhost","hostname":"localhost","port":"","path":"/path1/path2"}
        ]
      var sequence = util.sequence(urls.length);
      test.assertEvery(sequence, function(i){
        return util.deepEqual(httpUtil.parseUrl(urls[i]), uris[i]);
      })
      test.done();
    }
}