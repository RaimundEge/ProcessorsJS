var http = require("http");

http.createServer(function(request, response) {
  console.log(request)
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("It's really alive!");
  response.end();
}).listen(3000);

