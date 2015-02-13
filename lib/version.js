var log = require('./log');

module.exports = function(zygo, options) {
  log.printInfo("ZygoCLI v" + require('../package.json').version);
};
