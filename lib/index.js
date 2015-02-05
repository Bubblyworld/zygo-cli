#!/usr/bin/env node
var Zygo = require('zygo-server');
var path = require('path');
var cli = require('cli');
var log = require('./log');

//Set up options and documentation.
cli.parse({
  //commands
  serve: ['s', 'Start a zygo server instance serving your app.'],
  bundle: ['b', 'Bundle the application. Run on server start-up in prod mode.'],
  unbundle: ['u', 'Remove bundles and bundle config. Run on server start-up in dev mode.'],
  'set-mode': ['m', 'Set application mode to production or development.', 'string'],

  //context
  debug: [false, 'Print detailed error messages.'],
  port: ['p', 'Overrides the server port specified in zygo.json.', 'number'],
  dir: ['d', 'Directory to bundle into.', 'dir']
});

cli.main(function(args, options) {
  log.printInfo("Initialising zygo CLI. For help, run:    zygo --help");
  var zygoJSON = args[0] || 'zygo.json';
  var zygo = new Zygo(zygoJSON);

  zygo.initialize()
    .then(function() {
      log.printOk("Initialised.");

      //Run any commands they may have specified.
      if (options['set-mode']) return setmode(zygo, options);
      if (options.bundle) return bundle(zygo, options);
      if (options.unbundle) return unbundle(zygo, options);
      return serve(zygo, options); //default
    })
    .catch(function(error) {
      log.printError("Could not load zygo.json. Run zygo-cli as follows:");
      log.printNormal("zygo [options] zygo.json");
      log.printNormal(getError(error, options));
    });
});

//Spin up a server instance.
function serve(zygo, options) {
  var port = options.port || zygo.config.port;

  return Promise.resolve()
    .then(function() {
      if (zygo.config.env === 'production') {
        log.printInfo('Running in prod, pre-bundling app...');
        return bundle(zygo, options);
      }

      if (zygo.config.env === 'development') {
        log.printInfo('Running in dev, removing any existing bundles...');
        return unbundle(zygo, options);
      }

      throw new Error("env in zygo.json should be 'production' or 'development'.");
    })
    .then(function() {
      log.printInfo("Spinning up server instance...");
      return zygo.createServer(port)
        .then(function() {
          log.printOk("Success, listening on port " + port + '.');
        })
        .catch(function(error) {
          log.printError("Error starting server instance.");
          log.printNormal(getError(error, options));
        });
      });
}

//Save new environment
function setmode(zygo, options) {
  if (options['set-mode'] === 'dev') options['set-mode'] = 'development';
  if (options['set-mode'] === 'prod') options['set-mode'] = 'production';
  if (options['set-mode'] !== 'development' && options['set-mode'] !== 'production') {
    log.printError("setmode accepts two environments: dev[elopment] and prod[uction].");
    return;
  }

  log.printInfo("Updating environment mode to " + options['set-mode'] + '.');
  zygo.config.env = options['set-mode'];
  return Zygo.Config.save(zygo.config, {
    env: {}
  })
    .then(function() {
      log.printOk("Updated.");
    })
    .catch(function(error) {
      log.printError("Error updating environment config.");
      log.printNormal(getError(error, option));
    });
}

//Manually run bundling.
function bundle(zygo, options) {
  //If they specify a build directory, update the config.
  if (options.dir) {
    options.dir = path.resolve(process.cwd(), options.dir);

    log.printInfo("Build dir specified, updating zygo.json...");
    zygo.config.buildDir = options.dir;
    return Zygo.Config.save(zygo.config, {
      buildDir: { type: 'path' }
    })
      .then(function() {
        log.printOk("Updated.");
        options.dir = null;

        bundle(zygo, options);
      })
      .catch(function(error) {
        log.printError("Could not save build dir.");
        log.printNormal(getError(error, options));
      });
  }

  log.printInfo("Bundling app...");
  return zygo.bundle()
    .then(function() {
      log.printOk("Successfully built bundles.");
    })
    .catch(function(error) {
      log.printError("Issue bundling app.");
      log.printNormal(getError(error, options));
    });
}

//Unbundle the application.
function unbundle(zygo, options) {
  log.printInfo("Unbundling app...");
  return zygo.unbundle()
    .then(function() {
      log.printOk("Successfully unbundled.");
    })
    .catch(function(error) {
      log.printError("Issue unbundling app.");
      log.printNormal(getError(error, options));
    });
}

//Utility function. Given an error, returns what should be printed based on CLI debug flag.
function getError(error, options) {
  if (options.debug) return error.stack;
  return error;
}
