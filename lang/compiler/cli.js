/*
  CLI args

  2 ways to compile mono:

  1. make: build project from scratch
  2. watch: re-build project on files changes
*/

const _ = require('lodash');


const log = require('./log').cli;


const MAKE = 'make';
const WATCH = 'watch';
const INIT = 'init';
const USER_ARGS = process.argv.slice(2);


const argsPresent = () => {
  return !_.isEmpty(USER_ARGS);
}

const getCmd = () => {
  const firstArg = _.head(USER_ARGS);

  if (argsPresent()) {
    switch (firstArg) {
      case MAKE:
        return MAKE;
      case WATCH:
        return WATCH;
      case INIT:
        return INIT;
      default:
        return log.UNRECOGNIZED_ARGUMENT(firstArg);
    }
  } else {
    log.NO_ARGUMENT();
  }
}

module.exports = { MAKE, WATCH, INIT, getCmd };