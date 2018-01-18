/**
 * @author RTO GmbH <info@rto.de>
 * @version 0.1.0
 * @license MIT
 */
'use strict';

var exec = require('child_process').exec,
    executeCommand;

/**
 * Execute a command using the NodeJS 'child_process' module.
 *
 * @param {string} cmd - Command to execute
 * @param {object} execOptions - Options to pass to 'exec' funtion
 * @param {function} [cb] - Callback function when command was
 * executed successfully.
 * @return {void}
 */
executeCommand = module.exports = function(cmd, execOptions, cb) {
  console.log('Running "' + cmd + '"...');
  var child = exec(cmd, execOptions, function(error, stdout, stderr) {
    if (typeof(cb) === 'function') {
      cb();
    }
  });

  child.stdout.on('data', function(data) {
    var str = data.toString();
    str.split(/(\r?\n)/g).forEach(function(line, index) {
      if(line !== '\n' && line !== '') {
      console.log(line);
    }
    });
  });

  child.stderr.on('data', function(data) {
    console.log(data);
  });

  child.on('close', function(code) {
    console.log('Finished "' + cmd + '" with code ' + code);
  });
};