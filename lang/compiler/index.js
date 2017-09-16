#! /usr/bin/env node

const Cli = require('./cli');
const Config = require('./config');
const Parser = require('./parser');


const make = () => {
  Config.initialize()
    .then(() => {
      Parser.run();
    }, () => {
      console.log('Config.initialize() failed');
    });
}

const watch = () => {
  Config.initialize()
    .then(() => {
      console.log('cmd: watch');
    }, () => {
      console.log('Config.initialize() failed');
    });
}

switch (Cli.getCmd()) {
  case Cli.MAKE:
    return make();
  case Cli.WATCH:
    return watch()
  case Cli.INIT:
    return Config.bootstrap();
  default:
    return false;
}