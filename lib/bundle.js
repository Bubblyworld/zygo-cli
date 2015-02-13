var Zygo = require('zygo-server');
var log = require('./log');
var path = require('path');

//Manually run bundling.
module.exports = bundle;
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
        log.printNormal( log.getError(error, options) );
      });
  }

  log.printInfo("Bundling app...");
  return zygo.bundle()
    .then(function() {
      log.printOk("Successfully built bundles.");
    })
    .catch(function(error) {
      log.printError("Issue bundling app.");
      log.printNormal( log.getError(error, options) );
    });
}
