var express = require('express');
var app = express();

var server = app.listen(8080, function() {
  console.log('server STARTED');
  server.emit('ready', null);
});

// process.on('SIGINT', function() {
//   console.log('server SIGINT');
//   process.exit(0);
// });

// process.on('SIGTERM', function () {
//   console.log('server SIGTERM');
//   process.exit(0);
// });

server.on('close', function () {
  console.log('server CLOSE EVENT');
});

module.exports.server = server;