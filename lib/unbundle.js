var log = require('./log');

//Unbundle the application.
module.exports = function(zygo, options) {
  log.printInfo("Unbundling app...");

  return zygo.unbundle()
    .then(function() {
      log.printOk("Successfully unbundled.");
    })
    .catch(function(error) {
      log.printError("Issue unbundling app.");
      log.printNormal( log.getError(error, options) );
    });
}
