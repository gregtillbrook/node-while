var express = require('express');
var app = express();

var server = app.listen('2345', function () {
  // oops - not emitting 'ready' event
});

exports.default = server;