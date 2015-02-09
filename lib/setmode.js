var Zygo = require('zygo-server');
var log = require('./log');

//Save new environment
module.exports = function(zygo, options) {
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
      log.printNormal( log.getError(error, option) );
    });
}
