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

    this.initOptionDefinitions();

    this.spinner = new Spinner();
    this.spinner.setSpinnerString('|/-\\');

  }

  /**
   *
   */
  initOptionDefinitions() {

    this.optionDefinitions = [
      // {
      //   when: (answers) => {
      //     console.log(this.options.installWp);
      //     return !this.options.installWp;
      //   },
      //   type: 'confirm',
      //   name: 'installWp',
      //   message: 'Install Wordpress?',
      //   store: true,
      //   help: {
      //     desc: '',
      //     alias: 'i',
      //     type: Boolean
      //   }
      // },
      // {
      //   when: (answers) => {
      //     return (answers.installWp || (this.options.installWp && !this.options.wpVersion));
      //   },
      //   type: 'input',
      //   name: 'wpVersion',
      //   message: 'Version',
      //   default: 'latest',
      //   store: true,
      //   help: {
      //     desc: '',
      //     alias: 'v',
      //     type: String
      //   }
      // },
      {
        when: (answers) => {
          return !this.options.projectName;
        },
        type: 'input',
        name: 'projectName',
        message: 'Project name',
        default: 'wordpress',
        store: true,
        help: {
          desc: '',
          alias: 'p',
          type: String
        }
      },
      {
        when: (answers) => {
          return !this.options.authorName;
        },
        type: 'input',
        name: 'authorName',
        message: 'Author Name',
        default: 'RTO GmbH',
        store: true,
        help: {
          desc: '',
          alias: 'a',
          type: String
        }
      },
      {
        when: (answers) => {
          return !this.options.authorEmail;
        },
        type: 'input',
        name: 'authorEmail',
        message: 'Author E-Mail',
        default: 'info@rto.de',
        store: true,
        help: {
          desc: '',
          alias: 'e',
          type: String
        }
      },
      {
        when: (answers) => {
          return !this.options.authorUrl;
        },
        type: 'input',
        name: 'authorUrl',
        message: 'Author url',
        default: 'https://www.rto.de/',
        store: true,
        help: {
          desc: '',
          alias: 'u',
          type: String
        }
      },
      {
        when: (answers) => {
          return !this.options.themeName;
        },
        type: 'input',
        name: 'themeName',
        message: 'Enter a theme name',
        default: 'My Theme Name',
        help: {
          desc: '',
          alias: 't',
          type: String
        }
      },
      {
        when: (answers) => {
          return !this.options.themeDescription;
        },
        type: 'input',
        name: 'themeDescription',
        message: 'Enter a description for your theme',
        default: 'Custom WordPress Theme',
        help: {
          desc: '',
          alias: 'd',
          type: String
        }
      },
      {
        when: (answers) => {
          return !this.options.themeUrl;
        },
        type: 'input',
        name: 'themeUrl',
        message: 'Theme url',
        default: 'https://github.com/RTO-Websites/Wordpress-Theme-Elebee',
        help: {
          desc: '',
          alias: 'T',
          type: String
        }
      },
      {
        when: (answers) => {
          return !this.options.license;
        },
        type: 'input',
        name: 'license',
        message: 'License',
        default: 'MIT',
        store: true,
        help: {
          desc: '',
          alias: 'l',
          type: String
        }
      },
      {
        when: (answers) => {
          return !this.options.licenseUri;
        },
        type: 'input',
        name: 'licenseUri',
        message: 'License URI',
        default: 'https://opensource.org/licenses/MIT',
        store: true,
        help: {
          desc: '',
          alias: 'L',
          type: String
        }
      },
      {
        when: (answers) => {
          return !this.options.repositoryType;
        },
        type: 'input',
        name: 'repositoryType',
        message: 'Repository type',
        default: 'git',
        store: true,
        help: {
          desc: '',
          alias: 'r',
          type: String
        }
      },
      {
        when: (answers) => {
          return !this.options.repositoryUrl;
        },
        type: 'input',
        name: 'repositoryUrl',
        message: 'Repository url',
        default: 'https://github.com/RTO-Websites/Wordpress-Theme-Elebee.git',
        help: {
          desc: '',
          alias: 'R',
          type: String
        }
      }
    ];

    for(let i in this.optionDefinitions) {
      let option = this.optionDefinitions[i];
      this.option(option.name, {
        desc: option.message,
        alias: option.help.alias,
        type: option.help.type
      });
    }

  }

  /**
   *
   * @param options
   */
  install() {

    this.projectPath = this.destinationPath(this.options.projectName);

    if (this.options.installWp) {
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

    console.log('');
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

    try {
      this.tmpDir = this.projectPath + '/' + this.options.projectName;
      Fs.renameSync(this.projectPath + '/wordpress', this.tmpDir);
      FsExtra.copyRecursive(this.tmpDir, this.projectPath, (error) => {
        this.finishWpInstallation(error);
      });
    }
    catch (error) {
      this.onError(error);
    }

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
    console.log('WordPress installed!');

    this.installTheme();

  }

  /**
   *
   */
  installTheme() {

    console.log('');
    // this.spinner.setSpinnerTitle('Installing elebee... %s');
    // this.spinner.start();

    // if (!this.options.installWp) {
    //
    //   Fs.mkdirSync(this.projectPath);
    //   Fs.mkdirSync(this.projectPath + '/wp-content');
    //
    // }

    this.wpContentPath = this.projectPath + '/wp-content';
    this.themeSlug = _.camelize(_.slugify(_.humanize(this.options.themeName)));
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

    try {
      Fs.renameSync(this.wpContentPath + '/Wordpress-Theme-Elebee-master', this.themePath);

      this.spinner.stop(true);
      console.log('elebee installed!');

      this.initializeTheme();
    }
    catch (error) {
      this.onError(error);
    }

  }

  /**
   *
   */
  initializeTheme() {

    console.log('');
    console.log('Initializing theme...');

    this.setupStyleCss();

    var execOptions = {
      cwd: this.themePath
    };

    this.initializationCount = 0;

    var npmInstall = new ExecuteCommand('npm install', execOptions, () => {
      this.finishThemeInitialization()
    });
    npmInstall.exec();

    var bowerInstall = new ExecuteCommand('bower install', execOptions, () => {
      this.finishThemeInitialization()
    });
    bowerInstall.exec();

    execOptions.cwd = this.themePath + '/src';
    var composerInstall = new ExecuteCommand('composer install', execOptions, () => {
      this.finishThemeInitialization()
    });
    composerInstall.exec();

  }

  /**
   *
   */
  setupStyleCss() {

    var styleCSS =
      '/*\n' +
      'Theme Name: ' + this.options.themeName + '\n' +
      'Description: ' + this.options.themeDescription + '\n' +
      'Author: ' + this.options.authorName + '\n' +
      'Author URI: ' + this.options.authorUrl + '\n' +
      'Version: 0.0.1\n' +
      this.options.license ? 'License: ' + this.options.license + '\n' : '' +
      this.options.license ? 'License URI: ' + '\n' : '' +
      'Text Domain: elebee\n' +
      '\n' +
      'Copyright 2018 RTO GmbH\n' +
      '*/';

    Fs.writeFile(this.themePath + '/src/style.css', styleCSS, (error) => {
      if (error) {
        console.log(error);
      }
    });

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

  /**
   *
   * @param error
   */
  onError(error) {

    this.spinner.stop();
    console.log('\n');
    console.error(error);

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

  }

  /**
   *
   * @returns {PromiseLike<T> | Promise<T>}
   */
  prompting() {

    console.log(Yosay('Hello and welcome to the Elebee WordPress theme generator'));

    return this.prompt(this.optionDefinitions).then((answers) => {
      Object.assign(this.options, answers);
      this.install();
    });

  }

}

/**
 *
 * @type {module.exports}
 */
module.exports = GeneratorElebee;