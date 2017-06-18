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

httpServer = http.createServer( (request, response) => {
  var path = request.url.split('/');
    path.shift();
    path = path.join('/');

  var bestRouteDestination;
  var bestRouteScore=0;

  for(var routeIndex in routes){
    var route = routes[routeIndex];
    var score = 0;
    for (var charIndex in route.path) {
      if(route.path[charIndex] == path[charIndex]) {
        route.score ++;
      } else {
        charIndex = route.path.length;
      }
    }
    if(score>bestRouteScore){
      bestRouteDestination = route.destination;
      bestRouteScore = score;
    }
  }

  proxyServer.web(request, response, {
    target: bestRouteDestination
  });
}).listen( port, ()=>{
  console.log('Proxy listening on port {0}'.format(port));
  routes.forEach((route)=>{
    console.log('"{0}" => "{1}"'.format(route.path, route.destination));
  });
} );
