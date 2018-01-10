//this mock also serves as a bare bones example of what the node server needs to expose
var express = require('express');
var app = express();

var server = app.listen('2345', function () {
  server.emit('ready');
});

exports.default = server;