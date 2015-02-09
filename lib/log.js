//ANSII codes
var normal = '\033[0m';
var red = '\033[31m';
var green = '\033[32m';
var blue = '\033[34m';

//For printing nice terminal messages with colour and things.
function getFancy(modifier, tag) {
  return function(msg) {
    msg = msg || '';
    console.log(modifier + ' '.repeat(6 - tag.length) + tag + ' '  + normal + msg);
  };
}

//Utility function. Given an error, returns what should be printed based on CLI debug flag.
function getError(error, options) {
  if (options.debug) return error.stack;
  return error;
}

module.exports = {
  printOk: getFancy(green, 'ok'),
  printInfo: getFancy(blue, 'info'),
  printError: getFancy(red, 'error'),
  printNormal: getFancy(normal, ''),
  getError: getError
};
