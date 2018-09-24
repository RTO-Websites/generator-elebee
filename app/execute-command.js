/**
 * @author RTO GmbH <info@rto.de>
 * @version 0.1.0
 * @license MIT
 */
'use strict';

const ChildProcess = require('child_process');

/**
 * Handles command execution using the NodeJS 'child_process' module.
 *
 * @since 0.2.0
 */
class ExecuteCommand {

  /**
   *
   * @param cmd
   * @param execOptions
   * @param cb
   */
  constructor(cmd, execOptions, cb) {

    this.cmd = cmd;
    this.execOptions = execOptions;
    this.cb = cb;

  }

  /**
   *
   */
  exec() {

    var child = ChildProcess.exec(this.cmd, this.execOptions, (error, stdout, stderr) => {
      if (typeof(this.cb) === 'function') {
        this.cb();
      }
    });

    child.stdout.on('data', (data) => {
      // this.onData(data);
    });

    child.stderr.on('data', (data) => {

      this.onError(data);

    });

    child.on('exit', (code) => {
      this.onExit(code);
    });

  }

  /**
   *
   * @param data
   */
  onData(data) {

    var str = data.toString();
    str.split(/(\r?\n)/g).forEach((line, index) => {
      if (line !== '\n' && line !== '') {
        console.log(line);
      }
    });

  }

  /**
   *
   * @param error
   */
  onError(error) {

    console.log(error);

  }

  /**
   *
   * @param code
   */
  onExit(code) {

    console.log('Finished "' + this.cmd + '" with code ' + code);

  }

}

module.exports = ExecuteCommand;
