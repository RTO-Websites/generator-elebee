/**
 * @name generator-elebee
 * @author RTO GmbH <info@rto.de>
 * @license MIT
 * @description
 *   Yeoman generator.
 * @example
 *   Usage:
 *     yo elebee
 */
'use strict';

const pkg = require('../package');
const Generator = require('yeoman-generator');
const Yosay = require('yosay');
const Download = require('download');
const Fs = require('fs');
const FsExtra = require('fs.extra');
const UpdateNotifier = require('update-notifier');
const Notifier = UpdateNotifier({pkg});
const Spinner = require('cli-spinner').Spinner;
const _ = require('underscore.string');
const ExecuteCommand = require('./execute-command.js');

/**
 *
 */
class GeneratorBase extends Generator {

  constructor(args, opts) {

    super(args, opts);

    Notifier.notify();

    this.spinner = new Spinner();
    this.spinner.setSpinnerString('|/-\\');

  }

  /**
   *
   * @param options
   */
  install(options) {

    this.options = options;

    this.projectPath = this.destinationPath(options.projectName);

    if (options.installWp) {
      this.installWp();
    }
    else {
      this.installTheme();
    }

  }

  /**
   *
   */
  installWp() {

    this.spinner.setSpinnerTitle('Installing Wordpress... %s');
    this.spinner.start();

    this.wpUrl = 'https://wordpress.org/';
    this.wpUrl += this.options.wpVersion == 'latest' ? 'latest.zip' : 'wordpress-' + this.options.wpVersion + '.zip';

    var downloadOptions = {
      extract: true
    };
    Download(this.wpUrl, this.projectPath, downloadOptions).then(() => {
      this.unpackWp();
    });

  }

  /**
   *
   */
  unpackWp() {

    this.tmpDir = this.projectPath + '/' + this.options.projectName;
    Fs.renameSync(this.projectPath + '/wordpress', this.tmpDir);
    FsExtra.copyRecursive(this.tmpDir, this.projectPath, (error) => {
      this.finishWpInstallation(error);
    });

  }

  /**
   *
   * @param error
   */
  finishWpInstallation(error) {

    if (error) {
      throw error;
    }
    FsExtra.rmrfSync(this.tmpDir);

    this.spinner.stop(true);
    console.log('\nWordPress installed!');

    this.installTheme();

  }

  /**
   *
   */
  installTheme() {

    this.spinner.setSpinnerTitle('Installing elebee... %s');
    this.spinner.start();

    if (!this.options.installWp) {

      Fs.mkdirSync(this.projectPath);
      Fs.mkdirSync(this.projectPath + '/wp-content');

    }

    this.wpContentPath = this.projectPath + '/wp-content';
    this.themeSlug = _.camelize(_.slugify(_.humanize(this.options.siteName)));
    this.themeUrl = 'https://github.com/RTO-Websites/Wordpress-Theme-Elebee/archive/master.zip';
    this.themePath = this.wpContentPath + '/' + this.themeSlug;

    var downloadOptions = {
      extract: true
    };
    Download(this.themeUrl, this.wpContentPath, downloadOptions).then(() => {
      this.finishThemeInstallation();
    });

  }

  /**
   *
   */
  finishThemeInstallation() {

    Fs.renameSync(this.wpContentPath + '/Wordpress-Theme-Elebee-master', this.themePath);

    this.spinner.stop(true);
    console.log('\nelebee installed!');

    this.initializeTheme();

  }

  /**
   *
   */
  initializeTheme() {

    console.log('Initializing theme...');

    this.setupStyleScss();

    var execOptions = {
      cwd: this.themePath
    };

    this.initializationCount = 0;

    ExecuteCommand('npm install', execOptions, () => {
      this.finishThemeInitialization()
    });

    ExecuteCommand('bower install', execOptions, () => {
      this.finishThemeInitialization()
    });

    execOptions.cwd = this.themePath + '/src';
    ExecuteCommand('composer install', execOptions, () => {
      this.finishThemeInitialization()
    });

  }

  /**
   *
   */
  setupStyleScss() {

    var styleCSS =
      '/*\n' +
      'Theme Name: ' + this.options.siteName + '\n' +
      'Description: ' + this.options.description + '\n' +
      'Author: ' + this.options.authorName + '\n' +
      'Author URI: ' + this.options.authorUrl + '\n' +
      'Version: 0.0.1\n' +
      'License: ' + '\n' +
      'License URI: ' + '\n' +
      'Text Domain: elebee\n' +
      '\n' +
      'Copyright 2018 RTO GmbH\n' +
      '*/';

    Fs.writeFile(this.themePath + '/src/style.css', styleCSS);

  }

  /**
   *
   */
  finishThemeInitialization() {

    ++this.initializationCount;

    if (this.initializationCount < 3) {
      return
    }

    console.log('\nTheme initialized! You are ready to go.');

  }

}

/**
 *
 */
class GeneratorElebee extends GeneratorBase {

  /**
   *
   * @param args
   * @param opts
   */
  constructor(args, opts) {

    super(args, opts);

    console.log(Yosay('Hello and welcome to the Elebee WordPress theme generator'));

  }

  /**
   *
   * @returns {PromiseLike<T> | Promise<T>}
   */
  prompting() {

    return this.prompt([
      {
        type: 'confirm',
        name: 'installWp',
        message: 'Install Wordpress?',
        store: true
      },
      {
        when: function (answers) {
          return answers.installWp;
        },
        type: 'input',
        name: 'wpVersion',
        message: 'Version',
        default: 'latest',
        store: true
      },
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name',
        default: 'wordpress',
        store: true
      },
      {
        type: 'input',
        name: 'siteName',
        message: 'Enter a theme name',
        default: 'My Theme Name'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Enter a description for your theme',
        default: 'Custom WordPress Theme'
      },
      {
        type: 'input',
        name: 'authorName',
        message: 'Author Name',
        default: 'RTO GmbH',
        store: true
      },
      {
        type: 'input',
        name: 'authorEmail',
        message: 'Author E-Mail',
        default: 'info@rto.de',
        store: true
      },
      {
        type: 'input',
        name: 'authorUrl',
        message: 'Author url',
        default: 'https://www.rto.de/',
        store: true
      },
      {
        type: 'input',
        name: 'license',
        message: 'License',
        default: 'MIT',
        store: true
      },
      {
        type: 'input',
        name: 'repositoryType',
        message: 'Repository type',
        default: 'git',
        store: true
      },
      {
        type: 'input',
        name: 'repositoryUrl',
        message: 'Repository url',
        default: 'https://github.com/RTO-Websites/Wordpress-Theme-Elebee.git'
      },
      {
        type: 'input',
        name: 'themeUrl',
        message: 'Theme url',
        default: 'https://github.com/RTO-Websites/Wordpress-Theme-Elebee'
      }
    ]).then((answers) => {
      this.install(answers);
    });

  }

}

/**
 *
 * @type {module.exports}
 */
module.exports = GeneratorElebee;