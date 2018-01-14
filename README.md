A CLI command to start up a node server, execute another CLI command (while node server is still running) and then exit the node server.

[![NPM Version][npm-image]][npm-url]
[![Linux CI Build][travis-image]][travis-url]
[![Windows CI Build][appveyor-image]][appveyor-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]


# Why on earth would you want that?

I created node-while for my specific use case - I wanted to start up my node server, run my integration tests and then stop the server (all via a single CLI command). This seemed like a reasonable way to do it + I thought it might be useful for someone else.


# Install

```console
npm install node-while
```

# Usage

To be used with node-while, your node server needs to do 2 things;
  1. export the express app instance as default
  2. emit the event 'ready' when the server has finished init (e.g. connected to DB) and is ready to recieve requests

e.g.
```javascript
//For ES6
import express from 'express';
const app = express();

const server = app.listen('8080', function () {
  //2. emit a 'ready' event when server is ready for interaction
  server.emit('ready');
});

//1. export the app instance as default
export default server;
```

```javascript
//or for vanilla ES5
var express = require('express');
var app = express();

var server = app.listen('8080', function () {
  //2. emit a 'ready' event when server is ready for interaction
  server.emit('ready');
});

//1. export the app instance as default
exports.default = server;
```

You can use node-while like so
```console
npx node-while -server ./src/myServer.js -run "echo squanch"
```

(concrete example) In my particular case I use node-while to run my cypress integration tests
```console
npx node-while -s ./dist/server/index.js -run "npx cypress run"
```

See `node-while -h` for addition params

# Help, my server code uses babel/typscript

node-while doesnt currently have hooks for transpilers etc. Current recommendation is to transpile code e.g. with babel CLI (as your probably doing for production anyway) and then execute that with node-while. 


[npm-image]: https://img.shields.io/npm/v/node-while.svg
[npm-url]: https://npmjs.org/package/node-while
[travis-image]: https://img.shields.io/travis/gregtillbrook/node-while/master.svg?label=Linux%20CI%20Build
[travis-url]: https://travis-ci.org/gregtillbrook/node-while
[appveyor-image]: https://img.shields.io/appveyor/ci/gregtillbrook/node-while/master.svg?label=Windows%20CI%20Build
[appveyor-url]: https://ci.appveyor.com/project/gregtillbrook/node-while
[snyk-image]: https://snyk.io/test/github/gregtillbrook/node-while/badge.svg
[snyk-url]: https://snyk.io/test/github/gregtillbrook/node-while