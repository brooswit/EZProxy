const url = require('url');
const http = require('http');
const proxyServer = ( require('http-proxy') ).createProxyServer( );

const config = require('./config.json');
const port = config.port;
const routes = config.routes;

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}

http.createServer( (request, response) => {
  var path = request.url;

  // if a matching path exists, this loop will not complete
  for (var routeIndex in routes){
    var route = routes[routeIndex];

    for (var charIndex = 0; charIndex < route.path.length; charIndex++) {
      var routeChar = route.path[charIndex];
      var char = path[charIndex];

      if (routeChar != char) {
        charIndex = route.path.length;

      } else if (charIndex == route.path.length-1) {
        var newPath = route.destination;

        charIndex++;

        for(; charIndex < path.length; charIndex++){
          newPath += path[charIndex];
        }

        proxyServer.web(request, response, {
          target: newPath
        });

        return;
      }
    }
  }
}).listen(port, ()=>{
  console.log('Proxy listening on port {0}'.format(port));
  routes.forEach((route)=>{
    console.log('"{0}" => "{1}"'.format(route.path, route.destination));
  });
});
