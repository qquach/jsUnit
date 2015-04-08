/**
 * handling rest server with request and response. This is a complete state less
 * process. Does not has cookie, session at all.
 */

var httpUtil = require('http_util'),
    fs = require('fs'),
    log = require('log').init("restServer","info"),
    util = require('util');

var RestServer = function() {
  this.supportMethods = [ "get", "post", "put", "delete", "head", "options" ]
  this.route = [];
  this.app = {'test':"check"};
  this.init();
}

RestServer.prototype = {
  // initialize the supported methods
  init : function() {
    log.debug('init');
    var self = this;
    for ( var i = 0; i<this.supportMethods.length; i++) {
      (function(method) {
        self.app[method] = function(path, handler) {
          log.debug("app handler called");
          var regExp = '';
          var params = {};
          var index = 0;
          regExp = path.replace(/:[^\/]+/g, function(m) {
            index++;
            params[m.substr(1)] = index;
            return "([^\\/]*)";
          }).replace(/\*/g,".*");
          self.route.push({
            method : method,
            path : path,
            handler : handler,
            regExp : "^"+regExp+"$",
            params : params
          });
        };
      })(this.supportMethods[i]);
    }
  },
  // load handlers from a folder.
  loadHandlers : function(path) {
    log.debug("loadHandlers: path: %s", path);
    loadHandlers(this.app, path);
    log.debug("route: %j", this.route);
  },
  processRequest : function(request, response) {
    log.debug('processRequest | method: %s, url: %s', request.method, request.url);
    var uri = httpUtil.parseUrl(request.url);
    expandRequest(request, uri);
    log.debug("request: %j", request);
    expandResponse(response);
    log.debug("response: %j", response);

    var pathMatched = false;
    log.debug("this.route.length: %j", this.route);
    for (var i = 0; i < this.route.length; i++) {
      var route = this.route[i];
      // check path matching pattern
      var m = uri.path.match(route.regExp);
      if (!m)
        continue;
      // check for method match
      pathMatched = true;
      if (route.method.toLowerCase() != request.method.toLowerCase())
        continue;
      log.debug("route match for regex: %s, method: %s", route.regExp, route.method);
      // handling request.
      request.params = httpUtil.getParamValues(m, route.params);
      try {
        return route.handler(request, response);
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
  log.debug('expandRequest: %j', uri);
  request.query = uri.params;

  var method = request.method.toLowerCase();
  log.debug("method: %s", method);
  if (method != "post" && method != "put"){
    log.debug("not post or put")
    return;
  }


  var type = httpUtil.getHeader(request.headers, "Content-Type");
  if (!type){
    log.debug('type not defined');
    return;
  }

  if (type.match(/application\/x-www-form-urlencoded/i)) {
    request.body = httpUtil.parseUrlEncoded(request.post);
    request.raw = request.post;
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
    log.debug("response.status");
    response.statusCode = status;
    return response;
  };
  response.send = function() {
    var content = util.format.apply(util,arguments);
    log.debug("response.send");
    if (response.closed) {
      throw new Error("Cannot write after connection closed");
    }
    if (response.timeoutHandle){
      log.debug('send clearTimeout')
      clearTimeout(response.timeoutHandle);
    }

    response.write(content);
    response.timeoutHandle = setTimeout(function() {
      log.debug('response.end not called');
      response.end();
    },0);
    return response;
  };
  response.end = function(content) {
    var content = util.format.apply(util,arguments);
    log.debug("response.end");
    if (response.closed) {
      throw new Error("Cannot call to end a closed connection");
    }
    if (response.timeoutHandle){
      log.debug("end clearTimeout");
      clearTimeout(response.timeoutHandle);
    }

    var content = content || "";
    response.write(content);
    response.close();
    return response;
  };
  response.json = function(jsonObj) {
    log.debug("response.json");
    var content = JSON.stringify(jsonObj);
    response.setHeader('Content-Type', 'application/json');
    response.end(content);
    return response;
  }
}

function loadHandlers(app, path) {
  path = path || "modules/servers";
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
  log.debug("loadHandler: file: %s, path: %s", file, path);
  var name = "server_handler_" + file.slice(0, -3);
  var content = fs.read(path);
  module.define(name, content);
  var handler = require(name);
  handler(app);
}
