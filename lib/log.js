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


module.exports = {
  printOk: getFancy(green, 'ok'),
  printInfo: getFancy(blue, 'info'),
  printError: getFancy(red, 'error'),
  printNormal: getFancy(normal, '')
};
