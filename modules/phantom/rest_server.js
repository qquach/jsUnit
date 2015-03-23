/**
 * handling rest server with request and response. This is a complete state less
 * process. Does not has cookie, session at all.
 */

var httpUtil = require('http_util');

var RestServer = function() {
  this.supportMethods = [ "get", "post", "put", "delete", "head", "options" ]
  this.route = [];
  this.app = {};
  this.init();
}

RestServer.prototype = {
  // initialize the supported methods
  init : function() {
    var self = this;
    for ( var i in this.supportMethods) {
      (function(k) {
        self.app[k] = function(path, handler) {
          var regExp = '';
          var params = {};
          var index = 1;
          regExp = path.replace(/:[^\/]+/g, function(m) {
            index++;
            params[m] = index;
            return "([^\\/]*)";
          });
          self.route.push({
            method : k,
            path : path,
            handler : handler,
            regExp : regExp,
            params : params
          });
        }
      })(i);
    }
  },
  // load handlers from a folder.
  loadHandlers : function(path) {
    loadHandlers(this.app, path);
  },
  processRequest : function(request, response) {
    var uri = httpUtil.parseUrl(request.url);
    request = expandRequest(request, uri);
    response = expandRespond(response);
    var pathMatched = false;
    for (var i = 0; i < this.route.length; i++) {
      var route = this.route[i];
      // check path matching pattern
      var m = uri.path.match(route.regExp);
      if (!m)
        continue;
      // check for method match
      pathMatched = true;
      if (route.method != request.method)
        continue;
      // handling request.
      request.params = getParams(m, route.params);
      try {
        route.handler(request, response);
      } catch (e) {
        response.status(500).send("Internal Server Error");
      }
    }
    if (pathMatched) {
      response.status(405).end("Method Not Allowed");
    } else {
      response.status(404).send("Not Found");
    }
  }
}

module.exports = RestServer;

/**
 * adding extra parameter to the request such as query and body.
 *
 * @param request
 * @param uri
 */
function expandRequest(request, uri) {
  request.query = uri.params;

  var method = request.method.toLowerCase();
  if (!(method != "post" && method != "put"))
    return;

  var type = httpUtil.getHeader(request.headers, "Content-Type");
  if (!type)
    return;

  if (type.match(/application\/x-www-form-urlencoded/)) {
    request.body = request.post;
    request.raw = request.postRaw;
  } else if (type.match(/(application|text)\/json/)) {
    request.body = JSON.parse(request.post);
    request.raw = request.post
  } else {
    request.body = request.raw = request.post;
  }
}

/**
 * Adding extra property to response object.
 *
 * @param response
 */
function expandResponse(response) {
  response.status = function(status) {
    response.statusCode = status;
  };
  response.send = function(content) {
    if (response.closed) {
      throw new Error("Cannot write after connection closed");
    }
    if (response.timeoutHandle)
      clearTimeout(response.timeoutHandle);
    response.write(content);
    response.timeoutHandle = setTimeout(function() {
      response.end();
    }, 100);
  };
  response.end = function(content) {
    if (response.closed) {
      throw new Error("Cannot call to end a closed connection");
    }
    if (response.timeoutHandle)
      clearTimeout(response.timeoutHandle);
    var content = content || "";
    response.send(content);
    response.close();
  };
  response.json = function(jsonObj) {
    var content = JSON.stringify(jsonObj);
    response.setHeader('Content-Type', 'application/json');
    response.end(content);
  }
}

function loadHandlers(app, path) {
  path = path || "modules/servers";
  var fs = require('fs');
  var list = fs.list(path);
  for (var x = 0; x < list.length; x++) {
    if (list[x] == "." || list[x] == "..")
      continue;
    var file = path + "/" + list[x];
    if (fs.isDirectory(file)) {
      loadHandlers(app, file);
    } else {
      loadHandler(app, list[x], file);
    }
  }
}

// need to create prefixed name to avoid conflicting with normal modules.
function loadHandler(app, file, path) {
  var name = "server_handler_" + file.slice(0, -3);
  var content = fs.read(path);
  module.define(name, content);
  var handler = require(name);
  handler(app);
}
