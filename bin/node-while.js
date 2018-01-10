#! /usr/bin/env node

var terminal = require('commander');
var exec = require('child_process').exec;
var path = require('path');
var spawn = require('child_process').spawn;
var console = require('consolomatic').default;

terminal
  .version('0.1.0')
  .usage('-server "./src/myNodeServer.js" -run "echo example cli command while node still runnung"')
  .option('-s, --server [value]', 'The path to the node server to run during the command (path should be relative to current working dir)')
  .option('-r, --run [value]', 'The command to run after server is started (a string containing a CLI command)')
  .option('-t, --timeout [value]', 'The time (in ms) to wait for the node server to emit the "ready" event')
  .option('-q, --quiet', 'Stop node-while from emitting its status messages (errors will still be logged)')
  .parse(process.argv);

var cliCommand = terminal.run ? terminal.run : '';
var serverScriptUrl = terminal.server;
var nodeTimeout = terminal.timeout || 200;
var isQuiet = terminal.quiet;


if(!serverScriptUrl){
  throw new Error('server script (-s) is required. see help (node-while -h)')
}

if(!cliCommand){
  throw new Error('cli command (-r) is required. see help (node-while -h)')
}

var absoluteServerScriptUrl = path.join(process.cwd(), serverScriptUrl);
if(!isQuiet){
  console.log('node-while: Loading node server from "' + absoluteServerScriptUrl + '"');
}
var server = require(absoluteServerScriptUrl).default;

var nodeServerIsReady = false;
setTimeout(function(){
  if(!nodeServerIsReady){
    console.error('node-while: Timeout (' + nodeTimeout + 'ms) expired before node server was ready (or node server failed to emit "ready" event)');
    //attempt a graceful shutdown of server incase it IS running but dodnt emit ready event
    try {
      server.close();
    }catch(err){/*ignore errors here - there's nothing more we can do at this point*/}

    process.exit(1);
  }
}, nodeTimeout);

//TODO: decide how to handle node server errors...
server.on('ready', ()=>{
  nodeServerIsReady = true;
  if(!isQuiet){
    console.log('node-while: Node server ready event received. Executing command "' + cliCommand + '"');
  }

  var args = cliCommand.split(' ');
  var cmd = args.shift();

  //stdio:inherit WILL pass all pipes output (stdio, stderr & stdout) and also wont strip ANSI chars
  var cmdProcess = spawn(cmd, args, {stdio:'inherit'});
  cmdProcess.on('exit', function(code){
    if(!isQuiet){
      console.log('node-while: Command completed. Closing node server and exiting.');
    }
    server.close();
    process.exit(code);
  });
});
