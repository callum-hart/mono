/*
  CLI args

  2 ways to compile mono:

  1. make: build project from scratch
  2. watch: re-build project on files changes
*/

const _ = require('lodash');


const MAKE = 'make';
const WATCH = 'watch';
const USER_ARGS = process.argv.slice(2);


const isValid = () => {
  return !_.isEmpty(USER_ARGS);
}

const getArgs = () => {
  const monoArg = _.head(USER_ARGS);

  switch (monoArg) {
    case MAKE:
      return console.log('make project');
    case WATCH:
      return console.log('watch project files');
    default:
      console.log(`unrecognized monoArg: ${monoArg}`);
      return process.exit();
  }
}

module.exports = { isValid, getArgs };