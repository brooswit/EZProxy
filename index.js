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
  if (path[path.length-1] == '/') {
    path = path.substring(0, path.length - 1);
  }

  // if a matching path exists, this loop will not complete
  for (var routeIndex in routes){
    var route = routes[routeIndex];
        console.log("checkin " +route.path+ " vs " +path);

    for (var charIndex = 0; charIndex <= route.path.length; charIndex++) {
      var routeChar = route.path[charIndex];
      var char = path[charIndex];

      if (charIndex == route.path.length) {
        console.log('yup');
        var newPath = route.destination + "/";
        console.log("new path: " + newPath);

        for(charIndex = charIndex + 1; charIndex < path.length; charIndex++){
          newPath += path[charIndex];
        }
        console.log('doin it');
        console.log("new NEW path: " + newPath);

        proxyServer.web(request, response, {
          forward: newPath
        });

        console.log('=============================================');

        return;
      }
      else if (routeChar != char) {
        console.log('NOPE');
        charIndex = route.path.length;
      } 
    }
  }
}).listen(port, ()=>{
  console.log('Proxy listening on port {0}'.format(port));
  routes.forEach((route)=>{
    console.log('"{0}" => "{1}"'.format(route.path, route.destination));
  });
});
