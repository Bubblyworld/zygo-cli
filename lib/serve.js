var log = require('./log');
var bundle = require('./bundle');
var unbundle = require('./unbundle');

//Spin up a server instance.
module.exports = function(zygo, options) {
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
          log.printNormal( log.getError(error, options) );
        });
    });
};
