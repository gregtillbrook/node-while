var exec = require('child_process').exec;
var stripAnsi = require('strip-ansi');


describe('node-while cli', ()=>{

  describe('required params', ()=>{

    it('should err if server script omitted', (done)=>{
      exec('node ./bin/node-while.js', function(error, stdout, stderr) {
        expect(stdout).toEqual('');
        expect(stderr).toContain('Error: server script (-s) is required');
        done();
      });
    });

    it('should err if server script is invalid', (done)=>{
      exec('node ./bin/node-while.js -s -r "echo foo"', function(error, stdout, stderr) {
        expect(stdout).toEqual('');
        expect(stderr).toContain('TypeError: Path must be a string');
        done();
      });
    });

    it('should err if CLI command is invalid', (done)=>{
      exec('node ./bin/node-while.js -s ./test/mocks/good-mock-server.js', function(error, stdout, stderr) {
        expect(stdout).toEqual('');
        expect(stderr).toContain('Error: cli command (-r) is required');
        done();
      });
    });

    it('should err if CLI command is empty', (done)=>{
      exec('node ./bin/node-while.js -s ./test/mocks/good-mock-server.js -r ""', function(error, stdout, stderr) {
        expect(stdout).toEqual('');
        expect(stderr).toContain('Error: cli command (-r) is required');
        done();
      });
    });

  });

  describe('normal bahviour', ()=>{
    
    var consoleOutputForSuccessfulRun = 'node-while: Loading node server from "/Users/Greg/workspace/github/node-while/test/mocks/good-mock-server.js"\n\
node-while: Node server ready event received. Executing command "echo squanch that squanch"\n\
squanch that squanch\n\
node-while: Command completed. Closing node server and exiting.\n';

    it('should execute command after server start and then shut server', (done)=>{
      exec('node ./bin/node-while.js -s ./test/mocks/good-mock-server.js -r "echo squanch that squanch"', function(error, stdout, stderr) {
        //strip off styling/hidden characters so compare is cleaner - we only care about execution order
        expect(stripAnsi(stdout)).toEqual(consoleOutputForSuccessfulRun);
        expect(stderr).toEqual('');
        done();
      });
    });

    it('should not output node-while: log statements when in quiet mode (-q)', (done)=>{
      exec('node ./bin/node-while.js -q -s ./test/mocks/good-mock-server.js -r "echo squanch that squanch"', function(error, stdout, stderr) {
        //strip off styling/hidden characters so compare is cleaner - we only care about execution order
        expect(stripAnsi(stdout)).toEqual('squanch that squanch\n');
        expect(stderr).toEqual('');
        done();
      });
    });

  });  

  describe('error handling', ()=>{

    it('should notify user if node server doesnt exit ready event', (done)=>{
      exec('node ./bin/node-while.js -t "111" -s ./test/mocks/bad-mock-server.js -r "echo squanch that squanch"', function(error, stdout, stderr) {
        //strip off styling/hidden characters so compare is cleaner - we only care about execution order
        expect(stripAnsi(stdout).trim()).toEqual('node-while: Loading node server from "/Users/Greg/workspace/github/node-while/test/mocks/bad-mock-server.js"');
        expect(stripAnsi(stderr).trim()).toEqual('node-while: Timeout (111ms) expired before node server was ready (or node server failed to emit "ready" event)');
        done();
      });
    });

  });  

});
