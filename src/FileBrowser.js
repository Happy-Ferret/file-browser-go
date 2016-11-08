/* API for all file-browser commands */

let through2 = require('through2');
let assert = require('assert');

let Command = require('./Command.js');
let FileOperations = require('./FileOperations.js');
let StringDecoder = require('string_decoder').StringDecoder;

const decoder = new StringDecoder();

class FileBrowser {
  
  constructor(shell) {
    assert(shell);
    this.shell = shell;   

    this.stdin = through2({
      objectMode: true
    }, (chunk, encoding, cb) => {
      cb(null, JSON.stringify(chunk));
    });

    this.stdout = through2({
      objectMode: true
    }, (chunk, encoding, cb) => {
      let data = decoder.write(chunk);
      cb(null, JSON.parse(data));
    });

    this.stdin.pipe(this.shell.stdin);
    this.shell.stdout.pipe(this.stdout);
  }

// Sync commands
  
  identifyAndResolve (command, path) {
    let prom = new Promise(resolve => {
      return this.stdout.on('data', resultSet => {
        let cmd = resultSet.cmd;
        let resPath = resultSet.path;

        if(cmd == command && resPath == path) {
          return resolve(resultSet);
        }
      });
    });
    return prom;
  }

  async ls(path) {
    let command = Command.ls(path);

    this.stdin.write(command);
    return this.identifyAndResolve("ls", path);
  }

  async rm (path) {
    this.stdin.write(Command.rm(path));
    return this.identifyAndResolve("rm", path);
  }

  async mv (oldpath, newpath) {
    this.stdin.write(Command.mv(oldpath, newpath));
    return this.identifyAndResolve("mv", newpath);
  }

  async mkdir (path) {
    this.stdin.write(Command.mkdir(path));
    return this.identifyAndResolve("mkdir", path);
  }

  // Async commands
  async cp (oldpath, newpath) {
    this.stdin.write(Command.cp(oldpath, newpath));
    return this.identifyAndResolve("cp", newpath);
  }

  kill () {
    this.shell.kill();
    this.stdin.destroy();
    this.stdout.destroy();
    return 0;
  }

  // getfile and putfile
  
}

module.exports = FileBrowser;