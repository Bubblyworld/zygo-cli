#!/usr/bin/env node
var Zygo = require('zygo-server');
var path = require('path');
var cli = require('cli');
var log = require('./log');

//CLI handlers
var serve = require('./serve');
var bundle = require('./bundle');
var unbundle = require('./unbundle');
var setmode = require('./setmode');
var version = require('./version');
var init = require('./init');

//Set up options and documentation.
cli.parse({
  //commands
  serve: ['s', 'Start a zygo server instance serving your app.'],
  bundle: ['b', 'Bundle the application. Run on server start-up in prod mode.'],
  unbundle: ['u', 'Remove bundles and bundle config. Run on server start-up in dev mode.'],
  'set-mode': ['m', 'Set application mode to production or development.', 'string'],
  version: ['v', 'Output the current zygo-cli version.'],
  init: [false, 'Initialise a simple zygo project.'],

  //context
  debug: [false, 'Print detailed error messages.'],
  port: ['p', 'Overrides the server port specified in zygo.json.', 'number'],
  force: [false, 'Ignore warnings, just run.'],
  dir: ['d', 'Directory to bundle into.', 'dir']
});

cli.main(function(args, options) {
  //Run initialisation script
  if (options.init) return init();

  var zygoJSON = args[0] || 'zygo.json';
  var zygo = new Zygo(zygoJSON);

  //Are we running in debug mode?
  if (options.debug)
    zygo.setDebugMode(true);

  log.printInfo("Initialising zygo CLI. For help, run:    zygo --help");
  zygo.initialize()
    .then(function() { log.printOk("Initialised."); })
    .then(runOnCondition(!!options.version, version))
    .then(runOnCondition(!!options['set-mode'], setmode))
    .then(runOnCondition(!!options.bundle, bundle))
    .then(runOnCondition(!!options.unbundle, unbundle))
    .then(runOnCondition(!!options.serve, serve))
    .catch(function(error) {
      log.printError("Error initialising Zygo CLI.");
      log.printNormal( log.getError(error, options) );
    });

  //Given a condition, run the given cli handler on true.
  function runOnCondition(cond, hand) {
    return function() {
      if (cond) return hand(zygo, options);
      return Promise.resolve();
    };
  }
});
