const url = require('url');
const http = require('http');
const proxyServer = ( require('http-proxy') ).createProxyServer( );

httpServer = http.createServer( (request, response) => {
  var port = url.parse( request.url ).pathname.split( '/' )[1] === 'api' ? 3030 : 3000;
  proxyServer.web( request, response, {
    target: {
      host: 'localhost',
      port: port
    }
  });
}).listen( 8080, ()=>{
  console.log('Proxy Listening');
  console.log('"/api/*" => "http://localhost:3030/ (Rails Server)"');
  console.log('"/*/" => "http://localhost:3000/ (React Dev Environment)"');
  console.log('');
} );
