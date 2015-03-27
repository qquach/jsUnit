/**
 *
 */
var httpUtil = {
  getHeader : function(headers, headerName) {
    var lcName = headerName.toLowerCase();
    for ( var i in headers) {
      var lc = i.toLowerCase();
      if (lcName == lc)
        return headers[i];
    }
    return undefined;
  },

  // assume url can be full url or partial such as relative url starts from a
  // path.
  parseUrl : function(url) {
    // get hash
    var index = url.indexOf("#");
    var hash = query = path = host = hostname = port = protocol = params = undefined;
    if (index != -1) {
      hash = url.substr(index + 1);
      url = url.substr(0, index);
    }
    // get query and params
    index = url.indexOf("?");
    if (index != -1) {
      query = url.substr(index + 1);
      params = httpUtil.parseUrlEncoded(query);
      url = url.substr(0, index);
    }
    // get protocol
    index = url.indexOf("://");
    if (index != -1) {
      protocol = url.substr(0, index);
      url = url.substr(index + 3);
    }
    // get host
    index = url.indexOf("/");
    if (index != -1) {
      if (index == 0) {
        path = url;
      } else {
        host = url.substr(0, index);
        path = url.substr(index);
      }
    } else {
      path = "/"; // set to root instead of empty
      host = url;
    }
    if (host) {
      index = host.indexOf(":");
      if (index != -1) {
        hostname = host.substr(0,index);
        port = host.substr(index + 1);
      } else {
        hostname = host;
        port = "";
      }
    }
    return {
      protocol : protocol,
      host : host,
      hostname : hostname,
      port : port,
      path : path,
      query : query,
      params : params,
      hash : hash
    }
  },
  parseUrlEncoded : function(text) {
    var data = {};
    var match, pl = /\+/g, // Regex for replacing addition symbol with a space
    search = /([^&=]+)=?([^&]*)/g, decode = function(s) {
      return decodeURIComponent(s.replace(pl, " "));
    };
    while (match = search.exec(text)) {
      data[decode(match[1])] = decode(match[2]);
    }

    return data;
  },
  getParamValues: function(match, params){
    var values = {};
    for(var i in params){
      values[i] = match[params[i]];
    }
    return values;
  }
}

module.exports = httpUtil;