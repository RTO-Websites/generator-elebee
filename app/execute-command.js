/**
 * @author RTO GmbH <info@rto.de>
 * @version 0.1.0
 * @license MIT
 */
'use strict';

const ChildProcess = require('child_process');
const Spinner = require('cli-spinner').Spinner;

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

    this.spinner = new Spinner();
    this.spinner.setSpinnerString('|/-\\');

  }

  /**
   *
   */
  exec() {

    this.startLoadingAnimation();

    var child = ChildProcess.exec(this.cmd, this.execOptions, (error, stdout, stderr) => {
      if (typeof(this.cb) === 'function') {
        this.cb();
      }
    });

    child.stdout.on('data', (data) => {
      // this.onData(data);
    });

    child.stderr.on('data', (data) => {

      this.stopLoadingAnimation();

      this.onError(data);

      this.startLoadingAnimation();

    });

    child.on('exit', (code) => {
      this.onExit(code);
    });

  }

  /**
   *
   */
  startLoadingAnimation() {

    this.spinner.setSpinnerTitle('Running "' + this.cmd + '"... %s');
    this.spinner.start();

  }

  /**
   *
   */
  stopLoadingAnimation() {

    this.spinner.stop(true);

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

    this.stopLoadingAnimation();
    console.log('Finished "' + this.cmd + '" with code ' + code);

  }

}

module.exports = ExecuteCommand;
