var log = require('./log');
var fs = require('fs');
var child_process = require('child_process');

//Spin up a server instance.
module.exports = function(zygo, options) {
  return Promise.resolve()
    .then(initJspm)
    .then(installDeps)
    .then(initZygo);
};

function initJspm() {
  return new Promise(function(resolve, reject) {
    log.printInfo("Initialising JSPM...");

    child_process.exec('jspm init -y', function(error) {
      if (error) return reject(error);

      log.printOk("JSPM successfully initialised.\n");
      return resolve();
    });
  });
}

function installDeps() {
  return new Promise(function(resolve, reject) {
    log.printInfo("Initialising zygo dependencies...");

    child_process.exec('jspm install react zygo jsx css', function(error) {
      if (error) return reject(error);

      log.printOk("Dependencies installed.\n");
      return resolve();
    });
  });
}

var zygoJSON = {
  routes: "./routes.json",
  middleware: [],
  defaultContext: {}
};

var routesJSON = {
};

function initZygo() {
  return new Promise(function(resolve, reject) {
    log.printInfo("Initialising zygo...");

    fs.writeFile('zygo.json', JSON.stringify(zygoJSON, null, 2), function(error) {
      if (error) return reject(error);
      log.printOk("Created zygo.json.");

      fs.writeFile('routes.json', JSON.stringify(routesJSON, null, 2), function(error) {
        if (error) return reject(error);
        log.printOk("Created routes.json.");
        return resolve();
      });
    });
  });
}
