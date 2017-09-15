#! /usr/bin/env node

const Cli = require('./cli');
const Config = require('./config');


const make = () => {
  if (Config.isValid()) {
    console.log('cmd: make');
  }
}

const watch = () => {
  if (Config.isValid()) {
    console.log('cmd: watch');
  }
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