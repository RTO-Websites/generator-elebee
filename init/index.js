/**
 * @name ElebeeInitGenerator
 * @author RTO GmbH <info@rto.de>
 * @license MIT
 * @since 0.2.0
 * @description
 *   Yeoman generator for initializing elebee.
 * @example
 *   Usage:
 *     yo elebee:loadDependencies
 */
'use strict';

const Generator = require('yeoman-generator');
const ExecuteCommand = require('../app/execute-command.js');

/**
 * @since 0.2.0
 */
class GeneratorBase extends Generator {

  /**
   * @since 0.2.0
   * @param args
   * @param opts
   */
  constructor(args, opts) {

    super(args, opts);

  }

}

/**
 * @since 0.2.0
 */
class GeneratorInit extends GeneratorBase {

  /**
   * @since 0.2.0
   * @param args
   * @param opts
   */
  constructor(args, opts) {

    super(args, opts);

  }

  /**
   * @since 0.2.0
   */
  init() {

    ExecuteCommand('npm install');
    ExecuteCommand('bower install');
    ExecuteCommand('composer install', {cwd: 'src'});

  }

}

/**
 *
 * @type {module.exports}
 */
module.exports = GeneratorInit;
