#! /usr/bin/env node


const CLI = require('./cli');
const CONFIG = require('./config');


if (CONFIG.isValid()) {
  switch (CLI.getCmd()) {
    case CLI.MAKE:
      // parse mono files
      return console.log("make");
    case CLI.WATCH:
      return console.log('watch');
    case CLI.INIT:
      // add bootstrap monoConfig.json file (if not present)
      return console.log('init');
    default:
      return false;
  }
} else {
  console.log('config not valid');
}
