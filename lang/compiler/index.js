#! /usr/bin/env node

const Cli = require('./cli');
const Config = require('./config');
const Parser = require('./parser');


const make = () => {
  Config.initialize()
    .then(() => {
      Parser.run();
    }).catch ((e) => {});
}

const watch = () => {
  Config.initialize()
    .then(() => {
      console.log('cmd: watch');
    }).catch ((e) => {});
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